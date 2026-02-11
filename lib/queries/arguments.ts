import prisma from "@/lib/prisma"

export async function getArgumentsForCase(caseId: string, userId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId },
    select: { id: true },
  })

  if (!caseRecord) return []

  return prisma.argument.findMany({
    where: { caseId },
    orderBy: { createdAt: "asc" },
  })
}
