"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteCase } from "@/lib/actions/cases"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DeleteCaseDialog({
  caseId,
  caseTitle,
  open,
  onOpenChange,
  redirectAfter,
}: {
  caseId: string
  caseTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectAfter?: boolean
}) {
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setPending(true)
    const result = await deleteCase(caseId)
    setPending(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success("Dossier supprimé")
    onOpenChange(false)

    if (redirectAfter) {
      router.push("/dashboard")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le dossier ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer le dossier &quot;{caseTitle}
            &quot;. Cette action est irréversible. Tous les arguments et sources
            associés seront également supprimés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
