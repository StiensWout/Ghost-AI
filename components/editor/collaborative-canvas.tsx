"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense"
import { Component } from "react"
import type { ReactNode } from "react"

import { BaseCanvas } from "@/components/editor/base-canvas"

interface CollaborativeCanvasProps {
  roomId: string
}

interface LiveblocksCanvasErrorBoundaryProps {
  children: ReactNode
  resetKey: string
}

interface LiveblocksCanvasErrorBoundaryState {
  hasError: boolean
}

export function CollaborativeCanvas({ roomId }: CollaborativeCanvasProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <LiveblocksCanvasErrorBoundary resetKey={roomId}>
        <RoomProvider
          id={roomId}
          initialPresence={{
            cursor: null,
            isThinking: false,
          }}
        >
          <ClientSideSuspense fallback={<CanvasLoadingState />}>
            <BaseCanvas />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksCanvasErrorBoundary>
    </LiveblocksProvider>
  )
}

class LiveblocksCanvasErrorBoundary extends Component<
  LiveblocksCanvasErrorBoundaryProps,
  LiveblocksCanvasErrorBoundaryState
> {
  state: LiveblocksCanvasErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): LiveblocksCanvasErrorBoundaryState {
    return {
      hasError: true,
    }
  }

  componentDidUpdate(previousProps: LiveblocksCanvasErrorBoundaryProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return <CanvasConnectionError />
    }

    return this.props.children
  }
}

function CanvasLoadingState() {
  return (
    <CanvasStatusState
      title="Loading canvas"
      description="Connecting to the collaborative workspace."
    />
  )
}

function CanvasConnectionError() {
  return (
    <CanvasStatusState
      title="Canvas unavailable"
      description="The collaborative canvas could not connect."
    />
  )
}

function CanvasStatusState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center bg-base px-6 text-center">
      <div className="max-w-sm rounded-2xl border border-surface-border bg-surface/80 px-6 py-5 shadow-2xl backdrop-blur-xl">
        <p className="font-mono text-xs uppercase text-brand">{title}</p>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          {description}
        </p>
      </div>
    </div>
  )
}
