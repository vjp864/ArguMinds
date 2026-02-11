"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { sourceSchema } from "@/lib/zod"

export async function createSource(
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
    url: (formData.get("url") as string) || undefined,
    content: (formData.get("content") as string) || undefined,
  }

  const result = sourceSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  await prisma.source.create({
    data: {
      title: result.data.title,
      url: result.data.url || null,
      content: result.data.content || null,
      caseId,
    },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function updateSource(
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
    url: (formData.get("url") as string) || undefined,
    content: (formData.get("content") as string) || undefined,
  }

  const result = sourceSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  await prisma.source.update({
    where: { id, caseId },
    data: {
      title: result.data.title,
      url: result.data.url || null,
      content: result.data.content || null,
    },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function deleteSource(id: string, caseId: string) {
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

  await prisma.source.delete({
    where: { id, caseId },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function linkSourceToArgument(
  sourceId: string,
  argumentId: string,
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

  await prisma.source.update({
    where: { id: sourceId, caseId },
    data: {
      arguments: { connect: { id: argumentId } },
    },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}

export async function unlinkSourceFromArgument(
  sourceId: string,
  argumentId: string,
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

  await prisma.source.update({
    where: { id: sourceId, caseId },
    data: {
      arguments: { disconnect: { id: argumentId } },
    },
  })

  revalidatePath(`/dashboard/${caseId}`)
  return { success: true }
}
