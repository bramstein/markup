var marked = require('marked'),
    Hypher = require('hypher'),
    mkdirp = require('mkdirp'),
    glob = require('glob'),
    minimatch = require('minimatch'),
    findit = require('findit'),
    path = require('path'),
    typogr = require('typogr'),
    english = require('hyphenation.en-us'),
    hl = require('highlight.js'),
    fs = require('fs'),
    h = new Hypher(english);
    
function parseMarkdown(text) {
    var tokens = marked.lexer(text);
    
    tokens.forEach(function (token) {
        if (token.type === 'code') {
            //token.text = token.text.value;
            //token.escaped = true;
        } else if (token.type === 'text' || token.type === 'paragraph' || token.type === 'html') {
            token.text = typogr.smartEllipses(typogr.smartDashes(token.text));
        }
    });
        
    text = marked.parser(tokens);
    
    return text;
}

function transform(src, dest, options, callback) {
    var header = fs.readFileSync(options.header),
        footer = '<footer class="span12"><p>Copyright &copy; 2008-' + (new Date().getUTCFullYear()) + ' Bram Stein</p></footer>',
        nav = {
            'Home': 'index.html',
            'Projects': 'projects/index.html',
            'Writing': 'articles/index.html',
            'About': 'about/index.html'
        };




    glob('**/*.md', {
        cwd: src,
        nosort: true
    }, function (err, files) {
        files.forEach(function (filename) {
            var source = path.resolve(src, filename),
                target = path.join(path.dirname(filename), path.basename(filename, '.md') + '.html'),
                targetDir = null,
                stylesheet = null,
                myless = null,
                code = null,
                less = null,
                navigation = null;
            
            if (path.basename(target) === 'README.html') {
                target = path.join(path.dirname(target), 'index.html');
            }
            
            target = path.resolve(path.join(dest, target));
            mkdirp.sync(path.dirname(target));
            console.log(target);
            //stylesheet = path.relative(path.dirname(target), dest + '/bootstrap/less/bootstrap.less');
            less = path.relative(path.dirname(target), dest + '/less.js');
            myless = path.relative(path.dirname(target), dest + '/my.less');
            code = path.relative(path.dirname(target), dest + '/code.js');
            
            navigation = Object.keys(nav).map(function (key) {
                return '<li><a href="' + path.relative(path.dirname(target), dest + '/' + nav[key]) + '">' + key + '</a></li>';
            });
            
            var text = fs.readFileSync(source, 'utf-8');
            //fs.writeFileSync(target, '<html><head><meta charset="utf-8"><link rel="stylesheet/less" href="' + stylesheet + '"><link rel="stylesheet/less" href="' + myless + '"><script src="' + code + '"></script><script src="' + less + '"></script><script type="text/javascript" src="http://use.typekit.com/maa8dqh.js"></script><script type="text/javascript">try{Typekit.load();}catch(e){}</script></head><body><div class="container">' + '<div class="row"><div class="span2 logo">bram<span> </span><strong>stein</strong></div><nav class="span6 offset1"><ul>' + navigation.join('') + '</ul></nav></div><div class="row"><article class="span7 ' + path.dirname(path.relative(dest, target)).split('/').join(' ') + '">' + parseMarkdown(text) + '</article></div>' + footer + '</div></body></html>');
            fs.writeFileSync(target, '<html><head><meta charset="utf-8"><link rel="stylesheet/less" href="' + myless + '"><script src="' + code + '"></script><script src="' + less + '"></script><script type="text/javascript" src="http://use.typekit.com/maa8dqh.js"></script><script type="text/javascript">try{Typekit.load();}catch(e){}</script></head><body><div class="container">' + '<div class="row-fluid"><div class="span1 logo">bs</div><nav class="span5 offset1"><ul>' + navigation.join('') + '</ul></nav></div>' + parseMarkdown(text) + '<div class="row-fluid">' + footer + '</div></div></body></html>');

        });
    });
}



var markup = {
    transform: transform
};

//markup.copy('**/*.png').from('../website/src').to('../website/www');
//markup.markdown('**/*.md').from('../website/src').to('../website/www');

//markup.from('../website/src/').to('../website/www').all(
//    copy('**/*.png'),
//    markdown('**/*.md')
//);

//glob('{**/*.png,**/*.js}', {cwd: '../website/src'}, function (err, files) {
//    console.log(files);
//});

markup.transform('../website/src', '../website/www', {
    header: '../website/header.html',
    footer: '../website/footer.html'
});