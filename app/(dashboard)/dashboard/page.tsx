import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getCases } from "@/lib/queries/cases"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NewCaseDialog } from "./new-case-dialog"

const statusLabels: Record<string, string> = {
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ARCHIVE: "Archivé",
}

const statusVariants: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  EN_COURS: "default",
  TERMINE: "secondary",
  ARCHIVE: "outline",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const cases = await getCases(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes Dossiers</h1>
          <p className="text-muted-foreground">
            Gérez vos dossiers et structurez vos arguments
          </p>
        </div>
        <NewCaseDialog />
      </div>

      {cases.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardHeader>
            <CardTitle className="text-lg">Aucun dossier</CardTitle>
            <CardDescription>
              Créez votre premier dossier pour commencer à structurer vos
              arguments.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <Card key={c.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{c.title}</CardTitle>
                  <Badge variant={statusVariants[c.status] ?? "default"}>
                    {statusLabels[c.status] ?? c.status}
                  </Badge>
                </div>
                {c.description && (
                  <CardDescription className="line-clamp-2">
                    {c.description}
                  </CardDescription>
                )}
                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                  {c.type && <span>{c.type}</span>}
                  <span>
                    {new Date(c.updatedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
