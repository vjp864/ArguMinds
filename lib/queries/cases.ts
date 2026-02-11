import prisma from "@/lib/prisma"

export async function getCases(userId: string) {
  return prisma.case.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })
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
