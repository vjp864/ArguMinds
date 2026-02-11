"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type ArgumentData = {
  id: string
  title: string
  content: string
  type: string
  parentId: string | null
  createdAt: Date
}

const TYPE_LABELS: Record<string, string> = {
  PRINCIPAL: "Principal",
  SUPPORT: "Support",
  OBJECTION: "Objection",
  REFUTATION: "Réfutation",
}

const TYPE_BADGE_STYLES: Record<string, string> = {
  PRINCIPAL: "bg-primary text-primary-foreground",
  SUPPORT: "bg-accent text-accent-foreground",
  OBJECTION: "bg-destructive text-white",
  REFUTATION: "bg-secondary-foreground text-secondary",
}

export function ArgumentPanel({
  argument,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  argument: ArgumentData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (!argument) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{argument.title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <Badge className={TYPE_BADGE_STYLES[argument.type] ?? ""}>
              {TYPE_LABELS[argument.type] ?? argument.type}
            </Badge>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Contenu
            </p>
            <p className="whitespace-pre-wrap text-sm">{argument.content}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Créé le{" "}
              {new Date(argument.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(argument.id)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(argument.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
