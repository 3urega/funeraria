import { z } from "zod";

const envSchema = z
  .object({
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
    FUNERAL_HOME_ID: z.string().min(1).default("fh-001"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    SUPABASE_STORAGE_BUCKET: z.string().min(1).default("media"),
  })
  .superRefine((data, ctx) => {
    if (data.STORAGE_DRIVER === "supabase") {
      if (!data.NEXT_PUBLIC_SUPABASE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "NEXT_PUBLIC_SUPABASE_URL required when STORAGE_DRIVER=supabase",
          path: ["NEXT_PUBLIC_SUPABASE_URL"],
        });
      }
      if (!data.SUPABASE_SERVICE_ROLE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "SUPABASE_SERVICE_ROLE_KEY required when STORAGE_DRIVER=supabase",
          path: ["SUPABASE_SERVICE_ROLE_KEY"],
        });
      }
    }
    if (data.AUTH_DRIVER === "supabase") {
      if (!data.NEXT_PUBLIC_SUPABASE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "NEXT_PUBLIC_SUPABASE_URL required when AUTH_DRIVER=supabase",
          path: ["NEXT_PUBLIC_SUPABASE_URL"],
        });
      }
      if (!data.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "NEXT_PUBLIC_SUPABASE_ANON_KEY required when AUTH_DRIVER=supabase",
          path: ["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
        });
      }
    }
    if (data.DATABASE_DRIVER === "postgres" && !data.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DATABASE_URL required when DATABASE_DRIVER=postgres",
        path: ["DATABASE_URL"],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  return envSchema.parse(process.env);
}
