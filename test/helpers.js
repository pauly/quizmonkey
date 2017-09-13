'use strict'

global.sinon = require('sinon')
global.sandbox = sinon.sandbox.create()

const chai = require('chai')

chai.config.includeStack = true

chai.use(require('dirty-chai'))
chai.use(require('sinon-chai'))

global.expect = chai.expect
