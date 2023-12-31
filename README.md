<div align="center">
  <img src="./images/logo.png" width="340px" height="266px"/>
</div>

<div align="center">

# Deno Web Worker Pool

</div>

<div align="center">

[![GitHub commit activity (master)](https://img.shields.io/github/commit-activity/m/poolifier/poolifier-deno/master?color=brightgreen&logo=github)](https://github.com/poolifier/poolifier-deno/graphs/commit-activity)
[![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fpoolifier%2Fmod.ts)](https://deno.land/x/poolifier/src/mod.ts)
[![CI Workflow](https://github.com/poolifier/poolifier-deno/actions/workflows/ci.yml/badge.svg)](https://github.com/poolifier/poolifier-deno/actions/workflows/ci.yml)
[![Code Coverage](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=coverage)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=alert_status)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
[![Deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/poolifier/src/mod.ts)
[![Javascript Standard Style Guide](<https://badgen.net/static/code style/standard/green>)](https://standardjs.com)
[![Discord](https://badgen.net/discord/online-members/vXxZhyb3b6?icon=discord&label=discord&color=green)](https://discord.gg/vXxZhyb3b6)
[![Open Collective](https://opencollective.com/poolifier/tiers/badge.svg)](https://opencollective.com/poolifier)
[![PRs Welcome](https://badgen.net/static/PRs/welcome/green)](https://makeapullrequest.com)
[![No Dependencies](<https://badgen.net/static/dependencies/no dependencies/green>)](https://badgen.net/static/dependencies/nodependencies/green)

</div>

## Why Poolifier?

Poolifier is used to perform CPU and/or I/O intensive tasks on Deno servers, it
implements worker pools using
[web worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
Deno module.\
With poolifier you can improve your **performance** and resolve problems related
to the event loop.\
Moreover you can execute your tasks using an API designed to improve the
**developer experience**.\
Please consult our [general guidelines](#general-guidelines).

- Easy to use ✔
- Fixed and dynamic pool size ✔
- Easy switch from a pool type to another ✔
- Performance [benchmarks](./benchmarks/README.md) ✔
- No runtime dependencies ✔
- Support for ESM and TypeScript ✔
- Support for
  [web worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
  Deno module ✔
- Support for multiple task functions ✔
- Support for task functions
  [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
  operations at runtime ✔
- Support for sync and async task functions ✔
- Tasks distribution strategies ✔
- Lockless tasks queueing ✔
- Queued tasks rescheduling:
  - Task stealing on idle ✔
  - Tasks stealing under back pressure ✔
  - Tasks redistribution on worker error ✔
- General guidelines on pool choice ✔
- Error handling out of the box ✔
- Widely tested ✔
- Active community ✔
- Code quality
  [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=bugs)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
  [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=code_smells)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
  [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
  [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
  [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
  [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=sqale_index)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
- Code security
  [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=security_rating)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)
  [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=poolifier_poolifier-deno&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=poolifier_poolifier-deno)

## Table of contents

- [Overview](#overview)
- [Usage](#usage)
- [Deno versions](#deno-versions)
- [API](#api)
- [General guidelines](#general-guidelines)
- [Worker choice strategies](#worker-choice-strategies)
- [Contribute](#contribute)
- [Team](#team)
- [License](#license)

## Overview

Poolifier contains
[web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)
pool implementation, you don't have to deal with
[web worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
complexity.\
The first implementation is a fixed worker pool, with a defined number of
workers that are started at creation time and will be reused.\
The second implementation is a dynamic worker pool, with a number of worker
started at creation time (these workers will be always active and reused) and
other workers created when the load will increase (with an upper limit, these
workers will be reused when active), the newly created workers will be stopped
after a configurable period of inactivity.\
You have to implement your worker by extending the _ThreadWorker_ class.

## Usage

You can implement a
[web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) in
a simple way by extending the class _ThreadWorker_:

```js
import { ThreadWorker } from 'https://deno.land/x/poolifier@$MODULE_VERSION/src/mod.ts'

function yourFunction(data) {
  // this will be executed in the worker thread,
  // the data will be received by using the execute method
  return { ok: 1 }
}

export default new ThreadWorker(yourFunction, {
  maxInactiveTime: 60000,
})
```

Instantiate your pool based on your needs :

```js
import {
  availableParallelism,
  DynamicThreadPool,
  FixedThreadPool,
  PoolEvents,
} from 'https://deno.land/x/poolifier@$MODULE_VERSION/src/mod.ts'

// a fixed worker_threads pool
const pool = new FixedThreadPool(availableParallelism(), './yourWorker.js')

pool.emitter?.on(PoolEvents.ready, () => console.info('Pool is ready'))
pool.emitter?.on(PoolEvents.busy, () => console.info('Pool is busy'))

// or a dynamic worker_threads pool
const pool = new DynamicThreadPool(
  Math.floor(availableParallelism() / 2),
  availableParallelism(),
  new URL(
    './yourWorker.js',
    import.meta.url,
  ),
)

pool.emitter?.on(PoolEvents.full, () => console.info('Pool is full'))
pool.emitter?.on(PoolEvents.ready, () => console.info('Pool is ready'))
pool.emitter?.on(PoolEvents.busy, () => console.info('Pool is busy'))

// the execute method signature is the same for both implementations,
// so you can easily switch from one to another
pool
  .execute()
  .then((res) => {
    console.info(res)
  })
  .catch((err) => {
    console.error(err)
  })
```

**See [examples](./examples/) for more details**:

- [Javascript](./examples/javascript/)
- [Typescript](./examples/typescript/)

Remember that workers can only send and receive structured-cloneable data.

## Deno versions

Deno versions >= 1.37.x are supported.

## [API](./docs/api.md)

## [General guidelines](./docs/general-guidelines.md)

## [Worker choice strategies](./docs/worker-choice-strategies.md)

## Contribute

Choose your task [here](https://github.com/orgs/poolifier/projects/1), propose
an idea, a fix, an improvement.

See [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

## Team

**Creator/Owner:**

- [**Alessandro Pio Ardizio**](https://github.com/pioardi)

**Maintainers:**

- [**Jérôme Benoit**](https://github.com/jerome-benoit)

**Contributors:**

- [**Shinigami92**](https://github.com/Shinigami92)

## License

[MIT](./LICENSE)
