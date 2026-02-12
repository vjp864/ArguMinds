import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { callGroq } from "@/lib/ai/groq"

const SYSTEM_PROMPT = `Tu es un expert en argumentation juridique, en rhétorique et en logique formelle.
Tu analyses des arguments dans le contexte de dossiers juridiques ou de débats structurés.
Tu réponds TOUJOURS en JSON valide, sans texte avant ou après le JSON.
Tu réponds en français.`

type RequestBody = {
  argumentId: string
  caseId: string
  action: "analyze" | "suggest" | "reformulate"
}

function buildArgumentContext(
  arg: { title: string; content: string; type: string },
  sources: { title: string; url: string | null }[],
  parent: { title: string; content: string } | null,
): string {
  let context = `Titre : ${arg.title}\nType : ${arg.type}\nContenu : ${arg.content}`
  if (sources.length > 0) {
    context += `\nSources liées : ${sources.map((s) => s.title + (s.url ? ` (${s.url})` : "")).join(", ")}`
  }
  if (parent) {
    context += `\nArgument parent : ${parent.title} — ${parent.content}`
  }
  return context
}

function getAnalyzePrompt(context: string): string {
  return `Analyse l'argument suivant et évalue sa solidité.

${context}

Réponds en JSON avec ce format exact :
{
  "weight": <number 0 à 100>,
  "reasoning": "<explication concise de l'évaluation>",
  "strengths": ["<point fort 1>", "<point fort 2>"],
  "weaknesses": ["<faiblesse 1>", "<faiblesse 2>"]
}`
}

function getSuggestPrompt(context: string): string {
  return `Propose des améliorations concrètes pour renforcer l'argument suivant.

${context}

Réponds en JSON avec ce format exact :
{
  "suggestions": [
    "<suggestion détaillée 1>",
    "<suggestion détaillée 2>",
    "<suggestion détaillée 3>"
  ]
}`
}

function getReformulatePrompt(context: string): string {
  return `Reformule l'argument suivant pour le rendre plus percutant, structuré et convaincant. Garde le même sens et la même intention.

${context}

Réponds en JSON avec ce format exact :
{
  "reformulated": "<texte reformulé complet>"
}`
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Clé API Groq non configurée" },
      { status: 500 },
    )
  }

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 })
  }

  const { argumentId, caseId, action } = body

  if (!argumentId || !caseId || !action) {
    return NextResponse.json(
      { error: "argumentId, caseId et action sont requis" },
      { status: 400 },
    )
  }

  if (!["analyze", "suggest", "reformulate"].includes(action)) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 })
  }

  // Verify case ownership
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  })
  if (!caseRecord) {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 })
  }

  // Fetch argument with sources and parent
  const argument = await prisma.argument.findUnique({
    where: { id: argumentId, caseId },
    include: {
      sources: { select: { title: true, url: true } },
      parent: { select: { title: true, content: true } },
    },
  })
  if (!argument) {
    return NextResponse.json(
      { error: "Argument introuvable" },
      { status: 404 },
    )
  }

  const context = buildArgumentContext(
    { title: argument.title, content: argument.content, type: argument.type },
    argument.sources,
    argument.parent,
  )

  let prompt: string
  switch (action) {
    case "analyze":
      prompt = getAnalyzePrompt(context)
      break
    case "suggest":
      prompt = getSuggestPrompt(context)
      break
    case "reformulate":
      prompt = getReformulatePrompt(context)
      break
  }

  try {
    const rawResponse = await callGroq(SYSTEM_PROMPT, prompt)

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Réponse IA invalide" },
        { status: 500 },
      )
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json({ success: true, data: parsed })
  } catch (err) {
    console.error("Groq API error:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'analyse IA" },
      { status: 500 },
    )
  }
}
