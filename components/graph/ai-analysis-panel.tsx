"use client"

import { useState } from "react"
import {
  Sparkles,
  Lightbulb,
  RefreshCw,
  Loader2,
  Check,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { updateArgument } from "@/lib/actions/arguments"

type AnalysisResult = {
  weight: number
  reasoning: string
  strengths: string[]
  weaknesses: string[]
}

type SuggestResult = {
  suggestions: string[]
}

type ReformulateResult = {
  reformulated: string
}

async function callAi(
  argumentId: string,
  caseId: string,
  action: "analyze" | "suggest" | "reformulate",
) {
  const res = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ argumentId, caseId, action }),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Erreur IA")
  }
  return json.data
}

function WeightBar({ weight }: { weight: number }) {
  const color =
    weight >= 75
      ? "bg-accent"
      : weight >= 50
        ? "bg-primary"
        : weight >= 25
          ? "bg-yellow-500"
          : "bg-destructive"

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Score de solidité</span>
        <span className="font-bold">{weight}/100</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted">
        <div
          className={`h-2.5 rounded-full transition-all ${color}`}
          style={{ width: `${weight}%` }}
        />
      </div>
    </div>
  )
}

export function AiAnalysisPanel({
  argumentId,
  caseId,
  argumentTitle,
  argumentType,
  argumentParentId,
}: {
  argumentId: string
  caseId: string
  argumentTitle: string
  argumentType: string
  argumentParentId: string | null
}) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [suggestions, setSuggestions] = useState<SuggestResult | null>(null)
  const [reformulation, setReformulation] = useState<ReformulateResult | null>(
    null,
  )
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoadingAction("analyze")
    try {
      const data = await callAi(argumentId, caseId, "analyze")
      setAnalysis(data)
    } catch {
      toast.error("Erreur lors de l'analyse")
    } finally {
      setLoadingAction(null)
    }
  }

  const handleSuggest = async () => {
    setLoadingAction("suggest")
    try {
      const data = await callAi(argumentId, caseId, "suggest")
      setSuggestions(data)
    } catch {
      toast.error("Erreur lors des suggestions")
    } finally {
      setLoadingAction(null)
    }
  }

  const handleReformulate = async () => {
    setLoadingAction("reformulate")
    try {
      const data = await callAi(argumentId, caseId, "reformulate")
      setReformulation(data)
    } catch {
      toast.error("Erreur lors de la reformulation")
    } finally {
      setLoadingAction(null)
    }
  }

  const handleApplyReformulation = async () => {
    if (!reformulation) return
    setLoadingAction("apply")
    try {
      const formData = new FormData()
      formData.set("title", argumentTitle)
      formData.set("content", reformulation.reformulated)
      formData.set("type", argumentType)
      formData.set("parentId", argumentParentId ?? "")
      const result = await updateArgument(argumentId, caseId, {}, formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Reformulation appliquée")
        setReformulation(null)
      }
    } catch {
      toast.error("Erreur lors de l'application")
    } finally {
      setLoadingAction(null)
    }
  }

  const isLoading = loadingAction !== null

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {loadingAction === "analyze" ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-3 w-3" />
          )}
          Analyser
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={handleSuggest}
          disabled={isLoading}
        >
          {loadingAction === "suggest" ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <Lightbulb className="mr-1.5 h-3 w-3" />
          )}
          Suggestions
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={handleReformulate}
          disabled={isLoading}
        >
          {loadingAction === "reformulate" ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="mr-1.5 h-3 w-3" />
          )}
          Reformuler
        </Button>
      </div>

      {/* Analysis results */}
      {analysis && (
        <div className="space-y-3 rounded-md border bg-muted/30 p-3">
          <WeightBar weight={analysis.weight} />

          <p className="text-xs leading-relaxed text-muted-foreground">
            {analysis.reasoning}
          </p>

          {analysis.strengths.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-accent">
                <ThumbsUp className="h-3 w-3" />
                Points forts
              </p>
              <ul className="space-y-0.5">
                {analysis.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.weaknesses.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-destructive">
                <AlertTriangle className="h-3 w-3" />
                Faiblesses
              </p>
              <ul className="space-y-0.5">
                {analysis.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-destructive/60" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Suggestions results */}
      {suggestions && (
        <div className="space-y-2 rounded-md border bg-muted/30 p-3">
          <p className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Lightbulb className="h-3 w-3" />
            Suggestions d&apos;amélioration
          </p>
          <ol className="list-inside list-decimal space-y-2">
            {suggestions.suggestions.map((s, i) => (
              <li
                key={i}
                className="text-xs leading-relaxed text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Reformulation results */}
      {reformulation && (
        <div className="space-y-2 rounded-md border bg-muted/30 p-3">
          <p className="flex items-center gap-1 text-xs font-semibold text-primary">
            <RefreshCw className="h-3 w-3" />
            Reformulation proposée
          </p>
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
            {reformulation.reformulated}
          </p>
          <Separator />
          <Button
            size="sm"
            className="h-7 w-full text-xs"
            onClick={handleApplyReformulation}
            disabled={loadingAction === "apply"}
          >
            {loadingAction === "apply" ? (
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            ) : (
              <Check className="mr-1.5 h-3 w-3" />
            )}
            Appliquer cette reformulation
          </Button>
        </div>
      )}
    </div>
  )
}
