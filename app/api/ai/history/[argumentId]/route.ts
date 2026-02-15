import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ argumentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { argumentId } = await params
  const url = new URL(request.url)
  const caseId = url.searchParams.get("caseId")
  if (!caseId) {
    return NextResponse.json({ error: "caseId requis" }, { status: 400 })
  }

  // Verify case ownership
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 })
  }

  // Verify argument belongs to case
  const argument = await prisma.argument.findUnique({
    where: { id: argumentId, caseId },
    select: { id: true },
  })
  if (!argument) {
    return NextResponse.json(
      { error: "Argument introuvable" },
      { status: 404 },
    )
  }

  const analyses = await prisma.aiAnalysis.findMany({
    where: { argumentId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json({ success: true, data: analyses })
}
