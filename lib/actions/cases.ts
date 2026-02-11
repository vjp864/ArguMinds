"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { caseSchema, updateCaseSchema } from "@/lib/zod"

export async function createCase(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
  }

  const result = caseSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  await prisma.case.create({
    data: {
      ...result.data,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateCase(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
    status: formData.get("status") as string,
  }

  const result = updateCaseSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  await prisma.case.update({
    where: { id, userId: session.user.id },
    data: result.data,
  })

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/${id}`)
  return { success: true }
}

export async function deleteCase(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  await prisma.case.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/dashboard")
  return { success: true }
}
