import {
  availableParallelism,
  DynamicThreadPool,
  PoolEvents,
} from 'https://deno.land/x/poolifier/src/mod.ts'

const pool = new DynamicThreadPool(
  Math.floor(availableParallelism() / 2),
  availableParallelism(),
  new URL(
    './yourWorker.js',
    import.meta.url,
  ),
)
let poolFull = 0
let poolReady = 0
let poolBusy = 0
pool.emitter?.on(PoolEvents.full, () => poolFull++)
pool.emitter?.on(PoolEvents.ready, () => poolReady++)
pool.emitter?.on(PoolEvents.busy, () => poolBusy++)

let resolved = 0
const start = performance.now()
const iterations = 1000
for (let i = 1; i <= iterations; i++) {
  pool
    .execute()
    .then(() => {
      resolved++
      if (resolved === iterations) {
        console.info(
          `Time taken is ${(performance.now() - start).toFixed(2)}ms`,
        )
        console.info(`The pool was full for ${poolFull} times`)
        console.info(`The pool was ready for ${poolReady} times`)
        console.info(`The pool was busy for ${poolBusy} times`)
        return pool.destroy()
      }
    })
    .catch((err) => console.error(err))
}
