var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
module.exports = [
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './german.yml'), 'utf8')),
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './oscars-best-actor.yml'), 'utf8')),
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './oscars-best-actress.yml'), 'utf8')),
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './oscars-best-picture.yml'), 'utf8'))
];
