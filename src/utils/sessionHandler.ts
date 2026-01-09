import { Session } from '@shopify/shopify-api'
import cryption from './cryption'
import prisma from './prisma'

/**
 * 将会话数据存储到数据库中。
 *
 * @param session - Shopify 会话对象。
 * @returns 如果操作成功则返回 true。
 */
const storeSession = async (session: Session): Promise<boolean> => {
  await prisma.session.upsert({
    where: { id: session.id },
    update: {
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    },
    create: {
      id: session.id,
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    },
  })

  return true
}

/**
 * 从数据库加载会话数据。
 *
 * @param id - 会话 ID。
 * @returns 返回 Shopify 会话对象，如果未找到则返回 undefined。
 */
const loadSession = async (id: string): Promise<Session | undefined> => {
  const sessionResult = await prisma.session.findUnique({ where: { id } })

  if (sessionResult === null) {
    return undefined
  }
  if (sessionResult.content && sessionResult.content.length > 0) {
    const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content))
    return new Session(sessionObj)
  }
  return undefined
}

/**
 * 从数据库删除会话数据。
 *
 * @param id - 会话 ID。
 * @returns 如果操作成功则返回 true。
 */
const deleteSession = async (id: string): Promise<boolean> => {
  await prisma.session.deleteMany({ where: { id } })

  return true
}

/**
 * 会话处理对象，包含 storeSession、loadSession 和 deleteSession 函数。
 */
const sessionHandler = { storeSession, loadSession, deleteSession }

export default sessionHandler
