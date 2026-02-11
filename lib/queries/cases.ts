import prisma from "@/lib/prisma"
import type { Status } from "@/lib/generated/prisma/client"

type GetCasesOptions = {
  userId: string
  search?: string
  status?: string
  type?: string
  sort?: string
}

export async function getCases({
  userId,
  search,
  status,
  type,
  sort,
}: GetCasesOptions) {
  const where: Record<string, unknown> = { userId }

  if (search) {
    where.title = { contains: search, mode: "insensitive" }
  }

  if (status && status !== "ALL") {
    where.status = status as Status
  }

  if (type && type !== "ALL") {
    where.type = type
  }

  let orderBy: Record<string, string>
  switch (sort) {
    case "created":
      orderBy = { createdAt: "desc" }
      break
    case "title":
      orderBy = { title: "asc" }
      break
    default:
      orderBy = { updatedAt: "desc" }
  }

  return prisma.case.findMany({ where, orderBy })
}

export async function getCase(id: string, userId: string) {
  return prisma.case.findUnique({
    where: { id, userId },
    include: {
      arguments: true,
      sources: true,
    },
  })
}
