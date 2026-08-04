export interface WhatsAppLinkOptions {
  countryCode: string;
  number: string;
  message?: string;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Retorna `null` quando os dados não formam um número internacional válido. */
export function buildWhatsAppLink({
  countryCode,
  number,
  message = "",
}: WhatsAppLinkOptions): string | null {
  const normalizedCountryCode = onlyDigits(countryCode);
  const normalizedNumber = onlyDigits(number);

  if (!/^[1-9]\d{0,2}$/.test(normalizedCountryCode)) {
    return null;
  }

  if (!/^[1-9]\d{5,13}$/.test(normalizedNumber)) {
    return null;
  }

  const internationalNumber = `${normalizedCountryCode}${normalizedNumber}`;

  // O padrão E.164 aceita no máximo 15 algarismos no número completo.
  if (internationalNumber.length < 8 || internationalNumber.length > 15) {
    return null;
  }

  const trimmedMessage = message.trim();
  const query = trimmedMessage ? `?text=${encodeURIComponent(trimmedMessage)}` : "";

  return `https://wa.me/${internationalNumber}${query}`;
}

export function isWhatsAppLinkReady(options: WhatsAppLinkOptions): boolean {
  return buildWhatsAppLink(options) !== null;
}
