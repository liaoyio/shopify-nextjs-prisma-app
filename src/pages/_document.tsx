import { Head, Html, Main, NextScript } from 'next/document'

const appBridgeScript = `https://cdn.shopify.com/shopifycloud/app-bridge.js?apiKey=${process.env.CONFIG_SHOPIFY_API_KEY}`

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src={appBridgeScript} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
