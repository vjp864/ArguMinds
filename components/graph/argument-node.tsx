"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type ArgumentNodeData = {
  id: string
  title: string
  content: string
  type: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const TYPE_STYLES: Record<string, { bg: string; border: string; badge: string }> = {
  PRINCIPAL: {
    bg: "bg-primary/5",
    border: "border-primary/40",
    badge: "bg-primary text-primary-foreground",
  },
  SUPPORT: {
    bg: "bg-accent/5",
    border: "border-accent/40",
    badge: "bg-accent text-accent-foreground",
  },
  OBJECTION: {
    bg: "bg-destructive/5",
    border: "border-destructive/40",
    badge: "bg-destructive text-white",
  },
  REFUTATION: {
    bg: "bg-secondary",
    border: "border-secondary-foreground/20",
    badge: "bg-secondary-foreground text-secondary",
  },
}

const TYPE_LABELS: Record<string, string> = {
  PRINCIPAL: "Principal",
  SUPPORT: "Support",
  OBJECTION: "Objection",
  REFUTATION: "Réfutation",
}

function ArgumentNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as ArgumentNodeData
  const style = TYPE_STYLES[nodeData.type] ?? TYPE_STYLES.PRINCIPAL

  return (
    <div
      className={`w-[250px] rounded-lg border-2 ${style.bg} ${style.border} p-3 shadow-sm`}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Badge className={`mb-2 text-[10px] ${style.badge}`}>
            {TYPE_LABELS[nodeData.type] ?? nodeData.type}
          </Badge>
          <p className="truncate text-sm font-semibold">{nodeData.title}</p>
        </div>
        <div className="nodrag nopan flex gap-1">
          <button
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation()
              nodeData.onEdit(nodeData.id)
            }}
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              nodeData.onDelete(nodeData.id)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  )
}

export const ArgumentNode = memo(ArgumentNodeComponent)
