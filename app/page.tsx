import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  GitBranch,
  BookOpen,
  FileDown,
} from "lucide-react"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function Home() {
  const session = await auth()
  if (session?.user) redirect("/dashboard")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight text-primary">
            ARGUMINDS
          </span>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="mb-4 text-sm font-medium tracking-widest uppercase text-accent">
          Plateforme d&apos;Intelligence Argumentative
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Structurez vos arguments{" "}
          <span className="text-primary">avec clarté</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Construisez des raisonnements solides, visualisez-les sous forme de
          graphe et centralisez vos sources juridiques — le tout en un seul
          outil.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">
              Commencer gratuitement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* ── Features ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24">
        <h2 className="mb-4 text-center text-sm font-medium tracking-widest uppercase text-accent">
          Fonctionnalités
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Tout ce qu&apos;il faut pour argumenter efficacement
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: GitBranch,
              title: "Graphe visuel",
              description:
                "Visualisez la hiérarchie de vos arguments : supports, objections et réfutations, connectés en un graphe interactif.",
            },
            {
              icon: BookOpen,
              title: "Sources centralisées",
              description:
                "Liez vos sources juridiques directement à chaque argument. Plus de documents éparpillés.",
            },
            {
              icon: FileDown,
              title: "Export professionnel",
              description:
                "Exportez vos dossiers en PDF ou Word en un clic. Prêts à être partagés ou imprimés.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-muted/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── How it works ── */}
      <section className="mx-auto w-full max-w-4xl px-4 py-24">
        <h2 className="mb-4 text-center text-sm font-medium tracking-widest uppercase text-accent">
          Comment ça marche
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Trois étapes, c&apos;est tout
        </p>

        <div className="grid gap-12 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Créez un dossier",
              description:
                "Définissez votre affaire ou votre débat en quelques secondes.",
            },
            {
              step: "2",
              title: "Argumentez",
              description:
                "Ajoutez vos arguments, liez-les entre eux et attachez vos sources.",
            },
            {
              step: "3",
              title: "Exportez",
              description:
                "Générez un PDF ou un document Word prêt à l'emploi.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── CTA final ── */}
      <section className="flex flex-col items-center px-4 py-24 text-center">
        <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Prêt à structurer vos arguments ?
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          Rejoignez ARGUMINDS et donnez de la force à vos raisonnements.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/register">
            Créer un compte gratuitement
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">ARGUMINDS</span>
          <span>
            Plateforme d&apos;Intelligence Argumentative &mdash;{" "}
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  )
}
