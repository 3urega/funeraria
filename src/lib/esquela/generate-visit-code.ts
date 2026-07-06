const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Genera un codi d'accés familiar de 8 caràcters alfanumèrics. */
export function generateVisitCodeCandidate(): string {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return code;
}

export async function generateUniqueVisitCode(
  isTaken: (code: string) => Promise<boolean>,
): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = generateVisitCodeCandidate();
    if (!(await isTaken(candidate))) return candidate;
  }
  return `${generateVisitCodeCandidate()}${Date.now().toString(36).slice(-2).toUpperCase()}`;
}
