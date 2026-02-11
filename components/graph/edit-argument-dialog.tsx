"use client"

import { useActionState } from "react"
import { toast } from "sonner"
import { updateArgument } from "@/lib/actions/arguments"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ArgumentData = {
  id: string
  title: string
  content: string
  type: string
  parentId: string | null
}

type ExistingArgument = { id: string; title: string }

export function EditArgumentDialog({
  argument,
  caseId,
  existingArguments,
  open,
  onOpenChange,
}: {
  argument: ArgumentData
  caseId: string
  existingArguments: ExistingArgument[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: { error?: string } | undefined, formData: FormData) => {
      const result = await updateArgument(argument.id, caseId, prev, formData)
      if (result?.success) {
        onOpenChange(false)
        toast.success("Argument modifié avec succès")
      }
      return result
    },
    undefined,
  )

  const otherArguments = existingArguments.filter((a) => a.id !== argument.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;argument</DialogTitle>
          <DialogDescription>
            Modifiez les détails de cet argument.
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
              <Label htmlFor="edit-title">Titre</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={argument.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Contenu</Label>
              <Textarea
                id="edit-content"
                name="content"
                defaultValue={argument.content}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select name="type" defaultValue={argument.type}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRINCIPAL">Principal</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="OBJECTION">Objection</SelectItem>
                  <SelectItem value="REFUTATION">Réfutation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {otherArguments.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="edit-parentId">Argument parent (optionnel)</Label>
                <Select
                  name="parentId"
                  defaultValue={argument.parentId ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun (argument racine)" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherArguments.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
