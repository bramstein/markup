var glob = require('glob'),
    fs = require('fs'),
    async = require('async'),
    path = require('path'),
    marked = require('marked'),
    Mustache = require('mustache'),
    mkdirp = require('mkdirp'),
    fsextra = require('fs-extra'),

    options = {
      "src": "src",
      "templates": "templates",
      "partials": "partials",
      "global": "site.json",
      "output": "public"
    };

function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
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

globPath(options.src, 'json', function(err, json) {
  var content = {};

  Object.keys(json).forEach(function(i) {
    try {
      json[i].data = JSON.parse(json[i].data.toString());
      content[i] = {};
    } catch(e) {
      console.error('Error parsing JSON %s: %s', json[i].path, e);
    }
  });

  globPath(options.src, 'markdown', function(err, markdown) {  
    Object.keys(markdown).forEach(function(i) {
      markdown[i].data = marked(markdown[i].data.toString());
      content[i] = {};
    });
  
    globPath(options.templates, 'mustache', function(err, templates) {
      globPath(options.partials, 'mustache', function(err, partials) {
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
            content[i].data = extend({}, global);
            
            if(json[i]) {
              content[i].data = extend(content[i].data, json[i].data);
            }
            
            if(markdown[i]) {
              content[i].data.article = markdown[i].data;
            }
          });
          
          Object.keys(partials).forEach(function(p) {
            var name = path.basename(p);
            renderPartials[name] = partials[p].data.toString();
          });
          
          Object.keys(content).forEach(function(i) {
            var template = templates[i] || templates[path.dirname(i)],
                view = content[i].data,
                result = null,
                output = path.join(options.output, i + '.html');
            
            if (template) {
              mkdirp(path.dirname(output), function(err) {
                if(err) {
                  console.error('Error creating output dir %s: %s', path.dirname(output), err);
                } else {
                  try {
                    result = Mustache.to_html(template.data.toString(), view, renderPartials);
                    fs.writeFile(output, Mustache.to_html(template.data.toString(), view, renderPartials), function(err) {
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
          
          glob('**/*', { cwd: options.templates }, function(err, data) {
            if(err) {
              console.error('Error while copying non-template resources: %s', err);
            } else {
              async.filter(data, function(d, callback) {
                fs.stat(path.join(options.templates, d), function(err, s) {
                  if (err || s.isDirectory() || /\.mustache$/.test(d)) {
                    callback(false);
                  } else {
                    callback(true);
                  }
                });
              }, function(data) {
                  data.forEach(function(d) {
                    var dir = path.join(options.output, path.dirname(d)),
                        src = path.join(options.templates, d),
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
}); 
