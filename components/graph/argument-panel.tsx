"use client"

import { useState } from "react"
import { ExternalLink, Link2, Pencil, Sparkles, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { unlinkSourceFromArgument } from "@/lib/actions/sources"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { RichTextDisplay } from "@/components/ui/rich-text-display"
import { AiAnalysisPanel } from "./ai-analysis-panel"
import { LinkSourceDialog } from "./link-source-dialog"

type SourceItem = {
  id: string
  title: string
  url: string | null
}

type ArgumentData = {
  id: string
  title: string
  content: string
  type: string
  parentId: string | null
  createdAt: Date
  sources: SourceItem[]
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
  caseId,
  allSources,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  argument: ArgumentData | null
  caseId: string
  allSources: SourceItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [linkOpen, setLinkOpen] = useState(false)

  if (!argument) return null

  const linkedSourceIds = new Set(argument.sources.map((s) => s.id))
  const availableSources = allSources.filter((s) => !linkedSourceIds.has(s.id))

  const handleUnlink = async (sourceId: string) => {
    const result = await unlinkSourceFromArgument(sourceId, argument.id, caseId)
    if (result?.success) {
      toast.success("Source détachée")
    } else {
      toast.error(result?.error ?? "Erreur")
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col overflow-hidden sm:max-w-lg">
          <SheetHeader className="border-b px-6 pb-4 pt-6">
            <div className="flex items-start gap-3 pr-6">
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-base leading-tight">
                  {argument.title}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  <Badge className={TYPE_BADGE_STYLES[argument.type] ?? ""}>
                    {TYPE_LABELS[argument.type] ?? argument.type}
                  </Badge>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5">
              <div>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contenu
                </h3>
                <RichTextDisplay
                  content={argument.content}
                  className="text-justify"
                />
              </div>

              <Separator />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sources liées ({argument.sources.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setLinkOpen(true)}
                    disabled={availableSources.length === 0}
                  >
                    <Link2 className="mr-1 h-3 w-3" />
                    Lier
                  </Button>
                </div>
                {argument.sources.length === 0 ? (
                  <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                    Aucune source liée.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {argument.sources.map((source) => (
                      <div
                        key={source.id}
                        className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {source.title}
                          </p>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-0.5 flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span className="truncate">{source.url}</span>
                            </a>
                          )}
                        </div>
                        <button
                          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleUnlink(source.id)}
                          title="Détacher la source"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Intelligence Artificielle
                </h3>
                <AiAnalysisPanel
                  argumentId={argument.id}
                  caseId={caseId}
                  argumentTitle={argument.title}
                  argumentType={argument.type}
                  argumentParentId={argument.parentId}
                />
              </div>

              <Separator />

              <p className="text-xs text-muted-foreground">
                Créé le{" "}
                {new Date(argument.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="border-t px-6 py-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(argument.id)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive"
                onClick={() => onDelete(argument.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <LinkSourceDialog
        argumentId={argument.id}
        caseId={caseId}
        availableSources={availableSources}
        open={linkOpen}
        onOpenChange={setLinkOpen}
      />
    </>
  )
}
