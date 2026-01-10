import type { Session } from '@shopify/shopify-api'
import type { NextApiRequest as NextApiRequestType } from 'next'

declare module 'next' {
  export type NextApiRequest = NextApiRequestType & {
    user_session?: Session
    user_shop?: string
  }
}
