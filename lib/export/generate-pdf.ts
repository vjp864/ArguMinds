import { pdf } from "@react-pdf/renderer"
import { PdfDocument } from "./pdf-template"
import type { ArgumentForExport } from "./format-arguments"

type CaseDataForPDF = {
  title: string
  description: string | null
  type: string | null
  status: string
}

type SourceForPDF = {
  title: string
  url: string | null
  content: string | null
}

export async function generatePDF(
  caseData: CaseDataForPDF,
  args: ArgumentForExport[],
  sources: SourceForPDF[],
  _graphCanvas: HTMLCanvasElement | null,
): Promise<Blob> {
  const blob = await pdf(
    PdfDocument({ caseData, arguments: args, sources }),
  ).toBlob()
  return blob
}
