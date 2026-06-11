import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://djidahelectrique.com";
const siteName = "Djiddah Électronique";
const title = "Djiddah Électronique | Vente & Réparation de Téléphones à Dakar";
const description =
  "Boutique d'électronique premium à Dakar. Vente de smartphones neufs et service de réparation professionnel (écrans, batteries, pannes) rapide et garanti au Sénégal.";
const phoneNumber = "+221781131340";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "Electronics",
  keywords: [
    "Djiddah Électronique",
    "vente téléphone Dakar",
    "réparation téléphone Dakar",
    "réparation smartphone Sénégal",
    "iPhone Dakar",
    "smartphones Dakar",
    "accessoires téléphone Dakar",
    "boutique électronique Sénégal",
    "réparation écran téléphone Dakar",
    "réparation batterie téléphone Dakar",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: siteUrl,
    siteName,
    title,
    description,
    countryName: "Sénégal",
    images: [
      {
        url: "/images/hero-iphone.png",
        width: 1200,
        height: 630,
        alt: "Djiddah Électronique - Vente et réparation de téléphones à Dakar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-iphone.png"],
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
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      inLanguage: "fr-SN",
      publisher: {
        "@id": `${siteUrl}/#store`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ElectronicsStore",
      "@id": `${siteUrl}/#store`,
      name: siteName,
      legalName: "Djiddah Électronique",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      image: `${siteUrl}/images/hero-iphone.png`,
      telephone: phoneNumber,
      priceRange: "$$",
      description,
      currenciesAccepted: "XOF",
      paymentAccepted: "Cash, Wave, Orange Money",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dakar",
        addressRegion: "Dakar",
        addressCountry: "SN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 14.7167,
        longitude: -17.4677,
      },
      areaServed: [
        {
          "@type": "City",
          name: "Dakar",
        },
        {
          "@type": "Country",
          name: "Sénégal",
        },
      ],
      knowsAbout: [
        "Vente de smartphones",
        "Vente d'iPhone",
        "Accessoires électroniques",
        "Réparation de téléphones",
        "Remplacement d'écran",
        "Remplacement de batterie",
        "Diagnostic de pannes électroniques",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Produits et services Djiddah Électronique",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Smartphones et gadgets premium",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Product",
                  name: "Smartphones neufs et reconditionnés",
                  category: "Smartphones",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Product",
                  name: "Accessoires et gadgets électroniques",
                  category: "Electronics accessories",
                },
              },
            ],
          },
          {
            "@type": "OfferCatalog",
            name: "Réparation de smartphones et appareils électroniques",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Réparation d'écran de téléphone",
                  serviceType: "Mobile phone screen repair",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Remplacement de batterie de smartphone",
                  serviceType: "Mobile phone battery replacement",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Diagnostic et réparation de pannes électroniques",
                  serviceType: "Electronics repair diagnostics",
                },
              },
            ],
          },
        ],
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: phoneNumber,
          contactType: "customer service",
          areaServed: "SN",
          availableLanguage: ["fr", "wo"],
        },
      ],
      sameAs: [`https://wa.me/${phoneNumber.replace("+", "")}`],
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#mobile-repair-service`,
      name: "Réparation professionnelle de téléphones à Dakar",
      serviceType: "Mobile phone and electronics repair",
      provider: {
        "@id": `${siteUrl}/#store`,
      },
      areaServed: {
        "@type": "City",
        name: "Dakar",
      },
      description:
        "Service de réparation rapide et garanti pour smartphones et appareils électroniques à Dakar : écrans, batteries, connecteurs, diagnostics et pannes.",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "XOF",
        url: siteUrl,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-SN" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
