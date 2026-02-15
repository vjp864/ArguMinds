"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteAiAnalysis(id: string, caseId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Non authentifié" }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) return { error: "Dossier introuvable" }

  await prisma.aiAnalysis.delete({ where: { id } })
  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function deleteAllAnalysesForArgument(
  argumentId: string,
  caseId: string,
) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Non authentifié" }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) return { error: "Dossier introuvable" }

  await prisma.aiAnalysis.deleteMany({ where: { argumentId } })
  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}
