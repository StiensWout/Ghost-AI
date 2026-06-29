import "server-only"

import { Liveblocks } from "@liveblocks/node"

export const LIVEBLOCKS_CURSOR_COLORS = [
  "#00c8d4",
  "#6457f9",
  "#34d399",
  "#fbbf24",
  "#ff4d4f",
  "#8b82ff",
  "#0ac7b4",
  "#ff990a",
] as const

type LiveblocksGlobal = typeof globalThis & {
  liveblocksClient?: Liveblocks
}

export function getLiveblocksClient() {
  const globalForLiveblocks = globalThis as LiveblocksGlobal

  if (!globalForLiveblocks.liveblocksClient) {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY

    if (!secret) {
      throw new Error("LIVEBLOCKS_SECRET_KEY is required")
    }

    globalForLiveblocks.liveblocksClient = new Liveblocks({
      secret,
    })
  }

  return globalForLiveblocks.liveblocksClient
}

export function getLiveblocksCursorColor(userId: string) {
  let hash = 0

  for (const character of userId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }

  return LIVEBLOCKS_CURSOR_COLORS[hash % LIVEBLOCKS_CURSOR_COLORS.length]
}
