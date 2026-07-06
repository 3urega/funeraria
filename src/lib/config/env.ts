import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_DRIVER: z.enum(["sqlite", "postgres"]).default("sqlite"),
  DATABASE_URL: z.string().default("./data/dev.db"),
  STORAGE_DRIVER: z.enum(["local", "supabase"]).default("local"),
  STORAGE_LOCAL_ROOT: z.string().default("./storage"),
  STORAGE_PUBLIC_BASE: z.string().default("/api/media"),
  AUTH_DRIVER: z.enum(["local", "supabase"]).default("local"),
  DEV_ADMIN_EMAIL: z.string().email().default("admin@local.dev"),
  DEV_ADMIN_PASSWORD: z.string().min(4).default("admin123"),
  ADMIN_SESSION_SECRET: z
    .string()
    .min(32)
    .default("dev-admin-secret-min-32-characters-long"),
  FAMILY_SESSION_SECRET: z
    .string()
    .min(32)
    .default("dev-family-secret-min-32-characters-long"),
  /** Funerària activa — una instància de la plataforma per client */
  FUNERAL_HOME_ID: z.string().min(1).default("fh-001"),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  return envSchema.parse(process.env);
}
