// IMPORT LIBRARIES
import { DynamicThreadPool } from 'poolifier'
// FINISH IMPORT LIBRARIES
const size = parseInt(process.env.POOL_SIZE)
const iterations = parseInt(process.env.NUM_ITERATIONS)
const data = {
  test: 'MYBENCH',
  taskType: process.env.TASK_TYPE,
  taskSize: parseInt(process.env.TASK_SIZE)
}

const dynamicPool = new DynamicThreadPool(
  size,
  size * 3,
  './workers/poolifier/function-to-bench-worker.mjs'
)

async function run () {
  const promises = []
  for (let i = 0; i < iterations; i++) {
    promises.push(dynamicPool.execute(data))
  }
  await Promise.all(promises)
  // eslint-disable-next-line n/no-process-exit
  process.exit()
}

await run()