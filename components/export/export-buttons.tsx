"use client"

import { useState } from "react"
import { FileText, FileDown, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { saveAs } from "file-saver"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { generatePDF } from "@/lib/export/generate-pdf"
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
      // Capture the React Flow graph
      let graphCanvas: HTMLCanvasElement | null = null
      const graphEl = document.querySelector(".react-flow") as HTMLElement | null
      if (graphEl) {
        graphCanvas = await html2canvas(graphEl, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
        })
      }

      const blob = await generatePDF(caseData, args, sources, graphCanvas)
      const filename = `ARGUMINDS_${caseData.title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ ]/g, "").replace(/\s+/g, "_").slice(0, 50)}.pdf`
      saveAs(blob, filename)
      toast.success("PDF exporté avec succès")
    } catch {
      toast.error("Erreur lors de l'export PDF")
    } finally {
      setPdfLoading(false)
    }
  }

  const handleExportDocx = async () => {
    setDocxLoading(true)
    try {
      const response = await fetch(`/api/export/docx/${caseId}`)
      if (!response.ok) {
        throw new Error("Erreur serveur")
      }
      const blob = await response.blob()
      const filename = `ARGUMINDS_${caseData.title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ ]/g, "").replace(/\s+/g, "_").slice(0, 50)}.docx`
      saveAs(blob, filename)
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
