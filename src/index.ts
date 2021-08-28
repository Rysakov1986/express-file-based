import { Router } from 'express';
import path from 'path';

import config from './config';
import { IOptions } from './types';
import { generateRoutes, getHandlers, getMethodKey, VerboseLogger, walk } from './utils';

const defaultOptions: IOptions = {
  directory: path.join(path.dirname(require.main.filename), "routes"),
  methodExports: [],
  verbose: process.env.NODE_ENV !== 'production',
  options: {}
}

const REQUIRE_MAIN_FILE = path.dirname(require.main.filename);

export function fileBased(opts: IOptions = defaultOptions) : Router{
  const router = Router(opts.options);
  
  if (!opts.base) {
    opts.base = ''
  }
 
  if (opts.directory && defaultOptions.directory !== opts.directory) {
    opts.directory = path.join(REQUIRE_MAIN_FILE, opts.directory)

    if (!opts.base) {
      opts.base = opts.directory.replace(REQUIRE_MAIN_FILE, '')
    }
  }
  
  const options = { ...defaultOptions, ...opts }
  const files = walk(options.directory)
  const routes = generateRoutes(files)

  if (options.verbose) {
    console.log(
        "\x1b[36m",
        "\n[Function: fileBased]:",options.directory.replace(REQUIRE_MAIN_FILE, ''),
        '\x1b[0m'
    );
  }

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
        
      router[methodKey](url, ...handlers);
      if (options.verbose) {
        VerboseLogger(`[${methodKey}]`, options.base+url, exported.priority)
      }
    }

    if (typeof exported.default !== "undefined") {
      router.all(url, ...getHandlers(exported.default))
      if (options.verbose) {
        VerboseLogger("[_all]", options.base+url, exported.priority)
      }
    }     
  }

  return router;
}

export default fileBased;