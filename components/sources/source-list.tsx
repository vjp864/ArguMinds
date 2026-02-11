"use client"

import { useState, useMemo } from "react"
import { ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddSourceDialog } from "./add-source-dialog"
import { EditSourceDialog } from "./edit-source-dialog"
import { DeleteSourceDialog } from "./delete-source-dialog"

type SourceRecord = {
  id: string
  title: string
  url: string | null
  content: string | null
  caseId: string
  createdAt: Date
  _count: { arguments: number }
}

export function SourceList({
  sources,
  caseId,
}: {
  sources: SourceRecord[]
  caseId: string
}) {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<SourceRecord | null>(null)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search) return sources
    const q = search.toLowerCase()
    return sources.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.url?.toLowerCase().includes(q) ||
        s.content?.toLowerCase().includes(q),
    )
  }, [sources, search])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Sources
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({sources.length})
          </span>
        </h2>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une source
        </Button>
      </div>

      {sources.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {sources.length === 0
            ? "Aucune source. Ajoutez votre première référence."
            : "Aucune source ne correspond à votre recherche."}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((source) => (
            <div
              key={source.id}
              className="flex items-start justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{source.title}</p>
                  {source._count.arguments > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {source._count.arguments} arg.
                    </Badge>
                  )}
                </div>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{source.url}</span>
                  </a>
                )}
                {source.content && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {source.content}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => {
                    setSelectedSource(source)
                    setEditOpen(true)
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    setSelectedSource(source)
                    setDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSourceDialog
        caseId={caseId}
        open={addOpen}
        onOpenChange={setAddOpen}
      />

      {selectedSource && (
        <>
          <EditSourceDialog
            key={`edit-${selectedSource.id}`}
            source={{
              id: selectedSource.id,
              title: selectedSource.title,
              url: selectedSource.url,
              content: selectedSource.content,
            }}
            caseId={caseId}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteSourceDialog
            sourceId={selectedSource.id}
            sourceTitle={selectedSource.title}
            caseId={caseId}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </div>
  )
}
