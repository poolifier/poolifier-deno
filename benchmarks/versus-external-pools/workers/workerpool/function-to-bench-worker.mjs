import workerpool from 'workerpool'
import functionToBench from '../../functions/function-to-bench.mjs'

function wrapperFunctionToBench (testName, taskType, taskSize) {
  return functionToBench({
    test: testName,
    taskType,
    taskSize
  })
}

workerpool.worker({
  functionToBench: wrapperFunctionToBench
})
