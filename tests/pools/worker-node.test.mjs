import { expect } from 'npm:expect'
import { WorkerTypes } from '../../src/mod.ts'
import { DEFAULT_TASK_NAME } from '../../src/utils.ts'
import { CircularArray } from '../../src/circular-array.ts'
import { Deque } from '../../src/deque.ts'
import { WorkerNode } from '../../src/pools/worker-node.ts'

Deno.test({
  name: 'Worker node test suite',
  fn: async (t) => {
    const threadWorker = new Worker(
      new URL('./../worker-files/thread/testWorker.mjs', import.meta.url),
      {
        type: 'module',
      },
    )
    const threadWorkerNode = new WorkerNode(threadWorker, 12)

    await t.step('Worker node instantiation', () => {
      expect(() => new WorkerNode()).toThrow(
        new TypeError('Cannot construct a worker node without a worker'),
      )
      expect(() => new WorkerNode(threadWorker)).toThrow(
        new TypeError(
          'Cannot construct a worker node without a tasks queue back pressure size',
        ),
      )
      expect(
        () => new WorkerNode(threadWorker, 'invalidTasksQueueBackPressureSize'),
      ).toThrow(
        new TypeError(
          'Cannot construct a worker node with a tasks queue back pressure size that is not an integer',
        ),
      )
      expect(() => new WorkerNode(threadWorker, 0.2)).toThrow(
        new TypeError(
          'Cannot construct a worker node with a tasks queue back pressure size that is not an integer',
        ),
      )
      expect(() => new WorkerNode(threadWorker, 0)).toThrow(
        new RangeError(
          'Cannot construct a worker node with a tasks queue back pressure size that is not a positive integer',
        ),
      )
      expect(() => new WorkerNode(threadWorker, -1)).toThrow(
        new RangeError(
          'Cannot construct a worker node with a tasks queue back pressure size that is not a positive integer',
        ),
      )
      expect(threadWorkerNode).toBeInstanceOf(WorkerNode)
      expect(threadWorkerNode.worker).toBe(threadWorker)
      expect(threadWorkerNode.info).toStrictEqual({
        id: expect.any(String),
        type: WorkerTypes.web,
        dynamic: false,
        ready: false,
      })
      expect(threadWorkerNode.usage).toStrictEqual({
        tasks: {
          executed: 0,
          executing: 0,
          queued: 0,
          maxQueued: 0,
          sequentiallyStolen: 0,
          stolen: 0,
          failed: 0,
        },
        runTime: {
          history: new CircularArray(),
        },
        waitTime: {
          history: new CircularArray(),
        },
        elu: {
          idle: {
            history: new CircularArray(),
          },
          active: {
            history: new CircularArray(),
          },
        },
      })
      expect(threadWorkerNode.messageChannel).toBeInstanceOf(MessageChannel)
      expect(threadWorkerNode.tasksQueueBackPressureSize).toBe(12)
      expect(threadWorkerNode.tasksQueue).toBeInstanceOf(Deque)
      expect(threadWorkerNode.tasksQueue.size).toBe(0)
      expect(threadWorkerNode.tasksQueueSize()).toBe(
        threadWorkerNode.tasksQueue.size,
      )
      expect(threadWorkerNode.onBackPressureStarted).toBe(false)
      expect(threadWorkerNode.taskFunctionsUsage).toBeInstanceOf(Map)
    })

    await t.step('Worker node getTaskFunctionWorkerUsage()', () => {
      expect(() =>
        threadWorkerNode.getTaskFunctionWorkerUsage('invalidTaskFunction')
      ).toThrow(
        new TypeError(
          "Cannot get task function worker usage for task function name 'invalidTaskFunction' when task function names list is not yet defined",
        ),
      )
      threadWorkerNode.info.taskFunctionNames = [DEFAULT_TASK_NAME, 'fn1']
      expect(() =>
        threadWorkerNode.getTaskFunctionWorkerUsage('invalidTaskFunction')
      ).toThrow(
        new TypeError(
          "Cannot get task function worker usage for task function name 'invalidTaskFunction' when task function names list has less than 3 elements",
        ),
      )
      threadWorkerNode.info.taskFunctionNames = [
        DEFAULT_TASK_NAME,
        'fn1',
        'fn2',
      ]
      expect(
        threadWorkerNode.getTaskFunctionWorkerUsage(DEFAULT_TASK_NAME),
      ).toStrictEqual({
        tasks: {
          executed: 0,
          executing: 0,
          queued: 0,
          sequentiallyStolen: 0,
          stolen: 0,
          failed: 0,
        },
        runTime: {
          history: new CircularArray(),
        },
        waitTime: {
          history: new CircularArray(),
        },
        elu: {
          idle: {
            history: new CircularArray(),
          },
          active: {
            history: new CircularArray(),
          },
        },
      })
      expect(threadWorkerNode.getTaskFunctionWorkerUsage('fn1')).toStrictEqual({
        tasks: {
          executed: 0,
          executing: 0,
          queued: 0,
          sequentiallyStolen: 0,
          stolen: 0,
          failed: 0,
        },
        runTime: {
          history: new CircularArray(),
        },
        waitTime: {
          history: new CircularArray(),
        },
        elu: {
          idle: {
            history: new CircularArray(),
          },
          active: {
            history: new CircularArray(),
          },
        },
      })
      expect(threadWorkerNode.getTaskFunctionWorkerUsage('fn2')).toStrictEqual({
        tasks: {
          executed: 0,
          executing: 0,
          queued: 0,
          sequentiallyStolen: 0,
          stolen: 0,
          failed: 0,
        },
        runTime: {
          history: new CircularArray(),
        },
        waitTime: {
          history: new CircularArray(),
        },
        elu: {
          idle: {
            history: new CircularArray(),
          },
          active: {
            history: new CircularArray(),
          },
        },
      })
      expect(threadWorkerNode.taskFunctionsUsage.size).toBe(2)
    })

    await t.step('Worker node deleteTaskFunctionWorkerUsage()', () => {
      expect(threadWorkerNode.info.taskFunctionNames).toStrictEqual([
        DEFAULT_TASK_NAME,
        'fn1',
        'fn2',
      ])
      expect(threadWorkerNode.taskFunctionsUsage.size).toBe(2)
      expect(
        threadWorkerNode.deleteTaskFunctionWorkerUsage('invalidTaskFunction'),
      ).toBe(false)
      expect(threadWorkerNode.taskFunctionsUsage.size).toBe(2)
      expect(threadWorkerNode.deleteTaskFunctionWorkerUsage('fn1')).toBe(true)
      expect(threadWorkerNode.taskFunctionsUsage.size).toBe(1)
    })

    threadWorkerNode.terminate()
  },
})
