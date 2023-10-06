import { isMainThread } from 'node:worker_threads'
import { ThreadWorker } from '../../src/index.ts'
import { executeTaskFunction } from '../benchmarks-utils.js'
import { TaskFunctions } from '../benchmarks-types.js'

const taskFunction = (data) => {
  data = data || {}
  data.function = data.function || TaskFunctions.jsonIntegerSerialization
  data.debug = data.debug || false
  const res = executeTaskFunction(data)
  data.debug === true &&
    console.debug(`This is the main thread ${isMainThread}`)
  return res
}

export default new ThreadWorker(taskFunction)
