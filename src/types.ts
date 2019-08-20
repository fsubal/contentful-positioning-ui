import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'

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
