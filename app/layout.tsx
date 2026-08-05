import type { Metadata, Viewport } from "next";
import { property } from "@/src/content/property";
import "./globals.css";

const metadataBase = new URL(property.seo.canonicalUrl ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: property.seo.title,
  description: property.seo.description,
  keywords: property.seo.keywords,
  alternates: property.seo.canonicalUrl
    ? { canonical: property.seo.canonicalUrl }
    : undefined,
  icons: {
    icon: property.seo.favicon,
    shortcut: property.seo.favicon,
    apple: property.seo.favicon,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: property.seo.openGraph.title,
    description: property.seo.openGraph.description,
    url: property.seo.canonicalUrl ?? undefined,
    siteName: property.propertyName,
    images: [
      {
        url: property.seo.openGraph.image,
        width: 1536,
        height: 1024,
        alt: property.seo.openGraph.imageAlt,
      },
    ],
  },
  twitter: {
    card: property.seo.twitter.card,
    title: property.seo.twitter.title,
    description: property.seo.twitter.description,
    images: [property.seo.twitter.image],
  },
  robots: {
    index: property.seo.robots.index,
    follow: property.seo.robots.follow,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d293c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
