/**
 * Genera versions imprimibles (HTML) de les guies en català.
 * Ús: node scripts/build-guia-imprimible-ca.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "docs", "guia-cliente", "ca");
const OUT = path.join(SRC, "imprimible");

const GUIDES = [
  { file: "acces-admin.md", title: "Accés al panell d'administració", slug: "acces-admin" },
  { file: "esqueles.md", title: "Esqueles", slug: "esqueles" },
  { file: "llocs.md", title: "Llocs", slug: "llocs" },
  { file: "flors.md", title: "Flors", slug: "flors" },
  { file: "poemes.md", title: "Poemes", slug: "poemes" },
  { file: "configuracio.md", title: "Configuració", slug: "configuracio" },
  { file: "contingut-home.md", title: "Contingut de la home", slug: "contingut-home" },
  { file: "zona-familiar.md", title: "Zona familiar", slug: "zona-familiar" },
  { file: "web-publica.md", title: "Web pública", slug: "web-publica" },
  { file: "itinerari-demo.md", title: "Itinerari de demo", slug: "itinerari-demo" },
];

function stripForPrint(md) {
  return md
    .replace(/^\*\*Versió en castellà:\*\*.*\n/m, "")
    .replace(/^Documents de suport:.*\n/m, "")
    .replace(/^\# .+\n/m, "") // títol ja va a la capçalera HTML
    .replace(/\[([^\]]+)\]\(\.\/[^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\(\.\.\/[^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\(#([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function normalizeListContinuations(md) {
  const lines = md.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cont = line.match(/^(\s{2,}|\t)(.+)$/);
    if (cont && out.length > 0) {
      out[out.length - 1] += " " + cont[2].trim();
    } else {
      out.push(line);
    }
  }
  return out.join("\n");
}

function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let inTable = false;
  let inCode = false;
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  const inline = (s) =>
    s
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      closeLists();
      if (!inCode) {
        out.push("<pre><code>");
        inCode = true;
      } else {
        out.push("</code></pre>");
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      out.push(line.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
      continue;
    }

    if (line.startsWith("# ")) {
      closeLists();
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeLists();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      closeLists();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) continue;
      if (!inTable) {
        closeLists();
        out.push("<table>");
        inTable = true;
        const tag = "th";
        out.push("<thead><tr>");
        for (const c of cells) out.push(`<${tag}>${inline(c)}</${tag}>`);
        out.push("</tr></thead><tbody>");
        continue;
      }
      out.push("<tr>");
      for (const c of cells) out.push(`<td>${inline(c)}</td>`);
      out.push("</tr>");
      continue;
    } else if (inTable) {
      out.push("</tbody></table>");
      inTable = false;
    }

    if (line === "---") {
      closeLists();
      out.push('<hr class="separador">');
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (!inOl) {
        closeLists();
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${inline(olMatch[2])}</li>`);
      continue;
    }

    const ulMatch = line.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!inUl) {
        closeLists();
        out.push("<ul>");
        inUl = true;
      }
      out.push(`<li>${inline(ulMatch[1])}</li>`);
      continue;
    }

    if (line.trim() === "") {
      closeLists();
      continue;
    }

    closeLists();
    out.push(`<p>${inline(line)}</p>`);
  }

  closeLists();
  if (inTable) out.push("</tbody></table>");
  if (inCode) out.push("</code></pre>");

  return out.join("\n");
}

function wrapPage({ title, body, slug, standalone = true }) {
  const nav = standalone
    ? `<p class="no-print enllac-index"><a href="index.html">← Tornar a l'índex</a></p>`
    : "";
  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Guia funerària (imprimible)</title>
  <link rel="stylesheet" href="_estils-impressio.css">
</head>
<body class="pagina-guia" data-slug="${slug}">
  ${nav}
  <header class="capcalera-doc">
    <p class="meta">Guia d'ús — Funerària · Versió imprimible · Català</p>
    <h1 class="titol-portada">${title}</h1>
  </header>
  <main class="contingut">
${body}
  </main>
  <footer class="peu-doc">
    <p>Document intern d'ús · Funerària</p>
  </footer>
  <p class="no-print instruccions">Prem <kbd>Ctrl</kbd>+<kbd>P</kbd> (o <kbd>⌘</kbd>+<kbd>P</kbd>) per imprimir o desar com a PDF.</p>
</body>
</html>`;
}

function buildIndex() {
  const items = GUIDES.map(
    (g) =>
      `    <li><a href="${g.slug}.html">${g.title}</a> <span class="hint">(${g.slug}.html)</span></li>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guies imprimibles — Català</title>
  <link rel="stylesheet" href="_estils-impressio.css">
</head>
<body class="pagina-index">
  <header class="portada">
    <p class="meta">Funerària · Guia d'ús per a empleats</p>
    <h1>Guies imprimibles</h1>
    <p class="subtitol">Versió en català · Format A4</p>
  </header>

  <section class="instruccions-impressio no-print">
    <h2>Com imprimir</h2>
    <ol>
      <li>Obre la guia que vulguis (o la <strong>guia completa</strong>).</li>
      <li>Prem <kbd>Ctrl</kbd>+<kbd>P</kbd> (Windows) o <kbd>⌘</kbd>+<kbd>P</kbd> (Mac).</li>
      <li>Tria <strong>Desar com a PDF</strong> o la impressora.</li>
      <li>Recomanat: marges <strong>Per defecte</strong>, escala <strong>100%</strong>, sense capçaleres del navegador.</li>
    </ol>
    <p class="cta">
      <a class="boto boto-principal" href="guia-completa.html">Obrir guia completa (totes les pàgines)</a>
    </p>
  </section>

  <section class="llista-guies">
    <h2>Guies individuals</h2>
    <ol>
${items}
    </ol>
  </section>

  <section class="resum-index">
    <h2>Abans de començar</h2>
    <ul>
      <li>Cal Internet i un navegador (Chrome, Edge o Safari).</li>
      <li>Panell d'administració: afegiu <code>/admin</code> a l'adreça de la web.</li>
      <li>Ordre recomanat: Configuració → Llocs → Poemes (opcional) → Esqueles → Flors / Home.</li>
    </ul>
    <h2>Paraules freqüents</h2>
    <table>
      <thead><tr><th>Paraula</th><th>Vol dir</th></tr></thead>
      <tbody>
        <tr><td><strong>Activa</strong></td><td>El familiar pot entrar amb el seu codi.</td></tr>
        <tr><td><strong>Visible</strong></td><td>L'esquela apareix al llistat públic.</td></tr>
        <tr><td><strong>Esquela completa</strong></td><td>Marca interna que ja està llesta.</td></tr>
        <tr><td><strong>Pendent retocar</strong></td><td>Foto del familiar pendent de retocar i publicar.</td></tr>
        <tr><td><strong>Desar</strong></td><td>Guardar els canvis.</td></tr>
      </tbody>
    </table>
  </section>

  <footer class="peu-doc">
    <p>Generat des de docs/guia-cliente/ca/ · Per actualitzar: <code>npm run guia:imprimible:ca</code></p>
  </footer>
</body>
</html>`;
}

function buildComplete(sections) {
  const body = sections
    .map(
      (s, i) =>
        `<section class="seccio-guia${i > 0 ? " salt-pagina" : ""}" id="${s.slug}">
  <header class="capcalera-seccio">
    <p class="meta">Guia ${i + 1} de ${sections.length}</p>
    <h1>${s.title}</h1>
  </header>
  <div class="contingut-seccio">
${s.html}
  </div>
</section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guia completa imprimible — Català</title>
  <link rel="stylesheet" href="_estils-impressio.css">
</head>
<body class="pagina-completa">
  <p class="no-print enllac-index"><a href="index.html">← Tornar a l'índex</a></p>

  <section class="portada salt-pagina-despres">
    <p class="meta">Funerària · Guia d'ús per a empleats</p>
    <h1>Guia completa</h1>
    <p class="subtitol">Versió imprimible en català</p>
    <ol class="index-complet">
${GUIDES.map((g, i) => `      <li>${i + 1}. ${g.title}</li>`).join("\n")}
    </ol>
  </section>

${body}

  <footer class="peu-doc salt-pagina">
    <p>Document intern d'ús · Funerària · ${GUIDES.length} guies</p>
  </footer>
  <p class="no-print instruccions">Prem <kbd>Ctrl</kbd>+<kbd>P</kbd> per imprimir tot el document com a PDF.</p>
</body>
</html>`;
}

fs.mkdirSync(OUT, { recursive: true });

const cssPath = path.join(OUT, "_estils-impressio.css");
if (!fs.existsSync(cssPath)) {
  console.warn("Missing _estils-impressio.css — create it manually");
}

const sections = [];

for (const guide of GUIDES) {
  const srcPath = path.join(SRC, guide.file);
  const raw = fs.readFileSync(srcPath, "utf8");
  const cleaned = normalizeListContinuations(stripForPrint(raw));
  const html = mdToHtml(cleaned);
  sections.push({ ...guide, html });

  const page = wrapPage({ title: guide.title, body: html, slug: guide.slug });
  fs.writeFileSync(path.join(OUT, `${guide.slug}.html`), page, "utf8");
  console.log(`  ${guide.slug}.html`);
}

fs.writeFileSync(path.join(OUT, "index.html"), buildIndex(), "utf8");
console.log("  index.html");

fs.writeFileSync(path.join(OUT, "guia-completa.html"), buildComplete(sections), "utf8");
console.log("  guia-completa.html");

console.log(`\nDone → ${OUT}`);
