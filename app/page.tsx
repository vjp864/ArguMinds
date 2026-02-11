import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          ARGUMINDS
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Structurez vos raisonnements, visualisez vos arguments et centralisez
          vos sources juridiques.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/login">Se connecter</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/register">Créer un compte</Link>
        </Button>
      </div>
    </div>
  )
}
