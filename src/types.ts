/**
 * Shared types for Funey application.
 */
export interface Transaction {
  id: number
  description: string
  ts: number
  value: number
}

export interface Account {
  interest: number
  value: number
  view: string
  allowance: number
}
