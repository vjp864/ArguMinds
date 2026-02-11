"use client"

import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { toast } from "sonner"
import { linkSourceToArgument } from "@/lib/actions/sources"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type SourceItem = {
  id: string
  title: string
  url: string | null
}

export function LinkSourceDialog({
  argumentId,
  caseId,
  availableSources,
  open,
  onOpenChange,
}: {
  argumentId: string
  caseId: string
  availableSources: SourceItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [search, setSearch] = useState("")
  const [pending, setPending] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search) return availableSources
    const q = search.toLowerCase()
    return availableSources.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.url?.toLowerCase().includes(q),
    )
  }, [availableSources, search])

  const handleLink = async (sourceId: string) => {
    setPending(sourceId)
    const result = await linkSourceToArgument(sourceId, argumentId, caseId)
    setPending(null)

    if (result?.success) {
      toast.success("Source liée à l'argument")
      onOpenChange(false)
    } else {
      toast.error(result?.error ?? "Erreur lors de la liaison")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lier une source</DialogTitle>
          <DialogDescription>
            Sélectionnez une source à lier à cet argument.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {availableSources.length > 3 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {availableSources.length === 0
                ? "Aucune source disponible. Créez d'abord une source dans la bibliothèque."
                : "Aucune source ne correspond."}
            </p>
          ) : (
            <div className="max-h-[300px] space-y-1 overflow-y-auto">
              {filtered.map((source) => (
                <button
                  key={source.id}
                  className="flex w-full items-center justify-between rounded-md border p-3 text-left hover:bg-muted disabled:opacity-50"
                  onClick={() => handleLink(source.id)}
                  disabled={pending !== null}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{source.title}</p>
                    {source.url && (
                      <p className="truncate text-xs text-muted-foreground">
                        {source.url}
                      </p>
                    )}
                  </div>
                  <Plus className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
