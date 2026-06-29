"use client"

import { useCallback, useRef, useState, type DragEvent } from "react"
import { Cursors, useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react"
import {
  Circle,
  Database,
  Diamond,
  Hexagon,
  Pill,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { CANVAS_NODE_TYPE, NODE_COLORS, NODE_SHAPES } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, NodeShape } from "@/types/canvas"

const defaultNodeColor = NODE_COLORS[0]
const shapeDragMimeType = "application/vnd.ghost-ai.shape+json"

type CanvasHandleId = "top" | "right" | "bottom" | "left"

interface ShapeDragPayload {
  shape: NodeShape
  width: number
  height: number
}

interface ShapeOption extends ShapeDragPayload {
  label: string
  Icon: LucideIcon
}

interface ShapeDragPreviewState {
  payload: ShapeDragPayload
  x: number
  y: number
}

const shapeOptions: ShapeOption[] = [
  {
    shape: "rectangle",
    label: "Rectangle",
    width: 168,
    height: 88,
    Icon: RectangleHorizontal,
  },
  {
    shape: "diamond",
    label: "Diamond",
    width: 144,
    height: 144,
    Icon: Diamond,
  },
  {
    shape: "circle",
    label: "Circle",
    width: 112,
    height: 112,
    Icon: Circle,
  },
  {
    shape: "pill",
    label: "Pill",
    width: 168,
    height: 72,
    Icon: Pill,
  },
  {
    shape: "cylinder",
    label: "Cylinder",
    width: 148,
    height: 104,
    Icon: Database,
  },
  {
    shape: "hexagon",
    label: "Hexagon",
    width: 156,
    height: 96,
    Icon: Hexagon,
  },
]

const nodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeRenderer,
}

const canvasHandlePositions: Array<{
  id: CanvasHandleId
  position: Position
}> = [
  {
    id: "top",
    position: Position.Top,
  },
  {
    id: "right",
    position: Position.Right,
  },
  {
    id: "bottom",
    position: Position.Bottom,
  },
  {
    id: "left",
    position: Position.Left,
  },
]

export function BaseCanvas() {
  const reactFlowInstanceRef =
    useRef<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null)
  const nodeCounterRef = useRef(0)
  const shapeDragPayloadRef = useRef<ShapeDragPayload | null>(null)
  const [shapeDragPreview, setShapeDragPreview] =
    useState<ShapeDragPreviewState | null>(null)
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDelete,
  } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
    nodes: {
      initial: [],
    },
    edges: {
      initial: [],
    },
  })

  const handleReactFlowInit = useCallback(
    (reactFlowInstance: ReactFlowInstance<CanvasNode, CanvasEdge>) => {
      reactFlowInstanceRef.current = reactFlowInstance
    },
    []
  )

  const handleShapeDragStart = useCallback(
    (event: DragEvent<HTMLButtonElement>, shapeOption: ShapeOption) => {
      const payload: ShapeDragPayload = {
        shape: shapeOption.shape,
        width: shapeOption.width,
        height: shapeOption.height,
      }

      shapeDragPayloadRef.current = payload
      event.dataTransfer.effectAllowed = "copy"
      event.dataTransfer.setData(shapeDragMimeType, JSON.stringify(payload))
      event.dataTransfer.setData("text/plain", shapeOption.shape)
    },
    []
  )

  const handleCanvasDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!hasShapeDragPayload(event.dataTransfer)) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"

    const payload = shapeDragPayloadRef.current
    if (!payload) {
      return
    }

    const canvasBounds = event.currentTarget.getBoundingClientRect()
    setShapeDragPreview({
      payload,
      x: event.clientX - canvasBounds.left,
      y: event.clientY - canvasBounds.top,
    })
  }, [])

  const handleCanvasDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget

      if (
        nextTarget instanceof Node &&
        event.currentTarget.contains(nextTarget)
      ) {
        return
      }

      setShapeDragPreview(null)
    },
    []
  )

  const handleCanvasDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      const payload =
        readShapeDragPayload(event.dataTransfer) ?? shapeDragPayloadRef.current
      if (!payload) {
        return
      }

      event.preventDefault()
      setShapeDragPreview(null)
      shapeDragPayloadRef.current = null

      const reactFlowInstance = reactFlowInstanceRef.current
      if (!reactFlowInstance) {
        return
      }

      nodeCounterRef.current += 1

      const newNode: CanvasNode = {
        id: `${payload.shape}-${Date.now()}-${nodeCounterRef.current}`,
        type: CANVAS_NODE_TYPE,
        position: reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
        width: payload.width,
        height: payload.height,
        data: {
          label: "",
          color: defaultNodeColor.id,
          shape: payload.shape,
        },
      }

      onNodesChange([{ type: "add", item: newNode }])
    },
    [onNodesChange]
  )

  const clearShapeDragPreview = useCallback(() => {
    setShapeDragPreview(null)
    shapeDragPayloadRef.current = null
  }, [])

  return (
    <ReactFlow<CanvasNode, CanvasEdge>
      className="h-full w-full bg-base text-copy-primary [&_.react-flow__pane]:cursor-grab [&_.react-flow__pane:active]:cursor-grabbing"
      colorMode="dark"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      onInit={handleReactFlowInit}
      onDragOver={handleCanvasDragOver}
      onDragLeave={handleCanvasDragLeave}
      onDrop={handleCanvasDrop}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      connectionRadius={32}
      fitViewOptions={{
        maxZoom: 1,
        padding: 0.24,
      }}
      fitView
      proOptions={{
        hideAttribution: true,
      }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={18}
        size={1}
        color="var(--border-default)"
      />
      <div className="pointer-events-auto absolute bottom-5 right-5 z-20 h-34 w-56 overflow-hidden rounded-xl border border-surface-border bg-base shadow-2xl [&_.react-flow__panel]:!static [&_.react-flow__panel]:!m-0 [&_.react-flow__panel]:!transform-none">
        <MiniMap
          pannable
          zoomable
          position="top-left"
          className="h-full w-full bg-base"
          bgColor="var(--bg-surface)"
          maskColor="color-mix(in srgb, var(--bg-base) 72%, transparent)"
          maskStrokeColor="var(--border-subtle)"
          maskStrokeWidth={1}
          nodeColor={(node) => getNodeFill(node.data.color)}
          nodeStrokeColor="var(--border-subtle)"
          nodeBorderRadius={6}
        />
      </div>
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2">
        <ShapePanel
          onShapeDragStart={handleShapeDragStart}
          onShapeDragEnd={clearShapeDragPreview}
        />
      </div>
      <ShapeDragPreview preview={shapeDragPreview} />
      <Cursors />
    </ReactFlow>
  )
}

interface ShapePanelProps {
  onShapeDragStart: (
    event: DragEvent<HTMLButtonElement>,
    shapeOption: ShapeOption
  ) => void
  onShapeDragEnd: () => void
}

function ShapePanel({ onShapeDragEnd, onShapeDragStart }: ShapePanelProps) {
  return (
    <div className="nodrag nopan pointer-events-auto flex h-16 w-max items-center gap-3 rounded-full border border-surface-border-subtle bg-base/85 px-5 shadow-2xl backdrop-blur-xl">
      {shapeOptions.map((shapeOption) => {
        const { Icon } = shapeOption

        return (
          <button
            key={shapeOption.shape}
            type="button"
            draggable
            aria-label={`Add ${shapeOption.label} node`}
            title={shapeOption.label}
            className="flex size-8 items-center justify-center rounded-xl border border-transparent text-copy-muted transition-colors hover:border-surface-border-subtle hover:bg-subtle hover:text-copy-primary focus-visible:border-brand focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/30"
            onDragStart={(event) => onShapeDragStart(event, shapeOption)}
            onDragEnd={onShapeDragEnd}
          >
            <Icon className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

function CanvasNodeRenderer({
  data,
  height,
  isConnectable,
  selected,
  width,
}: NodeProps<CanvasNode>) {
  const nodeColor = getNodeColor(data.color)

  return (
    <div
      className={cn(
        "group/canvas-node relative flex min-h-16 min-w-24 items-center justify-center rounded-xl border border-surface-border-subtle px-4 py-3 text-center text-sm font-medium shadow-2xl",
        selected && "border-brand shadow-brand/10"
      )}
      style={{
        width,
        height,
        backgroundColor: nodeColor.fill,
        color: nodeColor.text,
      }}
    >
      {canvasHandlePositions.map((handle) => (
        <CanvasNodeHandle
          key={handle.id}
          id={handle.id}
          position={handle.position}
          isConnectable={isConnectable}
        />
      ))}
      <span className="max-w-full truncate">{data.label}</span>
    </div>
  )
}

interface CanvasNodeHandleProps {
  id: CanvasHandleId
  position: Position
  isConnectable: boolean
}

function CanvasNodeHandle({
  id,
  position,
  isConnectable,
}: CanvasNodeHandleProps) {
  return (
    <Handle
      id={id}
      type="source"
      position={position}
      isConnectable={isConnectable}
      isConnectableStart={isConnectable}
      isConnectableEnd={isConnectable}
      className="!size-3 !border !border-base !bg-copy-primary opacity-0 transition-opacity group-hover/canvas-node:opacity-100"
    />
  )
}

interface ShapeDragPreviewProps {
  preview: ShapeDragPreviewState | null
}

function ShapeDragPreview({ preview }: ShapeDragPreviewProps) {
  if (!preview) {
    return null
  }

  const shapeOption = getShapeOption(preview.payload.shape)
  const Icon = shapeOption.Icon

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-50 flex items-center justify-center rounded-xl border border-brand/70 bg-surface/85 text-brand opacity-80 shadow-2xl ring-4 ring-brand/10 backdrop-blur-sm"
      style={{
        width: preview.payload.width,
        height: preview.payload.height,
        transform: `translate(${preview.x - preview.payload.width / 2}px, ${
          preview.y - preview.payload.height / 2
        }px)`,
      }}
    >
      <Icon className="h-6 w-6 stroke-[1.75]" />
    </div>
  )
}

function getNodeFill(color: unknown) {
  return getNodeColor(color).fill
}

function getNodeColor(color: unknown) {
  return (
    NODE_COLORS.find((nodeColor) => nodeColor.id === color) ?? defaultNodeColor
  )
}

function getShapeOption(shape: NodeShape) {
  return (
    shapeOptions.find((shapeOption) => shapeOption.shape === shape) ??
    shapeOptions[0]
  )
}

function readShapeDragPayload(dataTransfer: DataTransfer) {
  const rawPayload = dataTransfer.getData(shapeDragMimeType)
  if (!rawPayload) {
    return null
  }

  try {
    const payload: unknown = JSON.parse(rawPayload)
    if (!isShapeDragPayload(payload)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

function hasShapeDragPayload(dataTransfer: DataTransfer) {
  return Array.from(dataTransfer.types).includes(shapeDragMimeType)
}

function isShapeDragPayload(payload: unknown): payload is ShapeDragPayload {
  if (!isRecord(payload)) {
    return false
  }

  return (
    isNodeShape(payload.shape) &&
    isPositiveNumber(payload.width) &&
    isPositiveNumber(payload.height)
  )
}

function isNodeShape(shape: unknown): shape is NodeShape {
  return (
    typeof shape === "string" &&
    (NODE_SHAPES as readonly string[]).includes(shape)
  )
}

function isPositiveNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
