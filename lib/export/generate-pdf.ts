import jsPDF from "jspdf"
import {
  buildArgumentTree,
  getTypeLabel,
  type ArgumentForExport,
  type ArgumentTreeNode,
} from "./format-arguments"

// Replace problematic Unicode characters that jsPDF built-in fonts can't handle
function sanitize(text: string): string {
  return text
    .replace(/\u2026/g, "...")  // ellipsis
    .replace(/\u2018|\u2019/g, "'")  // smart quotes
    .replace(/\u201C|\u201D/g, '"')  // smart double quotes
    .replace(/\u2014/g, " - ")  // em dash
    .replace(/\u2013/g, "-")  // en dash
}

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

const STATUS_LABELS: Record<string, string> = {
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ARCHIVE: "Archivé",
}

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 20
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const LINE_HEIGHT = 6
const FOOTER_HEIGHT = 15

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} / ${pageCount}`,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 8,
      { align: "right" },
    )
    doc.text("Généré par ARGUMINDS", MARGIN, PAGE_HEIGHT - 8)
  }
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - FOOTER_HEIGHT - MARGIN) {
    doc.addPage()
    return MARGIN
  }
  return y
}

function renderArgumentNode(
  doc: jsPDF,
  node: ArgumentTreeNode,
  y: number,
  depth: number,
  counter: string,
): number {
  const indent = MARGIN + depth * 8
  const availWidth = CONTENT_WIDTH - depth * 8

  y = checkPageBreak(doc, y, 20)

  // Type badge + title
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(50)
  const header = sanitize(`${counter} [${getTypeLabel(node.type)}] ${node.title}`)
  const headerLines = doc.splitTextToSize(header, availWidth)
  doc.text(headerLines, indent, y)
  y += headerLines.length * LINE_HEIGHT

  // Content
  if (node.content) {
    y = checkPageBreak(doc, y, 10)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(80)
    const contentLines = doc.splitTextToSize(sanitize(node.content), availWidth - 4)
    doc.text(contentLines, indent + 4, y)
    y += contentLines.length * 5
  }

  // Sources
  if (node.sources.length > 0) {
    y = checkPageBreak(doc, y, 8)
    doc.setFontSize(8)
    doc.setTextColor(100)
    const sourceNames = node.sources.map((s) => s.title).join(", ")
    const srcText = sanitize(`Sources : ${sourceNames}`)
    const srcLines = doc.splitTextToSize(srcText, availWidth - 4)
    doc.text(srcLines, indent + 4, y)
    y += srcLines.length * 4 + 2
  }

  y += 4

  // Children
  for (let i = 0; i < node.children.length; i++) {
    y = renderArgumentNode(
      doc,
      node.children[i],
      y,
      depth + 1,
      `${counter}.${i + 1}`,
    )
  }

  return y
}

export async function generatePDF(
  caseData: CaseDataForPDF,
  args: ArgumentForExport[],
  sources: SourceForPDF[],
  graphCanvas: HTMLCanvasElement | null,
): Promise<Blob> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  let y = MARGIN

  // ── Header ──
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(55, 48, 163) // indigo
  doc.text("ARGUMINDS", MARGIN, y)
  y += 10

  doc.setFontSize(14)
  doc.setTextColor(30)
  const titleLines = doc.splitTextToSize(sanitize(caseData.title), CONTENT_WIDTH)
  doc.text(titleLines, MARGIN, y)
  y += titleLines.length * 7

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(120)
  doc.text(
    `Exporté le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
    MARGIN,
    y,
  )
  y += 8

  // Separator line
  doc.setDrawColor(200)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += 8

  // ── Informations ──
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30)
  doc.text("INFORMATIONS", MARGIN, y)
  y += 7

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60)

  const infoParts: string[] = []
  if (caseData.type) infoParts.push(`Type : ${caseData.type}`)
  infoParts.push(`Statut : ${STATUS_LABELS[caseData.status] ?? caseData.status}`)
  doc.text(infoParts.join("  |  "), MARGIN, y)
  y += 6

  if (caseData.description) {
    const descLines = doc.splitTextToSize(sanitize(caseData.description), CONTENT_WIDTH)
    doc.text(descLines, MARGIN, y)
    y += descLines.length * 5 + 4
  }

  y += 4

  // ── Graph image ──
  if (graphCanvas) {
    y = checkPageBreak(doc, y, 30)

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(30)
    doc.text("GRAPHE DES ARGUMENTS", MARGIN, y)
    y += 8

    const imgData = graphCanvas.toDataURL("image/png")
    const canvasRatio = graphCanvas.width / graphCanvas.height
    let imgWidth = CONTENT_WIDTH
    let imgHeight = imgWidth / canvasRatio

    // Cap image height
    const maxImgHeight = 120
    if (imgHeight > maxImgHeight) {
      imgHeight = maxImgHeight
      imgWidth = imgHeight * canvasRatio
    }

    y = checkPageBreak(doc, y, imgHeight + 5)
    doc.addImage(imgData, "PNG", MARGIN, y, imgWidth, imgHeight)
    y += imgHeight + 8
  }

  // ── Arguments ──
  y = checkPageBreak(doc, y, 20)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30)
  doc.text("ARGUMENTS", MARGIN, y)
  y += 8

  if (args.length === 0) {
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120)
    doc.text("Aucun argument.", MARGIN, y)
    y += 8
  } else {
    const tree = buildArgumentTree(args)
    for (let i = 0; i < tree.length; i++) {
      y = renderArgumentNode(doc, tree[i], y, 0, `${i + 1}`)
    }
  }

  // ── Sources ──
  y = checkPageBreak(doc, y, 20)
  y += 4
  doc.setDrawColor(200)
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += 8

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30)
  doc.text("SOURCES", MARGIN, y)
  y += 8

  if (sources.length === 0) {
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120)
    doc.text("Aucune source.", MARGIN, y)
  } else {
    for (const source of sources) {
      y = checkPageBreak(doc, y, 16)

      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(50)
      doc.text(sanitize(`• ${source.title}`), MARGIN + 2, y)
      y += 5

      if (source.url) {
        doc.setFont("helvetica", "normal")
        doc.setTextColor(55, 48, 163)
        const urlLines = doc.splitTextToSize(sanitize(source.url), CONTENT_WIDTH - 6)
        doc.text(urlLines, MARGIN + 6, y)
        y += urlLines.length * 4 + 1
      }

      if (source.content) {
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100)
        const excerpt =
          source.content.length > 200
            ? source.content.slice(0, 200) + "..."
            : source.content
        const excerptLines = doc.splitTextToSize(sanitize(`"${excerpt}"`), CONTENT_WIDTH - 6)
        doc.text(excerptLines, MARGIN + 6, y)
        y += excerptLines.length * 4 + 2
      }

      y += 3
    }
  }

  // ── Footer ──
  addFooter(doc)

  return doc.output("blob")
}
