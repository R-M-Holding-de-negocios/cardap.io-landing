import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cardap.io — Cardápio digital e atendimento de mesas",
  description:
    "Cardápio digital com QR Code e NFC, pedidos e atendimento de mesas para bares e restaurantes.",
  keywords: [
    "cardapio nfc",
    "anfc cardapios",
    "chamar garcom",
    "qr code mesa",
    "cardapio digital",
    "nfc restaurante",
    "gestao de salao",
  ],
  authors: [{ name: "Anfc Cardapios" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#121212",
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
