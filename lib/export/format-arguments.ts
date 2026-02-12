const TYPE_LABELS: Record<string, string> = {
  PRINCIPAL: "Principal",
  SUPPORT: "Support",
  OBJECTION: "Objection",
  REFUTATION: "Réfutation",
}

export function getTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type
}

export type ArgumentForExport = {
  id: string
  title: string
  content: string
  type: string
  parentId: string | null
  sources: { id: string; title: string; url: string | null }[]
}

export type ArgumentTreeNode = ArgumentForExport & {
  children: ArgumentTreeNode[]
}

export function buildArgumentTree(
  args: ArgumentForExport[],
): ArgumentTreeNode[] {
  const map = new Map<string, ArgumentTreeNode>()

  for (const arg of args) {
    map.set(arg.id, { ...arg, children: [] })
  }

  const roots: ArgumentTreeNode[] = []

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}
