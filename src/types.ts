import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'

export type FieldExtensionSDK<T> = FieldExtensionSDK & {
  field: {
    getValue(): T
    setValue(next: T): void
  }
}
