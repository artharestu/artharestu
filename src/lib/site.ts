export const SITE_URL = "https://artharestu.com";
export const OWNER_NAME = "Artha Restu";

const WHATSAPP_NUMBER = "6285750777740";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
