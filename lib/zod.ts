import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["AVOCAT", "DEBATTEUR"]),
})

export const caseSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.string().optional(),
})

export const updateCaseSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["EN_COURS", "TERMINE", "ARCHIVE"]),
})

export const argumentSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  type: z.enum(["PRINCIPAL", "SUPPORT", "OBJECTION", "REFUTATION"]),
  parentId: z.string().optional(),
})
