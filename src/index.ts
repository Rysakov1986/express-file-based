import { Router } from 'express';
import path from 'path';

import config from './config';
import { IOptions } from './types';
import { generateRoutes, getHandlers, getMethodKey, walk } from './utils';

const defaultOptions: IOptions = {
  directory: path.join(path.dirname(require.main.filename), "routes"),
  methodExports: [],
  verbose: process.env.NODE_ENV !== 'production'
}

const REQUIRE_MAIN_FILE = path.dirname(require.main.filename);

export const fileBased = (opts: IOptions = defaultOptions) => {
  const router = Router();
  
  if (opts.directory && defaultOptions.directory !== opts.directory) {
    opts.directory = path.join(REQUIRE_MAIN_FILE, opts.directory)
  }

  const options = { ...defaultOptions, ...opts }
  const files = walk(options.directory)
  const routes = generateRoutes(files)

  for (const { url, exported } of routes) {
    const exportedMethods = Object.entries(exported)

    for (const [method, handler] of exportedMethods) {
      const methodKey = getMethodKey(method)
      const handlers = getHandlers(handler)

      if (
        !opts.methodExports?.includes(methodKey) &&
        !config.METHOD_EXPORTS?.includes(methodKey)
      )
        continue

      router[methodKey](url, ...handlers)
    }
    // wildcard default export route matching
    if (typeof exported.default !== "undefined") {
      router.all(url, ...getHandlers(exported.default))
    }
  }

  if (options.verbose) {
    console.log("\x1b[36m","\n[Function: fileBased]:",options.directory.replace(REQUIRE_MAIN_FILE, ''),'\x1b[0m');
    for (const e of router.stack) {
      console.log(Object.keys(e.route.methods).map(x => `[${x}]`).join(','), "\r\t" , e.route.path);
    }

  }

  return router;
}

export default fileBased;