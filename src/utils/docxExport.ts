import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  HeadingLevel,
  Header,
  Footer,
  PageNumber
} from 'docx';

export interface PositionPaperData {
  country: string;
  council: string;
  topic: string;
  delegate: string;
  section1Title: string;
  section1Text: string;
  section2Title: string;
  section2Text: string;
  section3Title: string;
  section3Text: string;
  citations: string[];
}

export async function generatePositionPaperDocx(data: PositionPaperData): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch (1440 twips)
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
                    text: 'PUMUN REGENERATION 2026 • UNICEF • REPUBLIC OF KENYA',
                    font: 'Times New Roman',
                    size: 18, // 9pt
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
                    text: 'Page ',
                    font: 'Times New Roman',
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 18,
                  }),
                  new TextRun({
                    text: ' of ',
                    font: 'Times New Roman',
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Times New Roman',
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Header Metadata Block
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'COMMITTEE: ',
                bold: true,
                font: 'Times New Roman',
                size: 24, // 12pt
              }),
              new TextRun({
                text: data.council,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'COUNTRY: ',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: data.country,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'TOPIC: ',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: data.topic,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'DELEGATE: ',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: data.delegate,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),

          // Section 1
          new Paragraph({
            spacing: { before: 180, after: 120 },
            heading: HeadingLevel.HEADING_2,
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
            indent: { firstLine: 720 }, // 0.5 inch indent
            spacing: { line: 276, after: 180 }, // 1.15 line spacing
            children: [
              new TextRun({
                text: data.section1Text,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),

          // Section 2
          new Paragraph({
            spacing: { before: 180, after: 120 },
            heading: HeadingLevel.HEADING_2,
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
            spacing: { line: 276, after: 180 },
            children: [
              new TextRun({
                text: data.section2Text,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),

          // Section 3
          new Paragraph({
            spacing: { before: 180, after: 120 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: data.section3Title,
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
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
          ),

          // Footnotes / References Divider
          new Paragraph({
            spacing: { before: 360, after: 120 },
            children: [
              new TextRun({
                text: 'REFERENCES (Chicago Manual of Style 17th Edition):',
                bold: true,
                font: 'Times New Roman',
                size: 20, // 10pt
              }),
            ],
          }),
          ...data.citations.map(
            (cite) =>
              new Paragraph({
                spacing: { after: 60 },
                indent: { left: 360, hanging: 360 }, // Hanging indent for references
                children: [
                  new TextRun({
                    text: cite,
                    font: 'Times New Roman',
                    size: 20,
                  }),
                ],
              })
          ),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
