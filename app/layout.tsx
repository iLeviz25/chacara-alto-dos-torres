import type { Metadata, Viewport } from "next";
import { hub } from "@/src/content/hub";
import "./globals.css";

const metadataBase = new URL(hub.seo.canonicalUrl ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: hub.seo.title,
  description: hub.seo.description,
  keywords: hub.seo.keywords,
  alternates: hub.seo.canonicalUrl
    ? { canonical: hub.seo.canonicalUrl }
    : undefined,
  icons: {
    icon: hub.seo.favicon,
    shortcut: hub.seo.favicon,
    apple: hub.seo.favicon,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: hub.seo.title,
    description: hub.seo.description,
    url: hub.seo.canonicalUrl ?? undefined,
    siteName: hub.seo.title,
  },
  twitter: {
    card: "summary",
    title: hub.seo.title,
    description: hub.seo.description,
  },
  robots: {
    index: hub.seo.robots.index,
    follow: hub.seo.robots.follow,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#343433",
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
