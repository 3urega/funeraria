const fs = require("fs");
const path = require("path");

function transform(src, filePath) {
  let s = src;
  if (!/\.(get|all|run)\(\)/.test(s)) return s;

  const isScript = filePath.includes(`${path.sep}scripts${path.sep}`);
  const execImport = isScript
    ? 'import { allRows, oneRow, runSql } from "../src/lib/db/exec";\n'
    : 'import { allRows, oneRow, runSql } from "@/lib/db/exec";\n';

  if (!s.includes("lib/db/exec")) {
    if (s.includes('from "@/lib/db"') || s.includes("from '@/lib/db'")) {
      const lines = s.split("\n");
      const idx = lines.findIndex(
        (l) => l.includes("from \"@/lib/db\"") || l.includes("from '@/lib/db'"),
      );
      if (idx >= 0) lines.splice(idx + 1, 0, execImport.trimEnd());
      s = lines.join("\n");
    } else if (s.includes("../src/lib/db")) {
      const lines = s.split("\n");
      const idx = lines.findIndex((l) => l.includes("../src/lib/db"));
      if (idx >= 0) lines.splice(idx + 1, 0, execImport.trimEnd());
      s = lines.join("\n");
    } else if (filePath.endsWith("queries.ts")) {
      s = execImport + s;
    }
  }

  // Multiline-safe: replace ".all();" / ".get();" / ".run();" endings that belong to drizzle
  // by scanning for getDb / .insert / .update / .delete / db. contexts via simpler line-based approach

  // return xxx.all();
  s = s.replace(/return\s+((?:(?!return)[\s\S])*?)\.all\(\);/g, (m, expr) => {
    const e = expr.trim();
    if (
      e.includes("allRows(") ||
      e.includes("formData") ||
      e.includes("Promise.all") ||
      e.includes("searchParams") ||
      e.includes("cookie")
    ) {
      return m;
    }
    if (!/getDb\(|\.from\(|db\.|select\(/.test(e)) return m;
    return `return allRows(${e});`;
  });

  s = s.replace(/return\s+((?:(?!return)[\s\S])*?)\.get\(\);/g, (m, expr) => {
    const e = expr.trim();
    if (
      e.includes("oneRow(") ||
      e.includes("formData") ||
      e.includes("searchParams") ||
      e.includes("cookieStore") ||
      e.includes("cookie")
    ) {
      return m;
    }
    if (!/getDb\(|\.from\(|db\.|select\(/.test(e)) return m;
    return `return oneRow(${e});`;
  });

  // const x = ...get(); or const x = ...all();
  s = s.replace(
    /(const\s+\w+\s*=\s*)((?:(?!;)[\s\S])*?)\.get\(\);/g,
    (m, prefix, expr) => {
      const e = expr.trim();
      if (e.includes("oneRow(") || e.includes("formData") || e.includes("cookie"))
        return m;
      if (!/getDb\(|\.from\(|db\.|select\(/.test(e)) return m;
      return `${prefix}await oneRow(${e});`;
    },
  );

  s = s.replace(
    /(const\s+\w+\s*=\s*)((?:(?!;)[\s\S])*?)\.all\(\);/g,
    (m, prefix, expr) => {
      const e = expr.trim();
      if (e.includes("allRows(") || e.includes("formData")) return m;
      if (!/getDb\(|\.from\(|db\.|select\(/.test(e)) return m;
      return `${prefix}await allRows(${e});`;
    },
  );

  // statements ending in .run();
  s = s.replace(
    /^([ \t]*)((?:getDb\(\)|db)[\s\S]*?)\.run\(\);/gm,
    (m, indent, expr) => {
      if (m.includes("runSql(")) return m;
      return `${indent}await runSql(${expr.trim()});`;
    },
  );

  // ternary / nested without const: `.get()` still remaining inside expressions
  // Fix patterns like: ? db.select()...get() : null
  s = s.replace(
    /(\?\s*)((?:db|getDb\(\))[\s\S]*?)\.get\(\)/g,
    (m, q, expr) => `${q}await oneRow(${expr.trim()})`,
  );

  return s;
}

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(f.name)) continue;
      walk(p, files);
    } else if (/\.(ts|tsx)$/.test(f.name)) {
      files.push(p);
    }
  }
  return files;
}

const files = [...walk("src"), ...walk("scripts")];
let count = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  if (!/\.(get|all|run)\(\)/.test(src)) continue;
  if (
    !src.includes("getDb") &&
    !f.endsWith("queries.ts") &&
    !f.includes("seed.ts") &&
    !f.includes("patch-pujols")
  ) {
    continue;
  }
  const out = transform(src, f);
  if (out !== src) {
    fs.writeFileSync(f, out);
    count++;
    console.log("updated", f);
  }
}
console.log("done", count);
