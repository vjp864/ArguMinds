"use client"

import { useActionState } from "react"
import { toast } from "sonner"
import { createArgument } from "@/lib/actions/arguments"
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

type ExistingArgument = { id: string; title: string }

export function AddArgumentDialog({
  caseId,
  existingArguments,
  open,
  onOpenChange,
}: {
  caseId: string
  existingArguments: ExistingArgument[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: { error?: string } | undefined, formData: FormData) => {
      const result = await createArgument(caseId, prev, formData)
      if (result?.success) {
        onOpenChange(false)
        toast.success("Argument créé avec succès")
      }
      return result
    },
    undefined,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un argument</DialogTitle>
          <DialogDescription>
            Créez un nouvel argument dans le graphe.
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
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                placeholder="Titre de l'argument"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Développez votre argument..."
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue="PRINCIPAL">
                <SelectTrigger>
                  <SelectValue placeholder="Type d'argument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRINCIPAL">Principal</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="OBJECTION">Objection</SelectItem>
                  <SelectItem value="REFUTATION">Réfutation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {existingArguments.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="parentId">Argument parent (optionnel)</Label>
                <Select name="parentId">
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun (argument racine)" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingArguments.map((arg) => (
                      <SelectItem key={arg.id} value={arg.id}>
                        {arg.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
