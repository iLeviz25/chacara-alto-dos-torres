"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ImageIcon,
  LayoutDashboard,
  Palette,
  PartyPopper,
  Settings,
  Trees,
} from "lucide-react";

const navigationItems = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/metricas", label: "Métricas", icon: BarChart3 },
  {
    href: "/admin/chacara-alto-dos-torres",
    label: "Chácara Alto dos Torres",
    icon: Trees,
  },
  {
    href: "/admin/espaco-fernandes",
    label: "Espaço Fernandes",
    icon: PartyPopper,
  },
  { href: "/admin/midia", label: "Mídia", icon: ImageIcon },
  { href: "/admin/aparencia", label: "Aparência", icon: Palette },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="admin-navigation" aria-label="Navegação administrativa">
      {navigationItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/admin" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "is-active" : undefined}
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
