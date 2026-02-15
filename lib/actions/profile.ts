"use server"

import { revalidatePath } from "next/cache"
import { auth, signOut } from "@/auth"
import prisma from "@/lib/prisma"
import { updateProfileSchema, changePasswordSchema } from "@/lib/zod"
import bcrypt from "bcryptjs"

export async function updateProfile(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  }

  const result = updateProfileSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  // Vérifier si l'email est déjà utilisé par un autre utilisateur
  if (result.data.email !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
    })
    if (existingUser) {
      return { error: "Cet email est déjà utilisé" }
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: result.data,
  })

  revalidatePath("/profile")
  return { success: true }
}

export async function changePassword(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  const result = changePasswordSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user?.password) {
    return { error: "Aucun mot de passe défini pour ce compte" }
  }

  const valid = await bcrypt.compare(result.data.currentPassword, user.password)
  if (!valid) {
    return { error: "Le mot de passe actuel est incorrect" }
  }

  const hashedPassword = await bcrypt.hash(result.data.newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  revalidatePath("/profile")
  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Non authentifié" }
  }

  await prisma.user.delete({
    where: { id: session.user.id },
  })

  await signOut({ redirectTo: "/login" })
}
