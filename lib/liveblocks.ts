import "server-only"

import { Liveblocks, LiveblocksError } from "@liveblocks/node"
import type { RoomPermissions } from "@liveblocks/node"

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

const liveblocksRoomWriteAccess: RoomPermissions = ["*:write"]

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

export async function grantLiveblocksRoomWriteAccess({
  roomId,
  userId,
}: {
  roomId: string
  userId: string
}) {
  await getLiveblocksClient().upsertRoom(roomId, {
    update: {
      defaultAccesses: [],
      usersAccesses: {
        [userId]: liveblocksRoomWriteAccess,
      },
    },
    create: {
      defaultAccesses: [],
      usersAccesses: {
        [userId]: liveblocksRoomWriteAccess,
      },
    },
  })
}

export async function revokeLiveblocksRoomAccess({
  roomId,
  userIds,
}: {
  roomId: string
  userIds: string[]
}) {
  const uniqueUserIds = Array.from(new Set(userIds))

  if (uniqueUserIds.length === 0) {
    return
  }

  try {
    await getLiveblocksClient().updateRoom(roomId, {
      usersAccesses: Object.fromEntries(
        uniqueUserIds.map((userId) => [userId, null])
      ),
    })
  } catch (error) {
    if (error instanceof LiveblocksError && error.status === 404) {
      return
    }

    throw error
  }
}

export function getLiveblocksCursorColor(userId: string) {
  let hash = 0

  for (const character of userId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }

  return LIVEBLOCKS_CURSOR_COLORS[hash % LIVEBLOCKS_CURSOR_COLORS.length]
}
