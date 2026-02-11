"use client"

import { useState } from "react"
import { toast } from "sonner"
import { deleteArgument } from "@/lib/actions/arguments"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DeleteArgumentDialog({
  argumentId,
  argumentTitle,
  caseId,
  open,
  onOpenChange,
}: {
  argumentId: string
  argumentTitle: string
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [pending, setPending] = useState(false)

  const handleDelete = async () => {
    setPending(true)
    const result = await deleteArgument(argumentId, caseId)
    setPending(false)

    if (result?.success) {
      onOpenChange(false)
      toast.success("Argument supprimé")
    } else {
      toast.error(result?.error ?? "Erreur lors de la suppression")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l&apos;argument</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer &quot;{argumentTitle}&quot; ?
            Les arguments enfants deviendront orphelins.
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
