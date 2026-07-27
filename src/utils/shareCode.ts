// Avoids visually ambiguous characters (0/O, 1/I/l) since people read this off a screen to a partner.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

export function generateShareCode(): string {
  let code = "";
  const randomValues = new Uint32Array(CODE_LENGTH);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[randomValues[i] % ALPHABET.length];
  }
  return code;
}

export function normalizeShareCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}
