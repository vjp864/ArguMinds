"use client"

import { useActionState } from "react"
import { toast } from "sonner"
import { createSource } from "@/lib/actions/sources"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AddSourceDialog({
  caseId,
  open,
  onOpenChange,
}: {
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: { error?: string } | undefined, formData: FormData) => {
      const result = await createSource(caseId, prev, formData)
      if (result?.success) {
        onOpenChange(false)
        toast.success("Source ajoutée avec succès")
      }
      return result
    },
    undefined,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une source</DialogTitle>
          <DialogDescription>
            Ajoutez une référence juridique ou documentaire.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="space-y-4 py-4">
            {state?.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="source-title">Titre</Label>
              <Input
                id="source-title"
                name="title"
                placeholder="Titre de la source"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source-url">URL (optionnel)</Label>
              <Input
                id="source-url"
                name="url"
                type="url"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source-content">Extrait / Citation (optionnel)</Label>
              <Textarea
                id="source-content"
                name="content"
                placeholder="Citation ou extrait pertinent..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
