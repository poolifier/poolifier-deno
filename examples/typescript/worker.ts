import { ThreadWorker } from 'https://deno.land/x/poolifier@v0.0.1/src/index.ts'

export interface MyData {
  ok: 0 | 1
}

export interface MyResponse {
  message: string
  data: MyData
}

class MyThreadWorker extends ThreadWorker<MyData, Promise<MyResponse>> {
  constructor() {
    super(async (data: MyData) => await this.process(data), {
      maxInactiveTime: 60000,
    })
  }

  private async process(data: MyData): Promise<MyResponse> {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Hello from Worker :)', data })
      }, 10000)
    })
  }
}

export default new MyThreadWorker()
