"use client"

import { useActionState } from "react"
import { toast } from "sonner"
import { updateSource } from "@/lib/actions/sources"
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

type SourceData = {
  id: string
  title: string
  url: string | null
  content: string | null
}

export function EditSourceDialog({
  source,
  caseId,
  open,
  onOpenChange,
}: {
  source: SourceData
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: { error?: string } | undefined, formData: FormData) => {
      const result = await updateSource(source.id, caseId, prev, formData)
      if (result?.success) {
        onOpenChange(false)
        toast.success("Source modifiée avec succès")
      }
      return result
    },
    undefined,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la source</DialogTitle>
          <DialogDescription>
            Modifiez les détails de cette source.
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
              <Label htmlFor="edit-source-title">Titre</Label>
              <Input
                id="edit-source-title"
                name="title"
                defaultValue={source.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-source-url">URL (optionnel)</Label>
              <Input
                id="edit-source-url"
                name="url"
                type="url"
                defaultValue={source.url ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-source-content">
                Extrait / Citation (optionnel)
              </Label>
              <Textarea
                id="edit-source-content"
                name="content"
                defaultValue={source.content ?? ""}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
