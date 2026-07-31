import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const PROJECT_REF = "pmvvnfjiccmxwrilmqnl";
const DEFAULT_POOLER_PREFIX = "aws-1";
const DEFAULT_DB_REGION = "eu-west-2";
const ENV_FILE = path.resolve(process.cwd(), ".env.staging");
const SECRETS_FILE = path.resolve(process.cwd(), ".env.staging.secrets");

function loadSecretsFile(): void {
  if (!fs.existsSync(SECRETS_FILE)) {
    return;
  }
  for (const line of fs.readFileSync(SECRETS_FILE, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function readSecret(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Falta ${name}. Usa una de:\n` +
        `  1) $env:${name}="..."; npm run staging:bootstrap\n` +
        `  2) copy .env.staging.secrets.example .env.staging.secrets (y rellena)`,
    );
  }
  return value;
}

function randomSecret(): string {
  return randomBytes(32).toString("base64url");
}

function buildSessionPoolerDatabaseUrl(password: string): string {
  const prefix = process.env.STAGING_POOLER_PREFIX?.trim() ?? DEFAULT_POOLER_PREFIX;
  const region = process.env.STAGING_DB_REGION?.trim() ?? DEFAULT_DB_REGION;
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres.${PROJECT_REF}:${encoded}@${prefix}-${region}.pooler.supabase.com:5432/postgres`;
}

function buildTransactionPoolerDatabaseUrl(password: string): string {
  const prefix = process.env.STAGING_POOLER_PREFIX?.trim() ?? DEFAULT_POOLER_PREFIX;
  const region = process.env.STAGING_DB_REGION?.trim() ?? DEFAULT_DB_REGION;
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres.${PROJECT_REF}:${encoded}@${prefix}-${region}.pooler.supabase.com:6543/postgres`;
}

function buildDirectDatabaseUrl(password: string): string {
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres:${encoded}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
}

function buildPoolerDatabaseUrl(password: string): string {
  return buildTransactionPoolerDatabaseUrl(password);
}

function main() {
  loadSecretsFile();

  const dbPassword = readSecret("STAGING_DB_PASSWORD");
  const anonKey = readSecret("STAGING_ANON_KEY");
  const serviceRoleKey = readSecret("STAGING_SERVICE_ROLE_KEY");

  const databaseUrl =
    process.env.STAGING_DATABASE_URL?.trim() ??
    buildSessionPoolerDatabaseUrl(dbPassword);

  const adminEmail =
    process.env.SEED_ADMIN_EMAIL?.trim() ?? "admin@staging.pujols.cat";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD?.trim();

  const lines = [
    "# Generado por npm run staging:bootstrap — no commitear",
    "NODE_ENV=production",
    "NEXT_PUBLIC_APP_URL=https://placeholder.vercel.app",
    "",
    "DATABASE_DRIVER=postgres",
    `# Session pooler local (IPv4); Vercel → transaction pooler 6543 (misma región)`,
    `DATABASE_URL=${databaseUrl}`,
    "",
    "STORAGE_DRIVER=supabase",
    "AUTH_DRIVER=supabase",
    "",
    `STORAGE_PUBLIC_BASE=https://${PROJECT_REF}.supabase.co/storage/v1/object/public/media`,
    "SUPABASE_STORAGE_BUCKET=media",
    "",
    `NEXT_PUBLIC_SUPABASE_URL=https://${PROJECT_REF}.supabase.co`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`,
    "",
    "FUNERAL_HOME_ID=fh-001",
    "",
    `ADMIN_SESSION_SECRET=${randomSecret()}`,
    `FAMILY_SESSION_SECRET=${randomSecret()}`,
    "",
    `SEED_ADMIN_EMAIL=${adminEmail}`,
  ];

  if (adminPassword) {
    lines.push(`SEED_ADMIN_PASSWORD=${adminPassword}`);
  }

  lines.push(
    "",
    `# Vercel DATABASE_URL (transaction pooler 6543):`,
    `# ${buildTransactionPoolerDatabaseUrl(dbPassword)}`,
    "",
  );

  fs.writeFileSync(ENV_FILE, `${lines.join("\n")}\n`, "utf8");

  console.log(`✓ Creado ${ENV_FILE}`);
  console.log("Siguiente paso: npm run db:setup:staging");
}

main();
