"use client"

import { useState } from "react"
import { FileText, FileDown, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { ArgumentForExport } from "@/lib/export/format-arguments"

type CaseDataForExport = {
  title: string
  description: string | null
  type: string | null
  status: string
}

type SourceForExport = {
  title: string
  url: string | null
  content: string | null
}

function sanitizeFilename(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ ]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 50)
}

export function ExportButtons({
  caseData,
  arguments: args,
  sources,
  caseId,
}: {
  caseData: CaseDataForExport
  arguments: ArgumentForExport[]
  sources: SourceForExport[]
  caseId: string
}) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [docxLoading, setDocxLoading] = useState(false)

  const handleExportPDF = async () => {
    setPdfLoading(true)
    try {
      // Dynamic imports — these heavy libs are only loaded on click
      const [{ generatePDF }, { default: html2canvas }, { saveAs }] =
        await Promise.all([
          import("@/lib/export/generate-pdf"),
          import("html2canvas"),
          import("file-saver"),
        ])

      // Try to capture the React Flow graph (may fail on complex SVG)
      let graphCanvas: HTMLCanvasElement | null = null
      const graphEl = document.querySelector(".react-flow") as HTMLElement | null
      if (graphEl) {
        try {
          graphCanvas = await html2canvas(graphEl, {
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
            foreignObjectRendering: false,
          })
        } catch {
          console.warn("Graph capture failed, generating PDF without graph image")
        }
      }

      const blob = await generatePDF(caseData, args, sources, graphCanvas)
      saveAs(blob, `ARGUMINDS_${sanitizeFilename(caseData.title)}.pdf`)
      toast.success("PDF exporté avec succès")
    } catch (err) {
      console.error("PDF export error:", err)
      toast.error("Erreur lors de l'export PDF")
    } finally {
      setPdfLoading(false)
    }
  }

  const handleExportDocx = async () => {
    setDocxLoading(true)
    try {
      const response = await fetch(`/api/export/docx/${caseId}`)
      if (!response.ok) throw new Error("Erreur serveur")

      const blob = await response.blob()
      const { saveAs } = await import("file-saver")
      saveAs(blob, `ARGUMINDS_${sanitizeFilename(caseData.title)}.docx`)
      toast.success("Document Word exporté avec succès")
    } catch {
      toast.error("Erreur lors de l'export Word")
    } finally {
      setDocxLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        disabled={pdfLoading}
      >
        {pdfLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="mr-2 h-4 w-4" />
        )}
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportDocx}
        disabled={docxLoading}
      >
        {docxLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        Word
      </Button>
    </div>
  )
}
