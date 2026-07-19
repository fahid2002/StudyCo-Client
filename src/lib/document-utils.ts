import { AlignmentType, Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';

const superscripts: Record<string, string> = {
  '-': '⁻',
  '+': '⁺',
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

function toSuperscript(value: string) {
  return value.split('').map((char) => superscripts[char] ?? char).join('');
}

function cleanFormula(value: string) {
  return value
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1 / $2')
    .replace(/\\text\{([^{}]+)\}/g, '$1')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\nu/g, 'ν')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\hbar/g, 'ℏ')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\geq/g, '≥')
    .replace(/\\leq/g, '≤')
    .replace(/\^\{([^{}]+)\}/g, (_match, exponent: string) => toSuperscript(exponent))
    .replace(/\^(-?\d+)/g, (_match, exponent: string) => toSuperscript(exponent))
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanAiText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\$\$([^$]+)\$\$/g, (_match, formula: string) => cleanFormula(formula))
    .replace(/\$([^$]+)\$/g, (_match, formula: string) => cleanFormula(formula))
    .replace(/\\\((.*?)\\\)/g, (_match, formula: string) => cleanFormula(formula))
    .replace(/\\\[(.*?)\\\]/gs, (_match, formula: string) => cleanFormula(formula))
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}/g, '')
    .replace(/\s+\*/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function toSafeFilename(name: string) {
  const cleaned = name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return cleaned || 'studyco-document';
}

function makeParagraph(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return new Paragraph({ text: '' });

  const bullet = /^(?:[-*]|•)\s+(.+)$/.exec(trimmed);
  if (bullet) {
    return new Paragraph({
      bullet: { level: 0 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: bullet[1], font: 'Times New Roman', size: 24 })],
    });
  }

  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text: trimmed, font: 'Times New Roman', size: 24 })],
    spacing: { after: 160 },
  });
}

export async function downloadDocx({
  title,
  body,
  filename,
}: {
  title: string;
  body: string;
  filename: string;
}) {
  const cleanedBody = cleanAiText(body);
  const doc = new DocxDocument({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: title, bold: true, size: 32, font: 'Times New Roman' })],
            spacing: { after: 280 },
          }),
          ...cleanedBody.split('\n').map(makeParagraph),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${toSafeFilename(filename)}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}
