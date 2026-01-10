import { Session } from '@shopify/shopify-api'
import { cryption } from '~/src/server/utils/auth'
import prisma from '../lib/database'

/** 将会话数据存储到数据库 */
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

/** 从数据库加载会话数据 */
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

/** 从数据库删除会话数据 */
const deleteSession = async (id: string): Promise<boolean> => {
  await prisma.session.deleteMany({ where: { id } })
  return true
}

/** 会话处理对象，包含 storeSession、loadSession 和 deleteSession 函数 */
const sessionHandler = { storeSession, loadSession, deleteSession }

export default sessionHandler
