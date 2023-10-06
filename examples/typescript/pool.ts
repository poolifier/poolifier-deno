import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  availableParallelism,
  DynamicThreadPool,
  FixedThreadPool,
} from 'poolifier'
import type { MyData, MyResponse } from './worker.ts'

const workerFile = join(
  dirname(fileURLToPath(import.meta.url)),
  `worker${extname(fileURLToPath(import.meta.url))}`,
)

export const fixedPool = new FixedThreadPool<MyData, Promise<MyResponse>>(
  availableParallelism(),
  workerFile,
  {
    errorHandler: (e: Error) => {
      console.error(e)
    },
    onlineHandler: () => {
      console.info('Worker is online')
    },
  },
)

export const dynamicPool = new DynamicThreadPool<MyData, Promise<MyResponse>>(
  Math.floor(availableParallelism() / 2),
  availableParallelism(),
  workerFile,
  {
    errorHandler: (e: Error) => {
      console.error(e)
    },
    onlineHandler: () => {
      console.info('Worker is online')
    },
  },
)
