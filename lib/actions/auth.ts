"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/lib/zod";

export async function register(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  };

  const result = signUpSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, email, password, role } = result.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Un compte avec cet email existe déjà" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as "AVOCAT" | "DEBATTEUR",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error:
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
    };
  }

  redirect("/login");
}

export async function login(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Email ou mot de passe incorrect" };
      }
      return { error: "Une erreur est survenue" };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
