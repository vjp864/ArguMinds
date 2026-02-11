"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_LABELS } from "@/lib/constants"

export function CaseFilters({ caseTypes }: { caseTypes: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "ALL") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/dashboard?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un dossier..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => updateParam("search", e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        defaultValue={searchParams.get("status") ?? "ALL"}
        onValueChange={(v) => updateParam("status", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les statuts</SelectItem>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("type") ?? "ALL"}
        onValueChange={(v) => updateParam("type", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les types</SelectItem>
          {caseTypes.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("sort") ?? "updated"}
        onValueChange={(v) => updateParam("sort", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">Dernière modification</SelectItem>
          <SelectItem value="created">Date de création</SelectItem>
          <SelectItem value="title">Titre A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
