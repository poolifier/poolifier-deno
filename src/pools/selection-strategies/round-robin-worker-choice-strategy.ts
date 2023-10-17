import { DEFAULT_WORKER_CHOICE_STRATEGY_OPTIONS } from '../../utils.ts'
import type { IPool } from '../pool.ts'
import type { IWorker } from '../worker.ts'
import { AbstractWorkerChoiceStrategy } from './abstract-worker-choice-strategy.ts'
import type {
  IWorkerChoiceStrategy,
  WorkerChoiceStrategyOptions,
} from './selection-strategies-types.ts'

/**
 * Selects the next worker in a round robin fashion.
 *
 * @typeParam Worker - Type of worker which manages the strategy.
 * @typeParam Data - Type of data sent to the worker. This can only be structured-cloneable data.
 * @typeParam Response - Type of execution response. This can only be structured-cloneable data.
 */
export class RoundRobinWorkerChoiceStrategy<
  Worker extends IWorker<Data>,
  Data = unknown,
  Response = unknown,
> extends AbstractWorkerChoiceStrategy<Worker, Data, Response>
  implements IWorkerChoiceStrategy {
  /** @inheritDoc */
  public constructor(
    pool: IPool<Worker, Data, Response>,
    opts: WorkerChoiceStrategyOptions = DEFAULT_WORKER_CHOICE_STRATEGY_OPTIONS,
  ) {
    super(pool, opts)
    this.setTaskStatisticsRequirements(this.opts)
  }

  /** @inheritDoc */
  public reset(): boolean {
    this.resetWorkerNodeKeyProperties()
    return true
  }

  /** @inheritDoc */
  public update(): boolean {
    return true
  }

  /** @inheritDoc */
  public choose(): number | undefined {
    const chosenWorkerNodeKey = this.nextWorkerNodeKey
    this.setPreviousWorkerNodeKey(chosenWorkerNodeKey)
    this.roundRobinNextWorkerNodeKey()
    return chosenWorkerNodeKey
  }

  /** @inheritDoc */
  public remove(workerNodeKey: number): boolean {
    if (this.pool.workerNodes.length === 0) {
      this.reset()
    }
    if (
      this.nextWorkerNodeKey === workerNodeKey &&
      this.nextWorkerNodeKey > this.pool.workerNodes.length - 1
    ) {
      this.nextWorkerNodeKey = this.pool.workerNodes.length - 1
    }
    if (
      this.previousWorkerNodeKey === workerNodeKey &&
      this.previousWorkerNodeKey > this.pool.workerNodes.length - 1
    ) {
      this.previousWorkerNodeKey = this.pool.workerNodes.length - 1
    }
    return true
  }

  private roundRobinNextWorkerNodeKey(): number | undefined {
    do {
      this.nextWorkerNodeKey =
        this.nextWorkerNodeKey === this.pool.workerNodes.length - 1
          ? 0
          : (this.nextWorkerNodeKey ?? this.previousWorkerNodeKey) + 1
    } while (!this.isWorkerNodeReady(this.nextWorkerNodeKey))
    return this.nextWorkerNodeKey
  }
}
