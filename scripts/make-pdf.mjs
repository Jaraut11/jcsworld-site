import fs from 'fs';
import PDFDocument from 'pdfkit';

fs.mkdirSync('public', { recursive: true });
const out = 'public/checklist-2025.pdf';

const doc = new PDFDocument({ size: 'A4', margin: 50 });
doc.pipe(fs.createWriteStream(out));

doc.fontSize(22).text('2025 GST & Compliance Calendar', { align: 'center' });
doc.moveDown().fontSize(12).text('Quick Checklist (sample content):').moveDown();
[
  'Monthly GSTR-3B: by 20th of following month (regular)',
  'GSTR-1: monthly/quarterly as applicable',
  'TDS payment: by 7th of following month',
  'PF/ESI: by 15th / 15th respectively',
  'ITR due dates: per category'
].forEach(i => doc.text('• ' + i));
doc.moveDown().text('— JCS (www.jcsworld.in)', { align: 'right', opacity: 0.6 });

doc.end();
console.log('Wrote ' + out);
