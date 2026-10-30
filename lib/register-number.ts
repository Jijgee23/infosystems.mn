/**
 * Mongolian register numbers:
 *   organisation — 7 digits (1234567), stored in users.company_register (BIGINT)
 *   individual   — 2 Cyrillic letters + 8 digits (УБ12345678), stored in users.personal_register
 */
export const COMPANY_REGISTER = /^\d{7}$/;
export const PERSONAL_REGISTER = /^[А-ЯЁӨҮ]{2}\d{8}$/u;

/** Upper-cases and drops spaces, so "уб 12345678" matches PERSONAL_REGISTER. */
export const normalizePersonalRegister = (v: string) => v.replace(/\s+/g, "").toUpperCase();

export const isPersonalRegister = (v: string) => PERSONAL_REGISTER.test(normalizePersonalRegister(v));

/** Shown in admin lists and the portal: the register of whichever kind the account is. */
export const registerLabel = (u: { companyRegister: bigint | number | null; personalRegister: string | null }) =>
  u.personalRegister ?? (u.companyRegister !== null ? String(u.companyRegister) : null);
