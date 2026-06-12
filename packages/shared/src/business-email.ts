/**
 * Business-E-Mail-Validierung
 *
 * DistillFeed ist eine B2B-Plattform — kostenlose Privatanbieter
 * werden blockiert, um Free-Plan-Missbrauch (Mehrfach-Accounts) zu
 * erschweren und die Zielgruppe sauber zu halten.
 */

/** Bekannte Gratis-/Consumer-E-Mail-Domains (Stand: 2025) */
export const FREE_EMAIL_DOMAINS = new Set([
  // Google
  "gmail.com", "googlemail.com",
  // Yahoo
  "yahoo.com", "yahoo.de", "yahoo.at", "yahoo.co.uk", "yahoo.fr",
  "yahoo.es", "yahoo.it", "yahoo.com.br", "ymail.com",
  // Microsoft / Outlook
  "hotmail.com", "hotmail.de", "hotmail.at", "hotmail.co.uk",
  "hotmail.fr", "hotmail.es", "hotmail.it",
  "outlook.com", "outlook.de", "outlook.at",
  "live.com", "live.de", "live.at", "live.co.uk",
  "msn.com",
  // German consumer ISPs & portals
  "web.de", "gmx.de", "gmx.net", "gmx.at", "gmx.ch",
  "t-online.de", "freenet.de", "arcor.de",
  "alice.de", "ewetel.net", "onlinehome.de",
  // Apple
  "icloud.com", "me.com", "mac.com",
  // AOL / Oath
  "aol.com", "aol.de",
  // Privacy-focused (Privatnutzer, kein Unternehmen)
  "protonmail.com", "proton.me", "pm.me",
  "tutanota.com", "tuta.io",
  "mailbox.org", "posteo.de",
  // Misc
  "mail.com", "email.com", "usa.com",
  "inbox.com", "fastmail.com", "fastmail.fm",
  "zohomail.com",        // Gratis-Tier ist Privatnutzer
  "yandex.com", "yandex.ru",
  "mail.ru", "list.ru", "bk.ru", "inbox.ru",
]);

/**
 * Prüft, ob eine E-Mail-Adresse geschäftlich ist (kein bekannter Gratis-Anbieter).
 * Rein syntaktische Prüfung — kein DNS/MX-Lookup.
 */
export function isBusinessEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  const atIdx = lower.lastIndexOf("@");
  if (atIdx === -1) return false;
  const domain = lower.slice(atIdx + 1);
  return !FREE_EMAIL_DOMAINS.has(domain);
}

/** Fehlermeldung für das UI */
export const BUSINESS_EMAIL_ERROR =
  "Bitte verwenden Sie Ihre geschäftliche E-Mail-Adresse (z. B. name@ihrefirma.de). " +
  "Kostenlose Anbieter wie Gmail oder GMX werden nicht akzeptiert.";
