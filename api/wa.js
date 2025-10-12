export default function handler(req, res) {
  const number = '+91 98211 01440';
  const text = "Hello JCS Team — I’d like to discuss your Accounts, HR & Compliance services for my business. Could we schedule a quick consultation?";
  const source = (req.query.source || 'shortlink') + '';
  const params = new URLSearchParams({ text, source });
  res.writeHead(302, { Location: `https://wa.me/${number}?${params.toString()}` });
  res.end();
}
