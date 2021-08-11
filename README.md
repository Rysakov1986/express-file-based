# express-file-based Middleware

File routing system-based framework like api serverless for Node Express with `0` dependencies.

## Installation

```bash
npm install express-file-based
```

## How to use

- app.(js|ts) (main)

```js
import express from "express"
import fileBased from "express-file-based"

const app = express()
app.use('/', fileBased()) // uses /routes directory by default
app.listen(2000)
```

- routes/index.js

```js
export default async (req, res) => {
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
        └── :id.js // dynamic req.params.id
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

## Examples

### HTTP Method Matching

If you export functions named e.g. `get`, `post`, `put`, `delete`/`del` [etc.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) those will get matched their corresponding http method automatically.

```js
export const get = async (req, res) => { ... }

export const post = async (req, res) => { ... }

// it's not allowed to name variables 'delete': try 'del' instead
export const del = async (req, res) => { ... }

// you can still use a wildcard default export in addition
export default async (req, res) => { ... }
```

**Note:** Named method exports gain priority over wildcard exports (= default exports).

### Middlewares

You can add isolated, route specific middlewares by exporting an array of Express request handlers from your route file.

```js
import { withAuth } from "../middlewares"

export const get = [
  withAuth,
  async (req, res) => { ... }
]
```