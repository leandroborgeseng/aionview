"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: Array<{ href: string; label: string }> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/equipamentos", label: "Equipamentos" },
  { href: "/inventario", label: "Inventário" },
  { href: "/os", label: "OS Corretivas" },
  { href: "/preventivas", label: "Preventivas/Calibração/TSE" },
  { href: "/disponibilidade", label: "Disponibilidade" },
  { href: "/mel", label: "MEL por Área" },
  { href: "/obsolescencia", label: "Obsolescência" },
  { href: "/backups", label: "Backups/FIlhos Únicos" },
  { href: "/contratos", label: "Contratos" },
  { href: "/compras", label: "Compras" },
  { href: "/investimentos", label: "Investimentos" },
  { href: "/transparencia", label: "Transparência" },
  { href: "/configuracoes", label: "Configurações" },
  { href: "/admin/usuarios", label: "Admin - Usuários" },
  { href: "/admin/regras-lock", label: "Admin - Regras Lock" },
  { href: "/admin/checklists", label: "Admin - Checklists" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 hidden lg:flex lg:flex-col border-r bg-background/50">
      <div className="px-4 py-4 font-semibold">AionView</div>
      <nav className="px-2 pb-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/80 hover:bg-foreground/5",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

