import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';

export function cleanAiText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}/g, '')
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

  const bullet = /^[-*]\s+(.+)$/.exec(trimmed);
  if (bullet) {
    return new Paragraph({
      bullet: { level: 0 },
      children: [new TextRun(bullet[1])],
    });
  }

  return new Paragraph({
    children: [new TextRun(trimmed)],
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
            children: [new TextRun({ text: title, bold: true, size: 32 })],
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
