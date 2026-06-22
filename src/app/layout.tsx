import type { Metadata } from "next";
import { Geist, Anton } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTA VI — Pré-venda XDeals | Reserve já por R$ 199,90",
  description:
    "Pré-venda exclusiva do GTA VI na XDeals. Lançamento em 19/11/2026. Primeiros 50 membros pagam apenas R$ 199,90 (mais de 50% OFF). Pagamento via PIX com confirmação instantânea.",
  keywords: [
    "GTA 6",
    "GTA VI",
    "pré-venda GTA 6",
    "XDeals",
    "comprar GTA 6",
    "PIX",
    "Vice City",
  ],
  authors: [{ name: "XDeals" }],
  openGraph: {
    title: "GTA VI — Pré-venda XDeals",
    description:
      "Reserve o GTA VI por R$ 199,90 (50% OFF para os primeiros 50). Lançamento 19/11/2026. Pagamento via PIX.",
    url: "https://gta6.xdeals.online",
    siteName: "XDeals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA VI — Pré-venda XDeals",
    description: "Reserve o GTA VI por R$ 199,90 (50% OFF). PIX instantâneo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${anton.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
