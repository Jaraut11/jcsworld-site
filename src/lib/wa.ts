export const WA_NUMBER = '918920152372';
export const WA_DEFAULT =
  "Hello JCS Team — I’d like to discuss your Accounts, HR & Compliance services for my business. Could we schedule a quick consultation?";

export const waHref = (text: string = WA_DEFAULT) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
