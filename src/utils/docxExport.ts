import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  Header,
  Footer,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  ExternalHyperlink,
  VerticalAlign
} from 'docx';
import { KENYA_EMBLEM_BASE64 } from '../assets/kenyaEmblemBase64';
import { KENYA_FLAG_BASE64 } from '../assets/kenyaFlagBase64';

export interface ReferenceWithLink {
  citation: string;
  linkLabel: string;
  url: string;
}

export interface PositionPaperData {
  country: string;
  council: string;
  topic: string;
  delegate: string;
  institution?: string;
  quote?: {
    text: string;
    author: string;
  };
  section1Title: string;
  section1Text: string;
  section2Title: string;
  section2Text: string;
  section3Title: string;
  section3Intro?: string;
  actions?: Array<{
    actionNumber: string;
    title: string;
    text: string;
  }>;
  section3Text: string;
  citations: string[];
  referencesWithLinks?: ReferenceWithLink[];
}

export async function generatePositionPaperDocx(data: PositionPaperData): Promise<Blob> {
  const noBorder = {
    style: BorderStyle.NONE,
    size: 0,
    color: 'auto',
  };

  const solidBorder = {
    style: BorderStyle.SINGLE,
    size: 6,
    color: '000000',
  };

  // Convert base64 flag and emblem to Uint8Array for docx ImageRun
  const flagBytes = Uint8Array.from(atob(KENYA_FLAG_BASE64), (c) => c.charCodeAt(0));
  const emblemBytes = Uint8Array.from(atob(KENYA_EMBLEM_BASE64), (c) => c.charCodeAt(0));

  // Inner bordered metadata table (Country, Council, Topic, Delegates)
  const metadataInnerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: solidBorder,
      bottom: solidBorder,
      left: solidBorder,
      right: solidBorder,
      insideHorizontal: solidBorder,
      insideVertical: solidBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Country',
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 78, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.country,
                    bold: true,
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Council',
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 78, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.council,
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Topic',
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 78, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.topic,
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Delegates',
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 78, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${data.delegate} (${data.institution || 'President University'})`,
                    font: 'Times New Roman',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Outer 3-column header table: Left = Kenya Flag, Center = Metadata Table, Right = Official Kenya Coat of Arms
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      right: noBorder,
      insideHorizontal: noBorder,
      insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          // Left column: Official National Flag of Kenya
          new TableCell({
            width: { size: 19, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new ImageRun({
                    type: 'png',
                    data: flagBytes,
                    transformation: {
                      width: 86,
                      height: 57,
                    },
                  }),
                ],
              }),
            ],
          }),
          // Middle column: Bordered Metadata Table
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            children: [metadataInnerTable],
          }),
          // Right column: Official Coat of Arms Emblem of Kenya
          new TableCell({
            width: { size: 19, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new ImageRun({
                    type: 'png',
                    data: emblemBytes,
                    transformation: {
                      width: 78,
                      height: 74,
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const quoteParagraphs = data.quote ? [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 220, after: 40 },
      children: [
        new TextRun({
          text: `“${data.quote.text}”`,
          italics: true,
          font: 'Times New Roman',
          size: 21,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.quote.author,
          italics: true,
          bold: true,
          font: 'Times New Roman',
          size: 20,
        }),
      ],
    }),
  ] : [];

  // Actions in Section 3
  const actionParagraphs: Paragraph[] = [];
  if (data.actions && data.actions.length > 0) {
    if (data.section3Intro) {
      actionParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          spacing: { line: 276, after: 120 },
          children: [
            new TextRun({
              text: data.section3Intro,
              font: 'Times New Roman',
              size: 24,
            }),
          ],
        })
      );
    }
    data.actions.forEach((act) => {
      actionParagraphs.push(
        new Paragraph({
          spacing: { before: 140, after: 40 },
          children: [
            new TextRun({
              text: `${act.actionNumber}: `,
              bold: true,
              font: 'Times New Roman',
              size: 23,
            }),
            new TextRun({
              text: act.title,
              bold: true,
              font: 'Times New Roman',
              size: 23,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          spacing: { line: 276, after: 120 },
          children: [
            new TextRun({
              text: act.text,
              font: 'Times New Roman',
              size: 24,
            }),
          ],
        })
      );
    });
  } else {
    actionParagraphs.push(
      ...data.section3Text.split('\n\n').map(
        (para) =>
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            spacing: { line: 276, after: 140 },
            children: [
              new TextRun({
                text: para,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          })
      )
    );
  }

  // Build Reference Paragraphs with clickable Blue ExternalHyperlinks
  const referenceParagraphs: Paragraph[] = [];
  if (data.referencesWithLinks && data.referencesWithLinks.length > 0) {
    data.referencesWithLinks.forEach((ref) => {
      referenceParagraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: ref.citation,
              font: 'Times New Roman',
              size: 22,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: ref.linkLabel,
                  color: '0563C1',
                  underline: {},
                  font: 'Times New Roman',
                  size: 22,
                }),
              ],
              link: ref.url,
            }),
          ],
        })
      );
    });
  } else {
    data.citations.forEach((cite) => {
      referenceParagraphs.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 720, hanging: 720 },
          children: [
            new TextRun({
              text: cite,
              font: 'Times New Roman',
              size: 20,
            }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Republic of Kenya | UNICEF | PUMUN Regeneration 2026',
                    font: 'Times New Roman',
                    size: 16,
                    color: '666666',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
                    font: 'Times New Roman',
                    size: 18,
                    color: '444444',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          headerTable,
          ...quoteParagraphs,

          // Section 1: Background and Problem Analysis
          new Paragraph({
            spacing: { before: 180, after: 100 },
            children: [
              new TextRun({
                text: data.section1Title,
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            spacing: { line: 276, after: 160 },
            children: [
              new TextRun({
                text: data.section1Text,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),

          // Section 2: National Stance and Past International Actions
          new Paragraph({
            spacing: { before: 180, after: 100 },
            children: [
              new TextRun({
                text: data.section2Title,
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            spacing: { line: 276, after: 160 },
            children: [
              new TextRun({
                text: data.section2Text,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),

          // Section 3: Structured Multilateral Solutions
          new Paragraph({
            spacing: { before: 180, after: 100 },
            children: [
              new TextRun({
                text: data.section3Title,
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          ...actionParagraphs,

          // References Section with clickable blue links
          new Paragraph({
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({
                text: 'References:',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          ...referenceParagraphs,
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
