import type { Metadata, Viewport } from "next";
import { Geist, Anton } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://gta6.xdeals.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GTA VI — Pré-venda XDeals | Reserve já por R$ 199,90 via PIX",
    template: "%s | XDeals GTA VI",
  },
  description:
    "Pré-venda exclusiva do GTA VI na XDeals. Lançamento em 19/11/2026. Primeiros 50 membros pagam apenas R$ 199,90 (mais de 50% OFF). Pagamento via PIX com confirmação instantânea.",
  keywords: [
    "GTA 6",
    "GTA VI",
    "pré-venda GTA 6",
    "comprar GTA 6",
    "GTA 6 preço",
    "GTA 6 Brasil",
    "XDeals",
    "PIX",
    "Vice City",
    "Rockstar Games",
    "pré-venda GTA VI",
  ],
  authors: [{ name: "XDeals", url: SITE_URL }],
  creator: "XDeals",
  publisher: "XDeals",
  applicationName: "XDeals GTA VI",
  category: "Games",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "GTA VI — Pré-venda XDeals | R$ 199,90 via PIX",
    description:
      "Reserve o GTA VI por R$ 199,90 (mais de 50% OFF para os primeiros 50). Lançamento 19/11/2026. Pagamento via PIX com confirmação instantânea.",
    url: SITE_URL,
    siteName: "XDeals GTA VI",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1344,
        height: 768,
        alt: "GTA VI — Pré-venda XDeals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA VI — Pré-venda XDeals | R$ 199,90 via PIX",
    description:
      "Reserve o GTA VI por R$ 199,90 (50% OFF). PIX instantâneo. Lançamento 19/11/2026.",
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0d0a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#product`,
      name: "Grand Theft Auto VI (GTA 6) — Pré-venda",
      description:
        "Pré-venda do GTA VI com cópia garantida no lançamento em 19 de novembro de 2026. Pagamento via PIX.",
      image: [`${SITE_URL}/images/og-banner.png`],
      brand: {
        "@type": "Brand",
        name: "Rockstar Games",
      },
      category: "Videogame",
      releaseDate: "2026-11-19",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BRL",
        lowPrice: "199.90",
        highPrice: "400.00",
        offerCount: 2,
        offers: [
          {
            "@type": "Offer",
            name: "Pré-venda XDeals — Primeiros 50 (50% OFF)",
            price: "199.90",
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            validFrom: "2026-06-22",
            url: SITE_URL,
          },
          {
            "@type": "Offer",
            name: "Pré-venda Oficial",
            price: "400.00",
            priceCurrency: "BRL",
            availability: "https://schema.org/PreOrder",
            validFrom: "2026-06-25",
            url: SITE_URL,
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "XDeals GTA VI",
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "XDeals",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-emblem.png`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body
        className={`${geistSans.variable} ${anton.variable} antialiased bg-background text-foreground min-h-screen overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
