export * from './utils'
export * from './auth'
export * from './appointments'
export * from './companies'
export * from './pets'
export * from './services'
export * from './users'

export interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export interface PaginationParams {
  pageIndex?: number
  pageSize?: number
}
