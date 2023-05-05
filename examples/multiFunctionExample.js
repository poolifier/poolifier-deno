const { FixedThreadPool } = require('poolifier')
const pool = new FixedThreadPool(15, './multiFunctionWorker.js', {
  errorHandler: e => console.error(e),
  onlineHandler: () => console.log('worker is online')
})

pool
  .execute({ text: 'hello' }, 'fn0')
  .then(res => console.log(res))
  .catch(err => console.error(err))
pool
  .execute({ text: 'multiple functions' }, 'fn1')
  .then(res => console.log(res))
  .catch(err => console.error(err))

setTimeout(pool.destroy(), 3000)
