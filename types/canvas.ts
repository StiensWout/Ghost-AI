import type { Edge, Node } from "@xyflow/react"

export const CANVAS_NODE_TYPE = "canvasNode"
export const CANVAS_EDGE_TYPE = "canvasEdge"

export const NODE_COLORS = [
  {
    id: "neutral",
    fill: "#1F1F1F",
    text: "#EDEDED",
  },
  {
    id: "blue",
    fill: "#10233D",
    text: "#52A8FF",
  },
  {
    id: "purple",
    fill: "#2E1938",
    text: "#BF7AF0",
  },
  {
    id: "orange",
    fill: "#331B00",
    text: "#FF990A",
  },
  {
    id: "red",
    fill: "#3C1618",
    text: "#FF6166",
  },
  {
    id: "pink",
    fill: "#3A1726",
    text: "#F75F8F",
  },
  {
    id: "green",
    fill: "#0F2E18",
    text: "#62C073",
  },
  {
    id: "teal",
    fill: "#062822",
    text: "#0AC7B4",
  },
] as const

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const

export type CanvasNodeType = typeof CANVAS_NODE_TYPE
export type CanvasEdgeType = typeof CANVAS_EDGE_TYPE
export type NodeColorId = (typeof NODE_COLORS)[number]["id"]
export type NodeShape = (typeof NODE_SHAPES)[number]

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: NodeColorId
  shape: NodeShape
}

export type CanvasEdgeData = Record<string, unknown>

export type CanvasNode = Node<CanvasNodeData, CanvasNodeType>
export type CanvasEdge = Edge<CanvasEdgeData, CanvasEdgeType>
