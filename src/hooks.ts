import Snap from './snapsvg'
import { useRef, useEffect, useMemo, useCallback } from 'react'
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import { Coordinate } from './types'

export const useSDKSetup = (sdk: FieldExtensionSDK, setValue: (value: any) => void) => {
  const detach = useMemo<Function>(
    () =>
      sdk.field.onValueChanged((next: any) => {
        if (next && next.x != null && next.y != null) {
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

const noop = () => undefined

let origin: Coordinate | null = null

export const useSVGDraggable = (
  onChange: (next: Coordinate) => void,
  current: Coordinate,
  scale: number
) => {
  const ref = useRef<SVGSVGElement | null>(null)

  const onDragStart = useCallback(() => {
    origin = current
  }, [current])

  const onDragMove = useCallback(
    (dx: number, dy: number) => {
      if (!origin) {
        return
      }

      onChange({
        x: origin.x + dx * scale,
        y: origin.y + dy * scale
      })
    },
    [origin, scale, onChange]
  )

  useEffect(() => {
    if (!ref.current) {
      return noop
    }

    const snap = Snap(ref.current).drag(onDragMove, onDragStart, noop)

    return () => void snap.undrag()
  }, [ref.current])

  return ref
}
