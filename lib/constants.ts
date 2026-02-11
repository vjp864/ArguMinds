export const CASE_TYPES_AVOCAT = [
  "Civil",
  "Pénal",
  "Commercial",
  "Administratif",
  "Autre",
]

export const CASE_TYPES_DEBATTEUR = [
  "Débat",
  "Motion",
  "Résolution",
  "Autre",
]

export const STATUS_LABELS: Record<string, string> = {
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ARCHIVE: "Archivé",
}

export const STATUS_OPTIONS = ["EN_COURS", "TERMINE", "ARCHIVE"] as const

export const ROLE_LABELS: Record<string, string> = {
  AVOCAT: "Avocat",
  DEBATTEUR: "Débatteur",
}

export function getCaseTypesForRole(role: string) {
  return role === "DEBATTEUR" ? CASE_TYPES_DEBATTEUR : CASE_TYPES_AVOCAT
}
