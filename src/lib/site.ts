// Site-wide contact details.

/** Academy WhatsApp number in international format, digits only (018-374 1721 → 60183741721). */
export const WHATSAPP_NUMBER = "60183741721";

export const ACADEMY = {
  name: "StrikeZone Martial Arts",
  address: "Machang Bubok, Bukit Mertajam, Penang, Malaysia",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Machang+Bubok%2C+Bukit+Mertajam%2C+Penang",
  phoneDisplay: "018-374 1721",
  email: "s.zonemartialartsacademy@gmail.com",
};

export const SOCIALS = {
  instagram: "https://www.instagram.com/strikezonemartialarts",
  facebook: "https://www.facebook.com/share/19UHr3jVN2/",
  tiktok: "https://www.tiktok.com/@strikezone_martialarts",
};

export function whatsappUrl(text?: string) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
