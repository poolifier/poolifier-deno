'use strict'
const { isMaster } = require('cluster')
const { ClusterWorker } = require('../../../lib/index')
const { WorkerFunctions, executeWorkerFunction } = require('../benchmark-utils')

const debug = false

function yourFunction (data) {
  data = data || {}
  data.function = data.function || WorkerFunctions.jsonIntegerSerialization
  executeWorkerFunction(data)
  debug === true && console.debug('This is the main thread ' + isMaster)
  return { ok: 1 }
}

module.exports = new ClusterWorker(yourFunction)
