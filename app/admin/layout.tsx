import type { Metadata } from "next";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Painel administrativo",
    template: "%s | Painel administrativo",
  },
  description: "Área administrativa privada dos sites.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-root">{children}</div>;
}
