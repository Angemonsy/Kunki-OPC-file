const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, AlignmentType, LevelFormat, ImageRun, PageBreak, Header, Footer, PageNumber } = require('docx');
const fs = require('fs');

// 读取markdown文件
const mdContent = fs.readFileSync('D:/ObsidianVaults/MyVault/B-参考资料/01-书籍书稿/OpenClaw一人公司 AI自媒体运营实战手册.md', 'utf8');

function parseMarkdownToDocx(md) {
  const lines = md.split('\n');
  const children = [];
  let inTable = false;
  let tableRows = [];

  // 添加标题页
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 600 },
    children: [new TextRun({ text: 'OpenClaw一人公司', bold: true, size: 48, font: 'Arial' })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1200 },
    children: [new TextRun({ text: 'AI自媒体运营实战手册', size: 36, font: 'Arial' })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 2000 },
    children: [new TextRun({ text: '林总（我是林kunki）', size: 24, font: 'Arial' })],
  }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // 处理水平分隔线 ---
    if (trimmed === '---') {
      children.push(new Paragraph({ children: [] }));
      continue;
    }

    // 处理代码块
    if (trimmed.startsWith('```')) {
      // 跳过代码块标记，后续处理可以优化
      continue;
    }

    // 处理表头
    if (trimmed.startsWith('| ') && trimmed.endsWith(' |') && inTable === false) {
      inTable = true;
      tableRows = [];
      // 处理这一行
      const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
      const tableCells = cells.map(cell => new TableCell({
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        },
        shading: { fill: 'D5E8F0', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        width: { size: Math.floor(9360 / cells.length), type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: cell, size: 22, font: 'Arial', bold: true })] })]
      }));
      tableRows.push(new TableRow({ children: tableCells }));
      // 跳过下一行（分隔线）
      i++;
      continue;
    }

    // 处理表格行
    if (inTable && trimmed.startsWith('| ') && trimmed.endsWith(' |')) {
      const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
      const tableCells = cells.map(cell => new TableCell({
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        },
        shading: { type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        width: { size: Math.floor(9360 / cells.length), type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: cell, size: 22, font: 'Arial' })] })]
      }));
      tableRows.push(new TableRow({ children: tableCells }));

      // 检查下一行是否还是表格，如果不是就结束表格
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      if (!nextLine.startsWith('| ') || !nextLine.endsWith(' |')) {
        // 表格结束
        const colCount = tableRows[0] && tableRows[0].children ? tableRows[0].children.length : 1;
        children.push(new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: new Array(colCount).fill(0).map(() => Math.floor(9360 / colCount)),
          rows: tableRows,
        }));
        children.push(new Paragraph({ children: [] }));
        inTable = false;
        tableRows = [];
      }
      continue;
    }

    // 处理标题
    if (trimmed.startsWith('# ')) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 240 },
        children: [new TextRun({ text: trimmed.slice(2), bold: true, size: 36, font: 'Arial' })],
      }));
      continue;
    }
    if (trimmed.startsWith('## ')) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 180 },
        children: [new TextRun({ text: trimmed.slice(3), bold: true, size: 32, font: 'Arial' })],
      }));
      continue;
    }
    if (trimmed.startsWith('### ')) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: trimmed.slice(4), bold: true, size: 28, font: 'Arial' })],
      }));
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_4,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: trimmed.slice(5), bold: true, size: 26, font: 'Arial' })],
      }));
      continue;
    }

    // 处理无序列表
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.slice(2);
      // 处理粗体 **text**
      const runs = parseInlineFormatting(text);
      children.push(new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        spacing: { after: 60 },
        children: runs,
      }));
      continue;
    }

    // 处理有序列表
    if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, '');
      const runs = parseInlineFormatting(text);
      children.push(new Paragraph({
        numbering: { reference: 'numbers', level: 0 },
        spacing: { after: 60 },
        children: runs,
      }));
      continue;
    }

    // 处理普通段落
    if (trimmed === '') {
      if (children.length > 0) {
        const lastChild = children[children.length - 1];
        if (!(lastChild instanceof Paragraph && (!lastChild.children || lastChild.children.length === 0))) {
          children.push(new Paragraph({ children: [] }));
        }
      } else {
        children.push(new Paragraph({ children: [] }));
      }
      continue;
    }

    const runs = parseInlineFormatting(trimmed);
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: runs,
    }));
  }

  return children;
}

function parseInlineFormatting(text) {
  const runs = [];
  let currentText = '';
  let isBold = false;
  let i = 0;

  while (i < text.length) {
    if (text.substr(i, 2) === '**') {
      if (currentText) {
        runs.push(new TextRun({
          text: currentText,
          size: 24,
          font: 'Arial',
          bold: isBold,
        }));
        currentText = '';
      }
      isBold = !isBold;
      i += 2;
    } else {
      currentText += text[i];
      i++;
    }
  }

  if (currentText) {
    runs.push(new TextRun({
      text: currentText,
      size: 24,
      font: 'Arial',
      bold: isBold,
    }));
  }

  return runs;
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Arial', size: 24 },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 280, after: 180 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: 'numbers',
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: {
          width: 12240,   // US Letter
          height: 15840,
        },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'OpenClaw一人公司：AI自媒体运营实战手册', size: 18, font: 'Arial', color: '808080' }),
              new TextRun({ text: ' | ', size: 18, font: 'Arial', color: '808080' }),
              new TextRun({ text: 'Page ', size: 18, font: 'Arial', color: '808080' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Arial', color: '808080' }),
            ],
          }),
        ],
      }),
    },
    children: parseMarkdownToDocx(mdContent),
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('D:/ObsidianVaults/MyVault/B-参考资料/01-书籍书稿/OpenClaw一人公司 AI自媒体运营实战手册.docx', buffer);
  console.log('转换完成！');
});
