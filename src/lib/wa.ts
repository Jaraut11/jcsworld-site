export const WA_NUMBER = '+91 98211 01440';
export const WA_DEFAULT =
  "Hello JCS Team — I’d like to discuss your Accounts, HR & Compliance services for my business. Could we schedule a quick consultation?";

export function waHref(text: string = WA_DEFAULT, source?: string) {
  const qs = new URLSearchParams({ text });
  if (source) qs.set('source', source); // e.g., "hero", "header"
  return `https://wa.me/${WA_NUMBER}?${qs.toString()}`;
}
