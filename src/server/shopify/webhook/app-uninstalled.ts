// 要创建新的 webhook，请在 /server/shopify/webhook/ 中创建一个新的 `.ts` 文件，并使用项目代码片段
// `createwebhook` 来生成 webhook 模板

import prisma from '../../lib/database'

const appUninstallHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string,
): Promise<void> => {
  try {
    const webhookBody = JSON.parse(webhookRequestBody)

    await prisma.session.deleteMany({ where: { shop } })
    await prisma.stores.upsert({
      where: { shop },
      update: { isActive: false },
      create: { shop, isActive: false },
    })
  } catch (e) {
    console.error(e)
  }
}

export default appUninstallHandler
