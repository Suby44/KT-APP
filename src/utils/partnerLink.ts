const PARTNER_CODE_KEY = "bloom.partnerCode";

export function getSavedPartnerCode(): string | null {
  try {
    return localStorage.getItem(PARTNER_CODE_KEY);
  } catch {
    return null;
  }
}

export function savePartnerCode(code: string): void {
  try {
    localStorage.setItem(PARTNER_CODE_KEY, code);
  } catch {
    // localStorage unavailable — the link just won't persist across reloads.
  }
}

export function clearPartnerCode(): void {
  try {
    localStorage.removeItem(PARTNER_CODE_KEY);
  } catch {
    // ignore
  }
}
