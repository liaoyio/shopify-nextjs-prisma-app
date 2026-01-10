import { label } from 'next-api-middleware'
import verifyHmac from './verify-hmac'
import verifyProxy from './verify-proxy'
import verifyRequest from './verify-request'
import verifyCheckout from './verify-checkout'

const withMiddleware = label({
  verifyRequest,
  verifyProxy,
  verifyHmac,
  verifyCheckout,
})

export default withMiddleware
