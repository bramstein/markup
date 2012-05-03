var build = require('./build'),
    config = require('./config'),
    watch = require('watch');

function b() {
  build(config);
}

watch.createMonitor(config.src, function(m) {
  m.on('created', b);
  m.on('changed', b);
  m.on('removed', b);
});

watch.createMonitor(config.templates, function(m) {
  m.on('created', b);
  m.on('changed', b);
  m.on('removed', b);
});

watch.createMonitor(config.partials, function(m) {
  m.on('created', b);
  m.on('changed', b);
  m.on('removed', b);
});