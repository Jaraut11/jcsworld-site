import fs from 'fs';
import PDFDocument from 'pdfkit';

const brand = {
  primary: '#1E40AF',
  accent:  '#7C3AED',
  text:    '#111827',
  muted:   '#6B7280',
  line:    '#E5E7EB',
};

function hr(doc, y, color = brand.line) {
  doc.strokeColor(color).lineWidth(1).moveTo(50,y).lineTo(545,y).stroke();
}
function sectionTitle(doc, txt) {
  doc.moveDown(1.1);
  doc.fillColor(brand.text).font('Helvetica-Bold').fontSize(16).text(txt);
  doc.moveDown(0.4); hr(doc, doc.y+2); doc.moveDown(0.4);
}
function bullet(doc, txt) {
  const x=60,y=doc.y+3;
  doc.fillColor(brand.primary).circle(x,y,2.3).fill();
  doc.fillColor(brand.text).font('Helvetica').fontSize(11.5).text(txt, x+10, doc.y-6, { width:480 });
  doc.moveDown(0.3);
}
function checkbox(doc, txt) {
  const sz=10,x=60,y=doc.y;
  doc.rect(x,y,sz,sz).strokeColor(brand.accent).lineWidth(1.2).stroke();
  doc.fillColor(brand.text).font('Helvetica').fontSize(11.5).text(txt, x+sz+8, y-1, { width:460 });
  doc.moveDown(0.4);
}
function monthCard(doc, title, items) {
  const startX=doc.x,startY=doc.y,w=230,h=110;
  doc.roundedRect(startX,startY,w,h,8).lineWidth(0.8).strokeColor(brand.line).stroke();
  doc.roundedRect(startX,startY,w,24,8).fillColor(brand.primary).fill();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(11.5).text(title, startX+10, startY+6);
  doc.font('Helvetica').fillColor(brand.text).fontSize(10.5);
  let yy=startY+30;
  items.forEach(t=>{ doc.text('• '+t, startX+10, yy, { width:w-20 }); yy+=14; });
  doc.x=startX+w+15; doc.y=startY;
}
function footer(doc) {
  const y=780; hr(doc, y-10);
  doc.fontSize(9.5).fillColor(brand.muted)
    .text('© 2025 Jaraut Consultancy Services — www.jcsworld.in  •  +91 8920152372  •  jcsworld.in@gmail.com', 50, y, { width:495, align:'center' });
}
function tryImage(doc, path, x, y, opts) { try { if (fs.existsSync(path)) doc.image(path,x,y,opts);} catch(_){} }

const out='public/checklist-2025.pdf';
fs.mkdirSync('public', { recursive:true });

const doc=new PDFDocument({ size:'A4', margin:50, info:{
  Title:'2025 GST & Compliance Calendar',
  Author:'JCS (www.jcsworld.in)',
  Subject:'GST, TDS, PF/ESI monthly compliance checklist for MSMEs',
  Keywords:'GST GSTR TDS PF ESI compliance calendar India 2025',
}});
doc.pipe(fs.createWriteStream(out));

doc.roundedRect(50,50,495,90,12).fillOpacity(1).fill(brand.primary);
tryImage(doc,'public/logo.png',60,70,{ width:60, height:60 });
doc.fillColor('white').font('Helvetica-Bold').fontSize(22).text('2025 GST & Compliance Calendar',130,70);
doc.font('Helvetica').fontSize(12).fillColor('#E5E7EB').text('A practical filing checklist for MSMEs in Delhi-NCR',130,96);
doc.moveDown(2);

sectionTitle(doc,"What’s Inside");
['Month-by-month view of GST, TDS, PF/ESI','Quick notes to avoid late fees','Tick boxes to track completion','Link for WhatsApp reminders']
  .forEach(t=>bullet(doc,t));

doc.moveDown(0.8);
sectionTitle(doc,"How to Use");
['Print and keep near finance desk','Tick each item after filing','Set reminders 3 days before every due date']
  .forEach(t=>bullet(doc,t));

checkbox(doc,'Add GST portal creds + challan folder to team drive');
checkbox(doc,'Create a “Compliance” WhatsApp group');
checkbox(doc,'Nominate one owner: “No filing left behind”');

doc.addPage({ margin:50 });
sectionTitle(doc,'Monthly Quick View');
doc.moveDown(0.4);

// Page 2 grid: Jan–Aug (2 columns × 4 rows)
const months1=[
  'January','February','March','April','May','June','July','August'
];
const items=['GSTR-1 – as applicable','GSTR-3B – by 20th','TDS payment – by 7th','PF/ESI – by 15th'];
for (let i=0;i<months1.length;i++){
  if(i%2===0){ doc.x=50; } // left column
  monthCard(doc, months1[i], items);
  if(i%2===1){ doc.moveDown(8); } // next row after right column
}
footer(doc);

// Page 3 grid: Sep–Dec + notes/CTA
doc.addPage({ margin:50 });
sectionTitle(doc,'Monthly Quick View (contd.)');
doc.moveDown(0.4);

const months2=['September','October','November','December'];
for (let i=0;i<months2.length;i++){
  if(i%2===0){ doc.x=50; }
  monthCard(doc, months2[i], items);
  if(i%2===1){ doc.moveDown(8); }
}

doc.moveDown(1.5);
sectionTitle(doc,'Important Notes');
bullet(doc,'Due dates may shift for weekends/holidays—verify on official portals.');
bullet(doc,'QRMP taxpayers follow quarterly GSTR-1; plan cash flow for interest.');
bullet(doc,'Keep challans/returns organized month-wise for audits.');

doc.moveDown(1.2);
sectionTitle(doc,'Need Help?');
doc.font('Helvetica-Bold').fillColor(brand.primary)
   .text('Free Compliance Audit → https://wa.me/+91 98211 01440',{ link:'https://wa.me/+91 98211 01440' });
doc.moveDown(0.3).font('Helvetica').fillColor(brand.text)
   .text('We manage GST, TDS, Payroll (PF/ESI) and more for 100+ MSMEs in Delhi-NCR. Zero-penalty guarantee.');

footer(doc);
doc.end();
console.log('Wrote '+out);
