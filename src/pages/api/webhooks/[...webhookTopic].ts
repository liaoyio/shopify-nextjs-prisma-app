/**
 * 请勿直接编辑此文件
 * 请前往 server/shopify/config.ts 创建您的 webhook
 *  并在 server/shopify/webhook 中编写您的 webhook 函数。
 * 如果您不知道格式，在使用 VSCode 时使用 `createwebhook` 代码片段
 *  以获取 webhook 的模板函数。
 * 要更新此文件，请运行 `npm run update:config` 或 `bun run update:config`
 */

import shopify from '@/server/shopify/config'

async function buffer(readable: any): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(400).send('必须是 POST 请求。')
  }

  const topic = (req.headers['x-shopify-topic'] as string) || ''
  const shop = (req.headers['x-shopify-shop-domain'] as string) || ''
  const apiVersion = (req.headers['x-shopify-api-version'] as string) || ''
  const webhookId = (req.headers['x-shopify-webhook-id'] as string) || ''

  const buff = await buffer(req)
  const rawBody = buff.toString('utf8')

  try {
    const validateWebhook = await shopify.webhooks.validate({
      rawBody,
      rawRequest: req,
      rawResponse: res,
    })

    if (validateWebhook.valid) {
      // Webhook 有效
    } else {
      return res.status(400).send({ error: true })
    }

    // SWITCHCASE
    switch (validateWebhook.topic) {
      case 'APP_UNINSTALLED':
        await appUninstallHandler(
          validateWebhook.topic,
          shop,
          rawBody,
          webhookId,
          apiVersion,
        )
        break
      default:
        throw new Error(`找不到 ${topic} 的处理程序`)
    }
    // SWITCHCASE 结束

    console.log(`--> 已处理来自 ${shop} 的 ${topic}`)
    return res.status(200).send({ message: 'ok' })
  } catch (e) {
    const error = e as Error
    console.error(
      `---> 处理来自 ${shop} 的 ${topic} webhook 时发生错误 | ${error.message}`,
    )

    if (!res.headersSent) {
      console.error('未发送头信息')
    }
    return res.status(500).send({ message: '错误' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
