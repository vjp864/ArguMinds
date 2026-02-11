"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditCaseDialog } from "../edit-case-dialog"
import { DeleteCaseDialog } from "../delete-case-dialog"

type CaseData = {
  id: string
  title: string
  description: string | null
  type: string | null
  status: string
}

export function CaseActions({
  caseData,
  userRole,
}: {
  caseData: CaseData
  userRole: string
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </div>

      <EditCaseDialog
        caseData={caseData}
        userRole={userRole}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteCaseDialog
        caseId={caseData.id}
        caseTitle={caseData.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        redirectAfter
      />
    </>
  )
}
