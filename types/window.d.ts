/**
 * 全局 Window 接口扩展
 * 使用官方的 @shopify/app-bridge-types 包中的类型定义
 */
import '@shopify/app-bridge-types'

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    shopify?: typeof shopify
  }
}

export {}
