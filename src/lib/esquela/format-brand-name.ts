export type EsquelaBrandDisplay = {
  prefix: string;
  emphasis: string | null;
};

/** Formata el nom de marca per a la capçalera de l'esquela impresa (patró Pujols). */
export function formatEsquelaBrandName(brandName: string): EsquelaBrandDisplay {
  const trimmed = brandName.trim();
  if (!trimmed) {
    return { prefix: "", emphasis: null };
  }

  const pujolsMatch = trimmed.match(/^(.*?)\s*(pujols)\s*$/i);
  if (pujolsMatch) {
    const rawPrefix = pujolsMatch[1].trim();
    const prefix = rawPrefix
      ? rawPrefix.replace(/^funeraria$/i, "funerària").replace(/^funerària$/i, "funerària")
      : "funerària";
    return {
      prefix: prefix.toLowerCase(),
      emphasis: "PUJOLS",
    };
  }

  return { prefix: trimmed, emphasis: null };
}
