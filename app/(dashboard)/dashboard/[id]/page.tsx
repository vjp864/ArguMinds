import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/auth"
import { getCase } from "@/lib/queries/cases"
import { getArgumentsForCase } from "@/lib/queries/arguments"
import { STATUS_LABELS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArgumentGraph } from "@/components/graph/argument-graph"
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

      <ArgumentGraph arguments={args} caseId={id} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {caseData.sources.length === 0
              ? "La gestion des sources sera disponible dans la Phase 4."
              : `${caseData.sources.length} source(s)`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
