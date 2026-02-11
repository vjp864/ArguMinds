import { redirect } from "next/navigation"
import { Suspense } from "react"
import { auth } from "@/auth"
import { getCases } from "@/lib/queries/cases"
import { getCaseTypesForRole } from "@/lib/constants"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NewCaseDialog } from "./new-case-dialog"
import { CaseCard } from "./case-card"
import { CaseFilters } from "./case-filters"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const params = await searchParams
  const cases = await getCases({
    userId: session.user.id,
    search: params.search,
    status: params.status,
    type: params.type,
    sort: params.sort,
  })

  const caseTypes = getCaseTypesForRole(session.user.role)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes Dossiers</h1>
          <p className="text-muted-foreground">
            {cases.length} dossier{cases.length !== 1 ? "s" : ""}
          </p>
        </div>
        <NewCaseDialog userRole={session.user.role} />
      </div>

      <Suspense>
        <CaseFilters caseTypes={caseTypes} />
      </Suspense>

      {cases.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardHeader>
            <CardTitle className="text-lg">Aucun dossier</CardTitle>
            <CardDescription>
              {params.search || params.status || params.type
                ? "Aucun dossier ne correspond à vos filtres."
                : "Créez votre premier dossier pour commencer à structurer vos arguments."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              caseData={c}
              userRole={session.user.role}
            />
          ))}
        </div>
      )}
    </div>
  )
}
