import { label } from 'next-api-middleware'
import verifyHmac from './auth/verify-hmac'
import verifyProxy from './auth/verify-proxy'
import verifyRequest from './auth/verify-request'
import verifyCheckout from './auth/verify-checkout'

const withMiddleware = label({
  verifyRequest,
  verifyProxy,
  verifyHmac,
  verifyCheckout,
})

export default withMiddleware
