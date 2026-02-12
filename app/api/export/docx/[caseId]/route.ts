import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { auth } from "@/auth";
import { getCase } from "@/lib/queries/cases";
import { getArgumentsForCase } from "@/lib/queries/arguments";
import { getSourcesForCase } from "@/lib/queries/sources";
import {
  buildArgumentTree,
  getTypeLabel,
  type ArgumentTreeNode,
} from "@/lib/export/format-arguments";

const STATUS_LABELS: Record<string, string> = {
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ARCHIVE: "Archivé",
};

function renderArgumentParagraphs(
  node: ArgumentTreeNode,
  depth: number,
  counter: string,
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Title with type badge
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      indent: { left: depth * 400 },
      children: [
        new TextRun({
          text: `${counter} [${getTypeLabel(node.type)}] `,
          bold: true,
          size: 22,
          color: "4338CA",
        }),
        new TextRun({
          text: node.title,
          bold: true,
          size: 22,
        }),
      ],
    }),
  );

  // Content
  if (node.content) {
    paragraphs.push(
      new Paragraph({
        indent: { left: depth * 400 + 200 },
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: node.content,
            size: 20,
            color: "444444",
          }),
        ],
      }),
    );
  }

  // Sources
  if (node.sources.length > 0) {
    paragraphs.push(
      new Paragraph({
        indent: { left: depth * 400 + 200 },
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Sources : ",
            bold: true,
            size: 18,
            color: "666666",
          }),
          new TextRun({
            text: node.sources.map((s) => s.title).join(", "),
            size: 18,
            color: "666666",
            italics: true,
          }),
        ],
      }),
    );
  }

  // Children
  for (let i = 0; i < node.children.length; i++) {
    paragraphs.push(
      ...renderArgumentParagraphs(
        node.children[i],
        depth + 1,
        `${counter}.${i + 1}`,
      ),
    );
  }

  return paragraphs;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { caseId } = await params;

  const caseData = await getCase(caseId, session.user.id);
  if (!caseData) {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
  }

  const args = await getArgumentsForCase(caseId, session.user.id);
  const sources = await getSourcesForCase(caseId, session.user.id);

  const tree = buildArgumentTree(args);

  // Build argument paragraphs
  const argumentParagraphs: Paragraph[] = [];
  if (tree.length === 0) {
    argumentParagraphs.push(
      new Paragraph({
        spacing: { before: 100 },
        children: [
          new TextRun({
            text: "Aucun argument.",
            italics: true,
            color: "888888",
            size: 20,
          }),
        ],
      }),
    );
  } else {
    for (let i = 0; i < tree.length; i++) {
      argumentParagraphs.push(
        ...renderArgumentParagraphs(tree[i], 0, `${i + 1}`),
      );
    }
  }

  // Build sources table
  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  } as const;

  const headerBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: "4338CA" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  } as const;

  const sourceTableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          borders: headerBorder,
          width: { size: 3000, type: WidthType.DXA },
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Titre", bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: headerBorder,
          width: { size: 4000, type: WidthType.DXA },
          children: [
            new Paragraph({
              children: [new TextRun({ text: "URL", bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: headerBorder,
          width: { size: 4000, type: WidthType.DXA },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "Extrait", bold: true, size: 20 }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  for (const source of sources) {
    const rowBorder = {
      ...noBorder,
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
    };
    sourceTableRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: rowBorder,
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [new TextRun({ text: source.title, size: 18 })],
              }),
            ],
          }),
          new TableCell({
            borders: rowBorder,
            width: { size: 4000, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: source.url ?? "—",
                    size: 18,
                    color: "4338CA",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: rowBorder,
            width: { size: 4000, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: source.content
                      ? source.content.length > 150
                        ? source.content.slice(0, 150) + "…"
                        : source.content
                      : "—",
                    size: 18,
                    italics: true,
                    color: "666666",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  }

  const exportDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1200,
              bottom: 1000,
              left: 1200,
            },
          },
        },
        children: [
          // Title page
          new Paragraph({
            spacing: { after: 200 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "ARGUMINDS",
                bold: true,
                size: 36,
                color: "4338CA",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: caseData.title,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 400 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Exporté le ${exportDate}`,
                size: 20,
                color: "888888",
              }),
            ],
          }),

          // Informations section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Informations",
                bold: true,
                size: 26,
                color: "333333",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Type : ",
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: caseData.type ?? "Non défini",
                size: 20,
              }),
              new TextRun({
                text: "    Statut : ",
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: STATUS_LABELS[caseData.status] ?? caseData.status,
                size: 20,
              }),
            ],
          }),
          ...(caseData.description
            ? [
                new Paragraph({
                  spacing: { after: 100 },
                  children: [
                    new TextRun({
                      text: caseData.description,
                      size: 20,
                      color: "555555",
                    }),
                  ],
                }),
              ]
            : []),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `Créé le ${new Date(caseData.createdAt).toLocaleDateString("fr-FR")}  —  Modifié le ${new Date(caseData.updatedAt).toLocaleDateString("fr-FR")}`,
                size: 18,
                color: "888888",
              }),
            ],
          }),

          // Arguments section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Arguments",
                bold: true,
                size: 26,
                color: "333333",
              }),
            ],
          }),
          ...argumentParagraphs,

          // Sources section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Sources",
                bold: true,
                size: 26,
                color: "333333",
              }),
            ],
          }),
          ...(sources.length === 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Aucune source.",
                      italics: true,
                      color: "888888",
                      size: 20,
                    }),
                  ],
                }),
              ]
            : [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: sourceTableRows,
                }),
              ]),

          // Footer
          new Paragraph({
            spacing: { before: 600 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Généré par ARGUMINDS — ${exportDate}`,
                size: 16,
                color: "AAAAAA",
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const filename = `ARGUMINDS_${caseData.title
    .replace(/[^a-zA-Z0-9àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ ]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 50)}.docx`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
