import { IOptions } from './types';
import path from "path"
import { Router } from "express"
import config from "./config"
import { walk, generateRoutes, getHandlers, getMethodKey } from "./utils"

const defaultOptions: IOptions = {
  directory: path.join(path.dirname(require.main.filename), "routes"),
  methodExports: []
}

const router = Router();
export const fileBased = (opts: IOptions = defaultOptions) => {
        if(defaultOptions.directory !== opts.directory){
          opts.directory = path.join(path.dirname(require.main.filename), opts.directory)
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

      return router;
}

export default fileBased; 