import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import { getTenantBranding } from "@/lib/site/tenant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export async function generateMetadata(): Promise<Metadata> {
  const [{ brandName }, t] = await Promise.all([
    getTenantBranding(),
    getTranslations("metadata"),
  ]);

  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`,
    },
    description: t("description", { brandName }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
