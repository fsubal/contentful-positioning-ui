import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'

import React, { useState } from 'react'
import { render } from 'react-dom'
import { init } from 'contentful-ui-extensions-sdk'
import { useSDKSetup, useSVGDraggable } from './hooks'
import { FieldExtensionSDK, Coordinate } from './types'

interface Props {
  sdk: FieldExtensionSDK<Coordinate>
  width?: number
  height?: number
  initial?: Coordinate
}

export function App({ sdk, initial = { x: 0, y: 0 }, width = 300, height = 150 }: Props) {
  const [value, setValue] = useState<Coordinate>(initial)
  useSDKSetup(sdk, setValue)

  const ref = useSVGDraggable(
    async (next: Coordinate) => {
      setValue(next)
      await sdk.field.setValue(next)
    },
    [sdk, setValue]
  )

  const maxWidth = 800
  const maxHeight = (maxWidth / width) * height

  return (
    <>
      <svg width={maxWidth} height={maxHeight} viewBox={`0 0 ${width} ${height}`} ref={ref}>
        <rect width={width} height={height} x="0" y="0" fill="#f7f9fa" />

        {/** 縦 */}
        <line strokeWidth="1" stroke="#3c80cf" x1={value.x} x2={value.x} y1="0" y2="100%" />

        {/** 横 */}
        <line strokeWidth="1" stroke="#3c80cf" x1="0" x2="100%" y1={value.y} y2={value.y} />
      </svg>
    </>
  )
}

init(_sdk => {
  const sdk = _sdk as FieldExtensionSDK<Coordinate>
  const initial = sdk.field.getValue()
  const { width, height } = sdk.parameters.instance as any

  render(
    <App sdk={sdk} width={width} height={height} initial={initial} />,
    document.getElementById('root')
  )
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
if (module.hot) {
  module.hot.accept()
}
