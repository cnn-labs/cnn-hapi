# CNN Hapi

Basic [Hapi](http://hapijs.com/) server with some baked in features that can be
pulled in as a dependency of another application to extend as needed.

Features include:

- Swagger on /documentation
- Healthcheck on /healthcheck
- Basic logging
- Basic metrics


## Requirements

[Node 4.2.6+](https://npmjs.org)


## Installation

```shell
$ npm install
```


## Usage

Look at the [/example/app.js](./example/app.js) to see an example of how this
can be pulled in as a dependency.  You can see it running by doing the
following.

```shell
$ PORT=5000 node example/app.js
HttpResponse { buckets: {}, reporter: [Function: bound ] }
{ app: 'hapi-demo-app', flushEvery: 6000 }
In Metrics Plugin
Listening on  5000
App Starting
Logging to Graphite is disabled by default on non-production environments. To enable is set NODE_ENV to "production". Or set DEBUGMETRICS=1 to debug metric counters
```

You can also navigate to localhost:5000 and see a served page.  Also check out
localhost:5000/documentation and localhost:5000/healthcheck.



[![build](https://img.shields.io/travis/cnnlabs/cnn-hapi/master.svg?style=flat-square)](https://travis-ci.org/cnnlabs/cnn-hapi)
![node](https://img.shields.io/node/v/cnn-hapi.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/cnn-hapi.svg?style=flat-square)](https://www.npmjs.com/package/cnn-hapi)
[![npm-downloads](https://img.shields.io/npm/dm/cnn-hapi.svg?style=flat-square)](https://www.npmjs.com/package/cnn-hapi)
[![dependency-status](https://gemnasium.com/cnnlabs/cnn-hapi.svg)](https://gemnasium.com/cnnlabs/cnn-hapi)
