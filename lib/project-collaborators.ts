import "server-only"

import { clerkClient } from "@clerk/nextjs/server"
import type { User } from "@clerk/backend"

import { normalizeCollaboratorEmail } from "@/lib/project-api"
import type { ProjectCollaboratorResource } from "@/types/projects"

interface SelectedProjectCollaborator {
  email: string
  createdAt: Date
}

interface ClerkUserProfile {
  displayName: string | null
  avatarUrl: string | null
}

export async function serializeProjectCollaborators(
  collaborators: SelectedProjectCollaborator[]
): Promise<ProjectCollaboratorResource[]> {
  const clerkUsersByEmail = await getClerkUsersByEmail(
    collaborators.map((collaborator) => collaborator.email)
  )

  return collaborators.map((collaborator) => {
    const profile =
      clerkUsersByEmail.get(normalizeCollaboratorEmail(collaborator.email)) ??
      null

    return {
      email: collaborator.email,
      displayName: profile?.displayName ?? null,
      avatarUrl: profile?.avatarUrl ?? null,
      createdAt: collaborator.createdAt.toISOString(),
    }
  })
}

export async function getClerkUserIdsByEmail(email: string) {
  const normalizedEmail = normalizeCollaboratorEmail(email)
  const client = await clerkClient()
  const users = await client.users.getUserList({
    emailAddress: [normalizedEmail],
    limit: 100,
  })

  return users.data
    .filter((user) =>
      user.emailAddresses.some(
        (emailAddress) =>
          normalizeCollaboratorEmail(emailAddress.emailAddress) ===
          normalizedEmail
      )
    )
    .map((user) => user.id)
}

async function getClerkUsersByEmail(emails: string[]) {
  const uniqueEmails = Array.from(
    new Set(emails.map((email) => normalizeCollaboratorEmail(email)))
  )

  if (uniqueEmails.length === 0) {
    return new Map<string, ClerkUserProfile>()
  }

  const usersByEmail = new Map<string, ClerkUserProfile>()
  const client = await getClerkClientOrNull()

  if (!client) {
    return usersByEmail
  }

  for (const emailBatch of chunkArray(uniqueEmails, 100)) {
    try {
      const users = await client.users.getUserList({
        emailAddress: emailBatch,
        limit: emailBatch.length,
      })

      for (const user of users.data) {
        const profile = serializeClerkUserProfile(user)

        for (const emailAddress of user.emailAddresses) {
          usersByEmail.set(
            normalizeCollaboratorEmail(emailAddress.emailAddress),
            profile
          )
        }
      }
    } catch {
      continue
    }
  }

  return usersByEmail
}

async function getClerkClientOrNull() {
  try {
    return await clerkClient()
  } catch {
    return null
  }
}

function serializeClerkUserProfile(user: User): ClerkUserProfile {
  const displayName = [user.firstName, user.lastName]
    .filter((name) => Boolean(name))
    .join(" ")

  return {
    displayName: displayName || user.username || null,
    avatarUrl: user.imageUrl || null,
  }
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}
