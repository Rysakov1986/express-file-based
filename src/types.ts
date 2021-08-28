import { RouterOptions } from 'express';

export interface IFileResult {
  name: string
  relative: string
  path: string
}

export interface IRoute {
  url: string
  exported: {
    priority?: number 
    default?: any
    get?: any
    post?: any
    put?: any
    delete?: any
    [x: string]: any
  }
}

export interface IOptions {
  directory?: string
  methodExports?: string[]
  verbose?: boolean
  base?: string
  options?: RouterOptions
}