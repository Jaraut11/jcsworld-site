import fs from 'fs';
import PDFDocument from 'pdfkit';

// ---------- Brand ----------
const brand = {
  primary: '#1F49D0',
  primaryDark: '#1638A2',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  pageBg: '#F6F8FF',
  cardBg: '#FFFFFF'
};

// ---------- helpers ----------
function footer(doc, W, H, M) {
  const y = H - M - 16;
  doc.save()
    .lineWidth(1).strokeColor(brand.border)
    .moveTo(M, y).lineTo(W - M, y).stroke()
    .fillColor(brand.muted).font('Helvetica').fontSize(10)
    .text('© 2025 Jaraut Consultancy Services  •  www.jcsworld.in  •  +91 8920152372  •  jcsworld.in@gmail.com',
          M, y + 6, { width: W - M*2, align: 'center' })
    .restore();
}
function titleBand(doc, W, M, text, subtitle='') {
  const bandH = 78;
  const x = M, y = 95, w = W - M*2;
  doc.save()
    .roundedRect(x, y, w, bandH, 16)
    .fillColor(brand.primary).fill()
    .fillColor('#fff').font('Helvetica-Bold').fontSize(22)
    .text(text, x, y + 20, { width: w, align: 'center' })
    .fillColor('#DCE5FF').font('Helvetica').fontSize(12)
    .text(subtitle, x, y + 46, { width: w, align: 'center' })
    .restore();
  doc.moveDown(3.2);
}
function h1(doc, W, M, text) {
  doc.x = M;
  doc.fillColor(brand.text).font('Helvetica-Bold').fontSize(24)
     .text(text, M, doc.y, { width: W - M*2, align: 'center' });
  doc.moveDown(0.6);
}
function h2(doc, W, M, text) {
  doc.x = M;
  doc.fillColor(brand.text).font('Helvetica-Bold').fontSize(18)
     .text(text, M, doc.y, { width: W - M*2 });
  doc.save().lineWidth(1).strokeColor(brand.border)
     .moveTo(M, doc.y + 6).lineTo(W - M, doc.y + 6).stroke().restore();
  doc.moveDown(0.8);
}
function p(doc, W, M, text) {
  doc.x = M;
  doc.fillColor(brand.muted).font('Helvetica').fontSize(12)
     .text(text, M, doc.y, { width: W - M*2, lineGap: 2 });
  doc.moveDown(0.3);
}
function checkLine(doc, W, M, text) {
  const x = M, y = doc.y;
  doc.rect(x, y + 2, 10, 10).lineWidth(1).strokeColor(brand.primary).stroke();
  doc.fillColor(brand.text).font('Helvetica').fontSize(12)
     .text('  ' + text, x + 12, y, { width: W - M*2 - 12 });
  doc.moveDown(0.2);
}
function monthCard(doc, label, bullets, w) {
  const startX = doc.x, startY = doc.y;
  const h = 108;

  doc.save()
    .roundedRect(startX, startY, w, h, 12)
    .lineWidth(1).strokeColor(brand.border).fillColor(brand.cardBg)
    .fillAndStroke();

  doc.save()
    .roundedRect(startX + 10, startY + 10, 100, 26, 8)
    .fillColor(brand.primary).fill().restore();
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(12)
     .text(label, startX + 18, startY + 15);

  doc.fillColor(brand.text).font('Helvetica').fontSize(11.5);
  let y = startY + 44;
  bullets.forEach(b => {
    doc.circle(startX + 18, y + 3, 1.8).fillColor(brand.primary).fill();
    doc.fillColor(brand.text).text(b, startX + 26, y - 4, { width: w - 36 });
    y = doc.y + 4;
  });

  doc.y = startY;
  doc.x = startX + w + 16;
}
function monthGridPage(doc, W, H, M, monthPairs) {
  const colW = (W - M*2 - 16) / 2;
  doc.x = M; doc.moveDown(0.6);
  const bullets = ['GSTR-1 – as applicable', 'GSTR-3B – by 20th', 'TDS payment – by 7th', 'PF/ESI – by 15th'];

  monthPairs.forEach(([m1, m2]) => {
    if (doc.y > H - M - 140) { doc.addPage(); paintPageBg(doc, W, H); doc.x = M; }
    monthCard(doc, m1, bullets, colW);
    monthCard(doc, m2, bullets, colW);
    doc.moveDown(1.2);
    doc.x = M;
  });
}
function paintPageBg(doc, W, H) { doc.save().rect(0,0,W,H).fill(brand.pageBg).restore(); }

// ---------- Generate ----------
fs.mkdirSync('public', { recursive: true });
const out = 'public/checklist-2025.pdf';

const M = 56;
const doc = new PDFDocument({ size: 'A4', margin: M });
const W = doc.page.width, H = doc.page.height;

doc.pipe(fs.createWriteStream(out));
paintPageBg(doc, W, H);

// Cover
titleBand(doc, W, M, '2025 GST & Compliance Calendar', 'A practical filing checklist for MSMEs in Delhi-NCR');
h2(doc, W, M, "What's Inside");
p(doc, W, M, '• Month-by-month view of GST, TDS, PF/ESI');
p(doc, W, M, '• Quick notes to avoid late fees');
p(doc, W, M, '• Tick boxes to track completion');
p(doc, W, M, '• Link for WhatsApp reminders');
doc.moveDown(0.6);
h2(doc, W, M, 'How to Use');
p(doc, W, M, 'Print and keep near finance desk'); checkLine(doc, W, M, 'Tick each item after filing');
checkLine(doc, W, M, 'Set reminders 3 days before every due date');
checkLine(doc, W, M, 'Add GST portal creds + challan folder to team drive');
checkLine(doc, W, M, 'Create a “Compliance” WhatsApp group');
checkLine(doc, W, M, 'Nominate one owner: “No filing left behind”');
footer(doc, W, H, M);

// Months 1
doc.addPage(); paintPageBg(doc, W, H);
h1(doc, W, M, 'Monthly Quick View');
monthGridPage(doc, W, H, M, [['January','February'],['March','April']]);
footer(doc, W, H, M);

// Months 2
doc.addPage(); paintPageBg(doc, W, H);
h1(doc, W, M, 'Monthly Quick View (contd.)');
monthGridPage(doc, W, H, M, [['May','June'],['July','August']]);
footer(doc, W, H, M);

// Months 3
doc.addPage(); paintPageBg(doc, W, H);
h1(doc, W, M, 'Monthly Quick View (contd.)');
monthGridPage(doc, W, H, M, [['September','October'],['November','December']]);
footer(doc, W, H, M);

// Notes & CTA
doc.addPage(); paintPageBg(doc, W, H);
h2(doc, W, M, 'Important Notes');
p(doc, W, M, '• Due dates may shift for weekends/holidays—verify on official portals.');
p(doc, W, M, '• QRMP taxpayers follow quarterly GSTR-1; plan cash flow for interest.');
p(doc, W, M, '• Keep challans/returns organized month-wise for audits.');

doc.moveDown(1.0);
h2(doc, W, M, 'Need Help?');
doc.x = M;
doc.fillColor(brand.primary).font('Helvetica-Bold').fontSize(13)
  .text('Free Compliance Audit → https://wa.me/+91 98211 01440',
        M, doc.y, { width: W - M*2, link: 'https://wa.me/+91 98211 01440' });
doc.moveDown(0.3);
p(doc, W, M, 'We manage GST, TDS, Payroll (PF/ESI), and more for 100+ MSMEs in Delhi-NCR. Zero-penalty guarantee.');

footer(doc, W, H, M);
doc.end();
console.log('Wrote ' + out);
