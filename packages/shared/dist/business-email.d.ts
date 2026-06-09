/**
 * Business-E-Mail-Validierung
 *
 * IntelliStream ist eine B2B-Plattform — kostenlose Privatanbieter
 * werden blockiert, um Free-Plan-Missbrauch (Mehrfach-Accounts) zu
 * erschweren und die Zielgruppe sauber zu halten.
 */
/** Bekannte Gratis-/Consumer-E-Mail-Domains (Stand: 2025) */
export declare const FREE_EMAIL_DOMAINS: Set<string>;
/**
 * Prüft, ob eine E-Mail-Adresse geschäftlich ist (kein bekannter Gratis-Anbieter).
 * Rein syntaktische Prüfung — kein DNS/MX-Lookup.
 */
export declare function isBusinessEmail(email: string): boolean;
/** Fehlermeldung für das UI */
export declare const BUSINESS_EMAIL_ERROR: string;
