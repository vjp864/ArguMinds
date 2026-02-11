import prisma from "@/lib/prisma"

export async function getSourcesForCase(caseId: string, userId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId },
    select: { id: true },
  })

  if (!caseRecord) return []

  return prisma.source.findMany({
    where: { caseId },
    include: { _count: { select: { arguments: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getSourcesForArgument(
  argumentId: string,
  caseId: string,
  userId: string,
) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId },
    select: { id: true },
  })

  if (!caseRecord) return []

  return prisma.source.findMany({
    where: {
      caseId,
      arguments: { some: { id: argumentId } },
    },
    orderBy: { createdAt: "desc" },
  })
}
