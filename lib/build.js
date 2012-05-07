var glob = require('glob'),
    fs = require('fs'),
    async = require('async'),
    path = require('path'),
    marked = require('marked'),
    handlebars = require('handlebars'),
    mkdirp = require('mkdirp'),
    fsextra = require('fs-extra');

function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

function findTemplate(name, templates) {
  var tmp = name;

  while (tmp !== '.') {
    if (templates[tmp]) {
      return templates[tmp];
    }
    tmp = path.dirname(tmp);
  }
  return null;
}

function globPath(root, extension, callback) {
  var result = {};

  glob('**/*.' + extension, { cwd: root }, function(err, files) {
    if (err) {
      callback(err);
    } else {
      async.forEach(files, function(file, callback) {
        var p = path.resolve(path.join(root, file)),
            i = path.join(path.dirname(file), path.basename(file, '.' + extension));

	fs.readFile(p, function(err, data) {
          if(!result[i]) {
            result[i] = {};
          }
          result[i].path = path.join(path.dirname(file), path.basename(file, '.' + extension));
          result[i].data = data;

          callback(err);
        });
      }, function(err) {
        callback(err, result);
      });
    }
  });
}

function build(options) {
  globPath(options.src, 'md', function(err, markdown) {
    var content = {};

    Object.keys(markdown).forEach(function(i) {
      var tokens = marked.lexer(markdown[i].data.toString());
      for (var j = 0; j < tokens.length; j += 1) {
        if (tokens[j].type === 'heading') {
          markdown[i].title = tokens[j].text;
          break;
        } 
      }
      markdown[i].data = marked.parser(tokens);
      content[i] = {};
    });

    globPath(options.templates, 'html', function(err, templates) {
      globPath(options.partials, 'html', function(err, partials) {
        fs.readFile(options.global, function(err, data) {
          var global = {},
              output = {},
              renderPartials = {};

          if(err) {
            console.log('Did not found global site configuration %s. Continuing without.', options.global);
          } else {
            try {
              global = JSON.parse(data.toString());
            } catch(e) {
              console.error('Error parsing global site configuration %s. Continuing without.', options.global);
            }
          }

          Object.keys(content).forEach(function(i) {
            content[i].data = extend({
              dirname: path.basename(path.dirname(i))
            }, global);

            if(markdown[i]) {
              content[i].data = extend(content[i].data, {
                article: markdown[i].data,
                title: markdown[i].title
              });
            }
          });

          Object.keys(partials).forEach(function(p) {
            var name = path.basename(p);
            handlebars.registerPartial(name, partials[p].data.toString());
          });

          Object.keys(content).forEach(function(i) {
            var template = findTemplate(i, templates),
                view = content[i].data,
                result = null,
                output = path.join(options.output, i + '.html');

            if (template) {
              mkdirp(path.dirname(output), function(err) {
                if(err) {
                  console.error('Error creating output dir %s: %s', path.dirname(output), err);
                } else {
                  try {
                    handlebars.registerHelper('path', function(context) {
                      var relPath = path.relative(path.dirname(i), context);
                      return relPath !== '' ? relPath : '.';
                    });

                    handlebars.registerHelper('include', function(template, options){
                      var partial = handlebars.partials[template],
                          result = '';
 
                      var context = extend({}, this);
                      extend(context, options.hash);
                      
                      if (typeof partial === 'string') {
                        handlebars.partials[template] = handlebars.compile(partial);
                        partial = handlebars.partials[template];
                      }
                      return new handlebars.SafeString(partial(context));
                    });

                    result = handlebars.compile(template.data.toString());

                    fs.writeFile(output, result(view), function(err) {
                      if(err) {
                        console.log('Error while writing %s: %s', output, err);
                      } else {
                        console.log('Rendering %s.', output);
                      }
                    });
                  } catch(e) {
                    console.error('Error while rendering %s: %s', output, e.message);
                  }
                }
              });
            } else {
              console.warn('Did not find template for %s, ignoring input file.', i);
            }
          });

          glob('**/*', { cwd: options.src }, function(err, data) {
            if(err) {
              console.error('Error while copying non-template resources: %s', err);
            } else {
              async.filter(data, function(d, callback) {
                fs.stat(path.join(options.src, d), function(err, s) {
                  if (err || s.isDirectory() || /\.md$/.test(d)) {
                    callback(false);
                  } else {
                    callback(true);
                  }
                });
              }, function(data) {
                  data.forEach(function(d) {
                    var dir = path.join(options.output, path.dirname(d)),
                        src = path.join(options.src, d),
                        dst = path.join(options.output, d);

                    mkdirp(dir, function(err) {
                      if(err) {
                        console.error('Error creating destination dir %s.', dir);
                      } else {
                        fsextra.copyFile(src, dst, function(err) {
                          if(err) {
                            console.error('Error while copying file %s to %s.', src, dst);
                          } else {
                            console.log('Copied file to %s.', dst);
                          }
                        });
                      }
                    });
                  });
              });
            }
          });
        });
      });
    });
  });
}

module.exports = build;

if (require.main === module) {
  build(require('./config'));
}
