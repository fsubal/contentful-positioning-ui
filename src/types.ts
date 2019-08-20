import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'

/**
 * 座標。x と y はパーセントを表す（ 0 ~ 1 ）
 */
export interface Coordinate {
  x: number
  y: number
}

export type FieldExtensionSDK<T> = FieldExtensionSDK & {
  field: {
    getValue(): T
    setValue(next: T): void
  }
}
