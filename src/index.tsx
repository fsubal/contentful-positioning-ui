import React, { useState, useRef, useEffect, useCallback } from 'react'
import { render } from 'react-dom'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'

interface Props {
  sdk: FieldExtensionSDK
}

export function App({ sdk }: Props) {
  const [value, setValue] = useState(sdk.field.getValue() || '')
  const detach = useRef<Function>(sdk.field.onValueChanged(setValue))

  useEffect(() => {
    sdk.window.startAutoResizer()

    return () => {
      if (detach.current) {
        detach.current()
      }
    }
  })

  const onChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setValue(value)

    if (value) {
      await sdk.field.setValue(value)
    } else {
      await sdk.field.removeValue()
    }
  }, [])

  return <div>hello world</div>
}

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'))
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
if (module.hot) {
  module.hot.accept()
}
