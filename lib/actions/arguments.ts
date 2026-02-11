"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { argumentSchema } from "@/lib/zod"

export async function createArgument(
  caseId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) {
    return { error: "Dossier introuvable" }
  }

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    type: formData.get("type") as string,
    parentId: (formData.get("parentId") as string) || undefined,
  }

  const result = argumentSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  await prisma.argument.create({
    data: {
      title: result.data.title,
      content: result.data.content,
      type: result.data.type as "PRINCIPAL" | "SUPPORT" | "OBJECTION" | "REFUTATION",
      caseId,
      parentId: result.data.parentId || null,
    },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function updateArgument(
  id: string,
  caseId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) {
    return { error: "Dossier introuvable" }
  }

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    type: formData.get("type") as string,
    parentId: (formData.get("parentId") as string) || undefined,
  }

  const result = argumentSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  await prisma.argument.update({
    where: { id, caseId },
    data: {
      title: result.data.title,
      content: result.data.content,
      type: result.data.type as "PRINCIPAL" | "SUPPORT" | "OBJECTION" | "REFUTATION",
      parentId: result.data.parentId || null,
    },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function updateArgumentPosition(
  id: string,
  caseId: string,
  position: { x: number; y: number },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) {
    return { error: "Dossier introuvable" }
  }

  await prisma.argument.update({
    where: { id, caseId },
    data: { position },
  })

  return { success: true }
}

export async function deleteArgument(id: string, caseId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) {
    return { error: "Dossier introuvable" }
  }

  await prisma.argument.delete({
    where: { id, caseId },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function connectArguments(
  sourceId: string,
  targetId: string,
  caseId: string,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) {
    return { error: "Dossier introuvable" }
  }

  await prisma.argument.update({
    where: { id: targetId, caseId },
    data: { parentId: sourceId },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}
