export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">ARGUMINDS</h1>
          <p className="text-sm text-muted-foreground">
            Plateforme d&apos;Intelligence Argumentative
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
