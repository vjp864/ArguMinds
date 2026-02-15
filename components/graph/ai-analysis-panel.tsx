"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Sparkles,
  Lightbulb,
  RefreshCw,
  Loader2,
  Check,
  AlertTriangle,
  ThumbsUp,
  History,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { updateArgument } from "@/lib/actions/arguments"
import { deleteAiAnalysis } from "@/lib/actions/ai-analyses"
import { RichTextDisplay } from "@/components/ui/rich-text-display"

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

type HistoryEntry = {
  id: string
  argumentId: string
  action: string
  result: AnalysisResult | SuggestResult | ReformulateResult
  createdAt: string
}

const ACTION_LABELS: Record<string, string> = {
  analyze: "Analyse",
  suggest: "Suggestions",
  reformulate: "Reformulation",
}

const ACTION_COLORS: Record<string, string> = {
  analyze: "bg-primary/10 text-primary",
  suggest: "bg-yellow-500/10 text-yellow-600",
  reformulate: "bg-accent/10 text-accent",
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

function ScoreEvolution({ entries }: { entries: HistoryEntry[] }) {
  const analyzeEntries = entries
    .filter((e) => e.action === "analyze")
    .reverse() // oldest first
  if (analyzeEntries.length < 2) return null

  const first = (analyzeEntries[0].result as AnalysisResult).weight
  const last = (analyzeEntries[analyzeEntries.length - 1].result as AnalysisResult).weight
  const trend = last - first

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
      <span className="text-xs font-medium text-muted-foreground">
        Evolution du score :
      </span>
      <div className="flex items-center gap-1">
        {analyzeEntries.map((e, i) => (
          <span key={e.id} className="text-xs font-mono">
            {(e.result as AnalysisResult).weight}
            {i < analyzeEntries.length - 1 && (
              <span className="text-muted-foreground"> → </span>
            )}
          </span>
        ))}
      </div>
      {trend > 0 ? (
        <TrendingUp className="h-3.5 w-3.5 text-accent" />
      ) : trend < 0 ? (
        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
      ) : null}
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
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch(
        `/api/ai/history/${argumentId}?caseId=${caseId}`,
      )
      const json = await res.json()
      if (json.success) {
        setHistory(json.data)
      }
    } catch {
      // Silently fail — history is not critical
    } finally {
      setHistoryLoading(false)
    }
  }, [argumentId, caseId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleAnalyze = async () => {
    setLoadingAction("analyze")
    try {
      const data = await callAi(argumentId, caseId, "analyze")
      setAnalysis(data)
      fetchHistory()
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
      fetchHistory()
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
      fetchHistory()
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

  const handleDeleteAnalysis = async (id: string) => {
    const result = await deleteAiAnalysis(id, caseId)
    if (result?.success) {
      setHistory((prev) => prev.filter((h) => h.id !== id))
      toast.success("Analyse supprimée")
    } else {
      toast.error(result?.error ?? "Erreur")
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

      {/* Tab toggle */}
      <div className="flex gap-1 rounded-md border bg-muted/50 p-1">
        <button
          className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            !showHistory
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setShowHistory(false)}
        >
          Résultats
        </button>
        <button
          className={`flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            showHistory
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setShowHistory(true)}
        >
          <History className="h-3 w-3" />
          Historique
          {history.length > 0 && (
            <span className="rounded-full bg-primary/10 px-1.5 text-[10px] text-primary">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* Results tab */}
      {!showHistory && (
        <>
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
              <RichTextDisplay
                content={reformulation.reformulated}
                className="text-xs text-muted-foreground"
              />
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

          {!analysis && !suggestions && !reformulation && (
            <p className="text-center text-xs text-muted-foreground">
              Cliquez sur un bouton ci-dessus pour lancer une analyse IA.
            </p>
          )}
        </>
      )}

      {/* History tab */}
      {showHistory && (
        <div className="space-y-3">
          {historyLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground">
              Aucun historique d&apos;analyse.
            </p>
          ) : (
            <>
              <ScoreEvolution entries={history} />

              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="space-y-2 rounded-md border bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`text-[10px] ${ACTION_COLORS[entry.action] ?? ""}`}
                    >
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button
                        className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteAnalysis(entry.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Render based on action type */}
                  {entry.action === "analyze" && (
                    <div className="space-y-1">
                      <WeightBar
                        weight={(entry.result as AnalysisResult).weight}
                      />
                      <p className="text-xs text-muted-foreground">
                        {(entry.result as AnalysisResult).reasoning}
                      </p>
                    </div>
                  )}

                  {entry.action === "suggest" && (
                    <ol className="list-inside list-decimal space-y-1">
                      {(entry.result as SuggestResult).suggestions.map(
                        (s, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground"
                          >
                            {s}
                          </li>
                        ),
                      )}
                    </ol>
                  )}

                  {entry.action === "reformulate" && (
                    <RichTextDisplay
                      content={
                        (entry.result as ReformulateResult).reformulated
                      }
                      className="text-xs text-muted-foreground"
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
