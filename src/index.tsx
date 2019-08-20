import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'

import React, { useState, useCallback, useEffect } from 'react'
import { render } from 'react-dom'
import { init } from 'contentful-ui-extensions-sdk'
import { useSDKSetup, useSVGDraggable } from './hooks'
import { FieldExtensionSDK, Coordinate } from './types'
import { TextInput, FormLabel } from '@contentful/forma-36-react-components'

interface Props {
  sdk: FieldExtensionSDK<Coordinate>
  width?: number
  height?: number
  initial?: Coordinate
}

export function App({ sdk, initial = { x: 0, y: 0 }, width = 300, height = 150 }: Props) {
  const maxWidth = 800
  const ratio = maxWidth / width
  const maxHeight = ratio * height

  const [{ x, y }, setValue] = useState<Coordinate>({ x: initial.x || 0, y: initial.y || 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (x != null && y != null) {
        sdk.field.setValue({ x, y })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [sdk, x, y])

  const ref = useSVGDraggable(setValue, { x, y }, 1 / ratio)

  useSDKSetup(sdk, setValue)

  const onXChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue({ x: ~~e.currentTarget.value, y })
    },
    [y]
  )

  const onYChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue({ x, y: ~~e.currentTarget.value })
    },
    [x]
  )

  return (
    <>
      <svg ref={ref} width={maxWidth} height={maxHeight} viewBox={`0 0 ${width} ${height}`}>
        <rect width={width} height={height} x="0" y="0" fill="#f7f9fa" />

        {/** 縦 */}
        <line strokeWidth="1" stroke="#3c80cf" x1={x} x2={x} y1="0" y2="100%" />

        {/** 横 */}
        <line strokeWidth="1" stroke="#3c80cf" x1="0" x2="100%" y1={y} y2={y} />
      </svg>
      <FormLabel htmlFor="x">x:</FormLabel>
      <TextInput id="x" width="small" value={x.toString()} onChange={onXChange} />(
      {(x / width) * 100}%)
      <br />
      <FormLabel htmlFor="y">y:</FormLabel>
      <TextInput id="y" width="small" value={y.toString()} onChange={onYChange} />
      {(y / height) * 100}%)
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
