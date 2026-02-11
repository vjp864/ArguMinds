"use client"

import { useState } from "react"
import { toast } from "sonner"
import { deleteSource } from "@/lib/actions/sources"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DeleteSourceDialog({
  sourceId,
  sourceTitle,
  caseId,
  open,
  onOpenChange,
}: {
  sourceId: string
  sourceTitle: string
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [pending, setPending] = useState(false)

  const handleDelete = async () => {
    setPending(true)
    const result = await deleteSource(sourceId, caseId)
    setPending(false)

    if (result?.success) {
      onOpenChange(false)
      toast.success("Source supprimée")
    } else {
      toast.error(result?.error ?? "Erreur lors de la suppression")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la source</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer &quot;{sourceTitle}&quot; ?
            Les liens avec les arguments seront également supprimés.
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
