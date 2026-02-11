"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { STATUS_LABELS } from "@/lib/constants"
import { EditCaseDialog } from "./edit-case-dialog"
import { DeleteCaseDialog } from "./delete-case-dialog"

type CaseData = {
  id: string
  title: string
  description: string | null
  type: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

const statusVariants: Record<string, "default" | "secondary" | "outline"> = {
  EN_COURS: "default",
  TERMINE: "secondary",
  ARCHIVE: "outline",
}

export function CaseCard({
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
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <Link
              href={`/dashboard/${caseData.id}`}
              className="flex-1 hover:underline"
            >
              <CardTitle className="text-base">{caseData.title}</CardTitle>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariants[caseData.status] ?? "default"}>
                {STATUS_LABELS[caseData.status] ?? caseData.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${caseData.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ouvrir
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setDeleteOpen(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {caseData.description && (
            <CardDescription className="line-clamp-2">
              {caseData.description}
            </CardDescription>
          )}
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            {caseData.type && <span>{caseData.type}</span>}
            <span>
              {new Date(caseData.updatedAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </CardHeader>
      </Card>

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
      />
    </>
  )
}
