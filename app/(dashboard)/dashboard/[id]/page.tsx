import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/auth"
import { getCase } from "@/lib/queries/cases"
import { getArgumentsForCase } from "@/lib/queries/arguments"
import { getSourcesForCase } from "@/lib/queries/sources"
import { STATUS_LABELS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArgumentGraph } from "@/components/graph/argument-graph"
import { SourceList } from "@/components/sources/source-list"
import { ExportButtons } from "@/components/export/export-buttons"
import { CaseActions } from "./case-actions"

const statusVariants: Record<string, "default" | "secondary" | "outline"> = {
  EN_COURS: "default",
  TERMINE: "secondary",
  ARCHIVE: "outline",
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params
  const caseData = await getCase(id, session.user.id)
  if (!caseData) notFound()

  const args = await getArgumentsForCase(id, session.user.id)
  const sources = await getSourcesForCase(id, session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{caseData.title}</h1>
            <Badge variant={statusVariants[caseData.status] ?? "default"}>
              {STATUS_LABELS[caseData.status] ?? caseData.status}
            </Badge>
          </div>
          {caseData.description && (
            <p className="mt-1 text-muted-foreground">
              {caseData.description}
            </p>
          )}
        </div>
        <ExportButtons
          caseData={{
            title: caseData.title,
            description: caseData.description,
            type: caseData.type,
            status: caseData.status,
          }}
          arguments={args.map((a) => ({
            id: a.id,
            title: a.title,
            content: a.content,
            type: a.type,
            parentId: a.parentId,
            sources: a.sources,
          }))}
          sources={sources.map((s) => ({
            title: s.title,
            url: s.url,
            content: s.content,
          }))}
          caseId={id}
        />
        <CaseActions
          caseData={{
            id: caseData.id,
            title: caseData.title,
            description: caseData.description,
            type: caseData.type,
            status: caseData.status,
          }}
          userRole={session.user.role}
        />
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        {caseData.type && <span>Type : {caseData.type}</span>}
        <span>
          Créé le {new Date(caseData.createdAt).toLocaleDateString("fr-FR")}
        </span>
        <span>
          Modifié le {new Date(caseData.updatedAt).toLocaleDateString("fr-FR")}
        </span>
      </div>

      <Separator />

      <ArgumentGraph
        arguments={args}
        caseId={id}
        allSources={sources.map((s) => ({ id: s.id, title: s.title, url: s.url }))}
      />

      <Separator />

      <SourceList sources={sources} caseId={id} />
    </div>
  )
}
