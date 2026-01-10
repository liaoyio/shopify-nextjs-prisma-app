import Cryptr from 'cryptr'

/**
 * Cryptr 实例，用于加密和解密 Shopify Session 数据
 * @returns Cryptr 实例
 * @example
 * const encrypted = cryption.encrypt('my-secret-data') // 加密
 * const decrypted = cryption.decrypt(encrypted) // 解密
 */
export const cryption = new Cryptr(process.env.ENCRYPTION_STRING || '')
