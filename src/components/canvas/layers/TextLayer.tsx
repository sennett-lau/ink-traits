import { ActiveElement, Attributes } from '@/types/canvas'
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvaseMouseMove,
  handleResize,
  initializeFabric,
} from '@/utils/canvas'
import { createText, createTextDetailed } from '@/utils/shapes'
import { create } from 'domain'

import React, { use, useEffect, useRef, useState } from 'react'

type Props = {
  textCanvasRef: React.RefObject<HTMLCanvasElement>
  isShowText: boolean
  textColor: string
  fontFamily: string
  fontWeight: string
}

const TextLayer = (props: Props) => {
  const { textCanvasRef, isShowText, textColor, fontFamily, fontWeight } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const isDrawing = useRef<boolean>(false)
  const shapeRef = useRef<fabric.Object | null>(null)
  const selectedShapeRef = useRef<string | null>(null)
  const activeObjectRef = useRef<fabric.Object | null>(null)
  const isEditingRef = useRef(false)

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: '',
  })

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: '',
    height: '',
    fontSize: '',
    fontFamily: '',
    fontWeight: '',
    fill: '#FD8603',
    stroke: '#FD8603',
  })

  useEffect(() => {
    if (!fabricRef.current || !isShowText) return

    const text = createTextDetailed(
      { x: fabricRef.current.width / 2 - 100, y: fabricRef.current.height / 2 } as any as PointerEvent,
      'Tap to Type',
      textColor,
      fontFamily,
      fontWeight,
    )

    fabricRef.current.add(text)
  }, [isShowText])

  const handleActiveElement = (el: ActiveElement) => {
    setActiveElement(el)

    selectedShapeRef.current = el?.value
  }

  useEffect(() => {
    if (!containerRef.current) return

    const canvas = initializeFabric({
      canvasRef: textCanvasRef,
      fabricRef,
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetWidth / 3,
    })

    canvas.on('mouse:down', (options) => {
      console.log('mouse:down', options)
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      })
    })

    canvas.on('mouse:move', (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
      })
    })

    canvas.on('mouse:up', () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        setActiveElement,
      })
    })

    canvas.on('object:modified', (options) => {
      return handleCanvasObjectModified({
        options,
      })
    })

    canvas?.on('object:moving', (options) => {
      handleCanvasObjectMoving({
        options,
      })
    })

    canvas.on('selection:created', (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      })
    })

    canvas.on('object:scaling', (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      })
    })

    window.addEventListener('resize', () => {
      handleResize({
        canvas: fabricRef.current,
      })
    })

    return () => {
      canvas.dispose()

      window.removeEventListener('resize', () => {
        handleResize({
          canvas: null,
        })
      })
    }
  }, [textCanvasRef])

  return (
    <div ref={containerRef} className='w-full h-full top-0 left-0 absolute z-20'>
      <canvas ref={textCanvasRef} />
    </div>
  )
}

export default TextLayer
function handleKeyDown(arg0: {
  e: KeyboardEvent
  canvas: import('fabric/fabric-impl').Canvas
  undo: any
  redo: any
  syncShapeInStorage: any
  deleteShapeFromStorage: any
}): any {
  throw new Error('Function not implemented.')
}
