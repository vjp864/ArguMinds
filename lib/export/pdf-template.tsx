import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import {
  buildArgumentTree,
  getTypeLabel,
  type ArgumentForExport,
  type ArgumentTreeNode,
} from "./format-arguments"

const TYPE_COLORS: Record<string, string> = {
  PRINCIPAL: "#4338CA",
  SUPPORT: "#16A34A",
  OBJECTION: "#DC2626",
  REFUTATION: "#6B7280",
}

const STATUS_LABELS: Record<string, string> = {
  EN_COURS: "En cours",
  TERMINE: "Termine",
  ARCHIVE: "Archive",
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  // Cover page
  coverPage: {
    padding: 40,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  coverBrand: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#4338CA",
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 60,
  },
  coverTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 20,
  },
  coverMeta: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
  },
  coverDate: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 40,
  },
  coverStats: {
    flexDirection: "row",
    gap: 24,
    marginTop: 30,
  },
  coverStat: {
    alignItems: "center",
  },
  coverStatNumber: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#4338CA",
  },
  coverStatLabel: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 2,
  },
  // Section headers
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#4338CA",
    marginBottom: 16,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#4338CA",
  },
  // Arguments
  argumentCard: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#FAFAFA",
    borderLeftWidth: 3,
  },
  argumentTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  argumentType: {
    fontSize: 8,
    color: "#ffffff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  argumentContent: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#374151",
  },
  argumentSources: {
    fontSize: 8,
    color: "#6B7280",
    marginTop: 6,
    fontStyle: "italic",
  },
  childIndent: {
    marginLeft: 16,
  },
  // Sources table
  sourceRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 6,
  },
  sourceHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#4338CA",
    paddingBottom: 6,
    marginBottom: 4,
  },
  sourceNum: {
    width: "8%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  sourceTitle: {
    width: "35%",
    fontSize: 9,
  },
  sourceUrl: {
    width: "35%",
    fontSize: 8,
    color: "#4338CA",
  },
  sourceContent: {
    width: "22%",
    fontSize: 8,
    color: "#6B7280",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9CA3AF",
  },
  // TOC
  tocEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tocTitle: {
    fontSize: 10,
    flex: 1,
  },
  tocType: {
    fontSize: 8,
    color: "#6B7280",
    marginLeft: 8,
  },
})

type CaseData = {
  title: string
  description: string | null
  type: string | null
  status: string
}

type SourceData = {
  title: string
  url: string | null
  content: string | null
}

function ArgumentCardComponent({
  node,
  depth = 0,
}: {
  node: ArgumentTreeNode
  depth?: number
}) {
  const borderColor = TYPE_COLORS[node.type] ?? "#6B7280"

  return (
    <View style={depth > 0 ? styles.childIndent : undefined}>
      <View style={[styles.argumentCard, { borderLeftColor: borderColor }]}>
        <View
          style={[styles.argumentType, { backgroundColor: borderColor }]}
        >
          <Text>{getTypeLabel(node.type)}</Text>
        </View>
        <Text style={styles.argumentTitle}>{node.title}</Text>
        <Text style={styles.argumentContent}>{node.content}</Text>
        {node.sources.length > 0 && (
          <Text style={styles.argumentSources}>
            Sources : {node.sources.map((s) => s.title).join(", ")}
          </Text>
        )}
      </View>
      {node.children.map((child) => (
        <ArgumentCardComponent
          key={child.id}
          node={child}
          depth={depth + 1}
        />
      ))}
    </View>
  )
}

export function PdfDocument({
  caseData,
  arguments: args,
  sources,
}: {
  caseData: CaseData
  arguments: ArgumentForExport[]
  sources: SourceData[]
}) {
  const tree = buildArgumentTree(args)
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Document>
      {/* Cover page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverBrand}>ARGUMINDS</Text>
        <Text style={styles.coverSubtitle}>
          Plateforme d&apos;Intelligence Argumentative
        </Text>

        <Text style={styles.coverTitle}>{caseData.title}</Text>

        {caseData.type && (
          <Text style={styles.coverMeta}>Type : {caseData.type}</Text>
        )}
        <Text style={styles.coverMeta}>
          Statut : {STATUS_LABELS[caseData.status] ?? caseData.status}
        </Text>

        {caseData.description && (
          <Text style={[styles.coverMeta, { marginTop: 20, textAlign: "center", maxWidth: 400 }]}>
            {caseData.description}
          </Text>
        )}

        <View style={styles.coverStats}>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatNumber}>{args.length}</Text>
            <Text style={styles.coverStatLabel}>
              Argument{args.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.coverStat}>
            <Text style={styles.coverStatNumber}>{sources.length}</Text>
            <Text style={styles.coverStatLabel}>
              Source{sources.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <Text style={styles.coverDate}>Exporte le {today}</Text>
      </Page>

      {/* Table of contents */}
      {args.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Table des matieres</Text>
          {args.map((arg, i) => (
            <View key={arg.id} style={styles.tocEntry}>
              <Text style={styles.tocTitle}>
                {i + 1}. {arg.title}
              </Text>
              <Text style={styles.tocType}>{getTypeLabel(arg.type)}</Text>
            </View>
          ))}
          <View style={styles.footer}>
            <Text>ARGUMINDS</Text>
          </View>
        </Page>
      )}

      {/* Arguments */}
      {tree.length > 0 && (
        <Page size="A4" style={styles.page} wrap>
          <Text style={styles.sectionTitle}>Arguments</Text>
          {tree.map((node) => (
            <ArgumentCardComponent key={node.id} node={node} />
          ))}
          <View style={styles.footer} fixed>
            <Text>ARGUMINDS</Text>
            <Text
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </Page>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <Page size="A4" style={styles.page} wrap>
          <Text style={styles.sectionTitle}>Sources</Text>
          <View style={styles.sourceHeader}>
            <Text style={[styles.sourceNum, { fontFamily: "Helvetica-Bold" }]}>
              #
            </Text>
            <Text
              style={[styles.sourceTitle, { fontFamily: "Helvetica-Bold" }]}
            >
              Titre
            </Text>
            <Text style={[styles.sourceUrl, { fontFamily: "Helvetica-Bold" }]}>
              URL
            </Text>
            <Text
              style={[styles.sourceContent, { fontFamily: "Helvetica-Bold" }]}
            >
              Extrait
            </Text>
          </View>
          {sources.map((source, i) => (
            <View key={i} style={styles.sourceRow} wrap={false}>
              <Text style={styles.sourceNum}>{i + 1}</Text>
              <Text style={styles.sourceTitle}>{source.title}</Text>
              <Text style={styles.sourceUrl}>{source.url ?? "-"}</Text>
              <Text style={styles.sourceContent}>
                {source.content
                  ? source.content.length > 80
                    ? source.content.slice(0, 80) + "..."
                    : source.content
                  : "-"}
              </Text>
            </View>
          ))}
          <View style={styles.footer} fixed>
            <Text>ARGUMINDS</Text>
            <Text
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </Page>
      )}
    </Document>
  )
}
