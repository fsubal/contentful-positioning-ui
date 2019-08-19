import Snap from './snapsvg'
import { useRef, useEffect, useMemo } from 'react'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import { Coordinate } from './types'

export const useSDKSetup = (sdk: FieldExtensionSDK, setValue: (value: any) => void) => {
  const detach = useMemo<Function>(
    () =>
      sdk.field.onValueChanged((next: any) => {
        if (next) {
          setValue(next)
        }
      }),
    []
  )

  useEffect(() => {
    sdk.window.startAutoResizer()

    return () => {
      if (detach) {
        detach()
      }
    }
  }, [])
}

export const useSVGDraggable = (onDrag: (next: Coordinate) => void, deps: unknown[]) => {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!ref.current) {
      return () => void 0
    }

    const snap = Snap(ref.current).drag(console.log, console.log, console.log)

    return () => void snap.undrag()
  }, [ref.current])

  return ref
}
