import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "cardap.io — Cardápio digital e atendimento de mesas";
const description =
  "Cardápio digital com QR Code e NFC, pedidos e atendimento de mesas para bares e restaurantes.";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl = configuredSiteUrl ? new URL(configuredSiteUrl) : null;
const socialImageUrl = siteUrl ? new URL("/og-cardapio.png", siteUrl).toString() : null;

export const metadata: Metadata = {
  title,
  description,
  applicationName: "cardap.io",
  metadataBase: siteUrl ?? undefined,
  robots: siteUrl ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title,
    description,
    siteName: "cardap.io",
    locale: "pt_BR",
    type: "website",
    ...(socialImageUrl ? { images: [{ url: socialImageUrl, width: 1200, height: 630, alt: "cardap.io: cardápio digital e atendimento" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
  },
  keywords: [
    "cardapio nfc",
    "chamar garcom",
    "qr code mesa",
    "cardapio digital",
    "nfc restaurante",
    "gestao de salao",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#fff8f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <body
        className="min-h-screen antialiased selection:bg-orange-500 selection:text-black"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
