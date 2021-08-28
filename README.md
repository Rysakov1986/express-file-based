# express-file-based Middleware

File routing system-based framework like api serverless for Node Express with `0` dependencies.

## Installation

```bash
npm install express-file-based
```

## How to use

- app.(js|ts) (main)

```js
const express = require("express")
const { fileBased } = require("express-file-based")

const app = express()
app.use('/', fileBased()) // uses /routes directory by default
app.listen(2000)
```

- routes/index.js

```js
module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(404)

  return res.status(200)
}
```

#### Directory Structure

Files inside your project's `/routes` directory will get matched an url path automatically.

```php
├── app.js
├── routes
    ├── index.js
    ├── posts
        ├── index.js
        └── :id.js or [id].js // dynamic req.params.id
    └── users.js
└── package.json
```

- `/routes`           → /
- `/routes/posts`     → /posts
- `/routes/posts/:id` → /posts/:id
- `/routes/users`     → /users

## API

```js
app.use('/api', fileBased({
    directory: 'routes',
    methodExports: ["ws", ...]
  }))
  .use('/anotherrouter', fileBased({
    directory: 'anoherfile',
  }));
```

### Options

- `directory`: The path to the routes directory (default /routes)
- `methodExports`: Additional method exports (e.g. `ws` for express-ws)
- `verbose`: show routes on console (default process.env.NODE_ENV !== 'production' )
- `options`: RouterOptions { caseSensitive/mergeParams/strict }

## Examples

### HTTP Method Matching

If you export functions named e.g. `get`, `post`, `put`, `delete`/`del` [etc.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) those will get matched their corresponding http method automatically.

```js

module.exports.priority = 1; // kind of like a z-index for your routes.

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */module.exports.get = async (req, res) => { ... }

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */module.exports.post = async (req, res) => { ... }


/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */module.exports.put = async (req, res) => { ... }

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * it's not allowed to name variables 'delete': try 'del' instead
 */module.exports.del = async (req, res) => { ... }

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * use default for _all
 */module.exports.default = async (req, res) => { ... }
```

**Note:** Named method exports gain priority over wildcard exports (= default exports).

### Middlewares

You can add isolated, route specific middlewares by exporting an array of Express request handlers from your route file.

```js
const { withAuth } = require("../middlewares")

module.exports.get = [
  withAuth,
  async (req, res) => { ... }
]
```