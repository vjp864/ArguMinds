"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  BackgroundVariant,
} from "@xyflow/react"
import dagre from "dagre"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  updateArgumentPosition,
  connectArguments,
} from "@/lib/actions/arguments"
import { ArgumentNode } from "./argument-node"
import { AddArgumentDialog } from "./add-argument-dialog"
import { EditArgumentDialog } from "./edit-argument-dialog"
import { DeleteArgumentDialog } from "./delete-argument-dialog"
import { ArgumentPanel } from "./argument-panel"

type SourceItem = {
  id: string
  title: string
  url: string | null
}

type ArgumentRecord = {
  id: string
  title: string
  content: string
  type: string
  caseId: string
  parentId: string | null
  position: unknown
  createdAt: Date
  sources: SourceItem[]
}

const nodeTypes = { argument: ArgumentNode }

const NODE_WIDTH = 250
const NODE_HEIGHT = 80

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 })

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

function hasSavedPosition(position: unknown): position is { x: number; y: number } {
  return (
    position !== null &&
    typeof position === "object" &&
    "x" in (position as Record<string, unknown>) &&
    "y" in (position as Record<string, unknown>)
  )
}

function buildNodesAndEdges(
  args: ArgumentRecord[],
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onAiAnalyze: (id: string) => void,
) {
  const edges: Edge[] = args
    .filter((arg) => arg.parentId)
    .map((arg) => ({
      id: `e-${arg.parentId}-${arg.id}`,
      source: arg.parentId!,
      target: arg.id,
      animated: true,
    }))

  const hasAnyWithoutPosition = args.some((a) => !hasSavedPosition(a.position))
  const allWithoutPosition = args.every((a) => !hasSavedPosition(a.position))

  // If some nodes lack a position, run dagre to layout everything properly
  if (hasAnyWithoutPosition && args.length > 0) {
    const tempNodes: Node[] = args.map((arg) => ({
      id: arg.id,
      type: "argument",
      position: { x: 0, y: 0 },
      data: {
        id: arg.id,
        title: arg.title,
        content: arg.content,
        type: arg.type,
        onEdit,
        onDelete,
        onAiAnalyze,
      },
    }))

    const layouted = getLayoutedElements(tempNodes, edges)

    // If not all are missing position, keep saved positions for nodes that have them
    if (!allWithoutPosition) {
      layouted.nodes = layouted.nodes.map((node) => {
        const arg = args.find((a) => a.id === node.id)
        if (arg && hasSavedPosition(arg.position)) {
          return { ...node, position: arg.position }
        }
        return node
      })
    }

    return layouted
  }

  // All nodes have saved positions
  const nodes: Node[] = args.map((arg) => ({
    id: arg.id,
    type: "argument",
    position: (arg.position as { x: number; y: number }),
    data: {
      id: arg.id,
      title: arg.title,
      content: arg.content,
      type: arg.type,
      onEdit,
      onDelete,
    },
  }))

  return { nodes, edges }
}

function ArgumentGraphInner({
  arguments: initialArgs,
  caseId,
  allSources,
}: {
  arguments: ArgumentRecord[]
  caseId: string
  allSources: SourceItem[]
}) {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedArgId, setSelectedArgId] = useState<string | null>(null)

  const handleEdit = useCallback((id: string) => {
    setSelectedArgId(id)
    setPanelOpen(false)
    setEditOpen(true)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setSelectedArgId(id)
    setPanelOpen(false)
    setDeleteOpen(true)
  }, [])

  const handleAiAnalyze = useCallback((id: string) => {
    setSelectedArgId(id)
    setPanelOpen(true)
  }, [])

  const { nodes: builtNodes, edges: builtEdges } = useMemo(
    () => buildNodesAndEdges(initialArgs, handleEdit, handleDelete, handleAiAnalyze),
    [initialArgs, handleEdit, handleDelete, handleAiAnalyze],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges)

  // Sync nodes/edges when server data changes (after revalidatePath)
  useEffect(() => {
    setNodes(builtNodes)
    setEdges(builtEdges)
  }, [builtNodes, builtEdges, setNodes, setEdges])

  const selectedArg = useMemo(
    () => initialArgs.find((a) => a.id === selectedArgId) ?? null,
    [initialArgs, selectedArgId],
  )

  const existingArguments = useMemo(
    () => initialArgs.map((a) => ({ id: a.id, title: a.title })),
    [initialArgs],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
      if (connection.source && connection.target) {
        connectArguments(connection.source, connection.target, caseId)
      }
    },
    [setEdges, caseId],
  )

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      updateArgumentPosition(node.id, caseId, node.position)
    },
    [caseId],
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedArgId(node.id)
      setPanelOpen(true)
    },
    [],
  )

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {initialArgs.length} argument{initialArgs.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un argument
        </Button>
      </div>

      <div
        style={{ width: "100%", height: "calc(100vh - 300px)", minHeight: "400px" }}
        className="rounded-lg border bg-background"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
      </div>

      <AddArgumentDialog
        caseId={caseId}
        existingArguments={existingArguments}
        open={addOpen}
        onOpenChange={setAddOpen}
      />

      {selectedArg && (
        <>
          <EditArgumentDialog
            key={`edit-${selectedArg.id}`}
            argument={{
              id: selectedArg.id,
              title: selectedArg.title,
              content: selectedArg.content,
              type: selectedArg.type,
              parentId: selectedArg.parentId,
            }}
            caseId={caseId}
            existingArguments={existingArguments}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteArgumentDialog
            argumentId={selectedArg.id}
            argumentTitle={selectedArg.title}
            caseId={caseId}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
          <ArgumentPanel
            argument={selectedArg}
            caseId={caseId}
            allSources={allSources}
            open={panelOpen}
            onOpenChange={setPanelOpen}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  )
}

export function ArgumentGraph(props: {
  arguments: ArgumentRecord[]
  caseId: string
  allSources: SourceItem[]
}) {
  return (
    <ReactFlowProvider>
      <ArgumentGraphInner {...props} />
    </ReactFlowProvider>
  )
}
