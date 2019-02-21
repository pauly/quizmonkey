#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const YAML = require('yamljs')
const dataDir = path.resolve(__dirname, '../data')
const buildDir = path.resolve(__dirname, '../docs')

try {
  if (process.argv.length > 2) {
    console.log(JSON.stringify(YAML.load(process.argv[2]), null, 2))
    process.exit(0)
  }
  fs.readdir(dataDir, function (err, data) {
    if (err) throw err
    data.forEach((file, index) => {
      if (!/\.yml$/.exec(file)) return

      const ymlFile = path.join(dataDir, file)
      const jsonFile = ymlFile.replace(/\.yml$/, '.json')
      const json = JSON.stringify(YAML.load(ymlFile), null, 2)
      fs.writeFileSync(jsonFile, json)
      const buildFile = path.join(buildDir, `${index}.json`)
      fs.writeFileSync(buildFile, json)
    })
    process.exit(0)
  })
} catch (e) {
  throw e
}
