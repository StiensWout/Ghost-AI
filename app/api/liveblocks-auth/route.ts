import { currentUser } from "@clerk/nextjs/server"

import {
  getCurrentProjectIdentity,
  getProjectAccessByOwnerOrCollaborator,
} from "@/lib/project-access"
import {
  getLiveblocksClient,
  getLiveblocksCursorColor,
} from "@/lib/liveblocks"
import { jsonError, readJsonObject } from "@/lib/project-api"

export async function POST(request: Request) {
  const identity = await getCurrentProjectIdentity()

  if (!identity) {
    return jsonError("Unauthorized", 401)
  }

  const body = await readJsonObject(request)

  if (!body) {
    return jsonError("Invalid request body", 400)
  }

  const roomId = readRoomId(body)

  if (!roomId) {
    return jsonError("Room ID is required", 400)
  }

  const access = await getProjectAccessByOwnerOrCollaborator({
    identity,
    roomId,
  })

  if (!access) {
    return jsonError("Forbidden", 403)
  }

  const liveblocks = getLiveblocksClient()

  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: [],
  })

  const user = await currentUser()
  const color = getLiveblocksCursorColor(identity.userId)
  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name: getDisplayName({
        fullName: user?.fullName ?? null,
        firstName: user?.firstName ?? null,
        username: user?.username ?? null,
        primaryEmail: identity.primaryEmail,
        userId: identity.userId,
      }),
      avatar: user?.imageUrl ?? "",
      color,
    },
  })

  session.allow(roomId, ["room:write"])

  const { body: responseBody, status } = await session.authorize()

  return new Response(responseBody, { status })
}

function readRoomId(body: Record<string, unknown>) {
  const rawRoomId = body.room ?? body.roomId

  if (typeof rawRoomId !== "string") {
    return null
  }

  const roomId = rawRoomId.trim()

  return roomId.length > 0 ? roomId : null
}

function getDisplayName({
  fullName,
  firstName,
  username,
  primaryEmail,
  userId,
}: {
  fullName: string | null
  firstName: string | null
  username: string | null
  primaryEmail: string | null
  userId: string
}) {
  return fullName ?? firstName ?? username ?? primaryEmail ?? userId
}
