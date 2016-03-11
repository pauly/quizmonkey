#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');
var YAML = require('yamljs');
var dataDir = path.resolve(__dirname, '../data');

try {
  if (process.argv.length > 2) {
    console.log(JSON.stringify(YAML.load(process.argv[2]), null, 2));
    process.exit(0);
  }
  fs.readdir(dataDir, function(err, data) {
    if (err) throw err;
    data.forEach(function(file) {
      if (!/\.yml$/.exec(file)) return;
    
      var ymlFile = path.join(dataDir, file);
      var jsonFile = ymlFile.replace(/\.yml$/, '.json');
      fs.writeFileSync(jsonFile, JSON.stringify(YAML.load(ymlFile)));
    });
    process.exit(0);
  });
} catch (e) {
  throw e;
}
