import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getUser } from "@/lib/queries/users"
import { ROLE_LABELS } from "@/lib/constants"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EditProfileForm } from "./edit-profile-form"
import { ChangePasswordDialog } from "./change-password-dialog"
import { DeleteAccountDialog } from "./delete-account-dialog"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await getUser(session.user.id)
  if (!user) redirect("/login")

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  const memberSince = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(user.createdAt)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Carte profil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {ROLE_LABELS[user.role] ?? user.role}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Membre depuis {memberSince}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{user._count.cases}</p>
              <p className="text-xs text-muted-foreground">
                Dossier{user._count.cases !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modifier le profil */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Modifiez votre nom et votre adresse email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm
            defaultName={user.name ?? ""}
            defaultEmail={user.email}
          />
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Gérez votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordDialog />
        </CardContent>
      </Card>

      {/* Zone dangereuse */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription>
            Actions irréversibles sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  )
}
