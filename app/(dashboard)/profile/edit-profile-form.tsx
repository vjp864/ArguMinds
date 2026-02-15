"use client"

import { useActionState } from "react"
import { toast } from "sonner"
import { updateProfile } from "@/lib/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EditProfileForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string
  defaultEmail: string
}) {
  const [state, formAction, pending] = useActionState(
    async (
      prev: { error?: string; success?: boolean } | undefined,
      formData: FormData,
    ) => {
      const result = await updateProfile(prev, formData)
      if (result?.success) {
        toast.success("Profil mis à jour avec succès")
      }
      return result
    },
    undefined,
  )

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultName}
            placeholder="Votre nom"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="votre@email.com"
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
