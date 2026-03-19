"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

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

export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/45 lg:hidden"
        />
      ) : null}
      <aside
        className={[
          "w-72 border-r bg-background/90 backdrop-blur z-40",
          "fixed inset-y-0 left-0 transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:flex lg:flex-col",
        ].join(" ")}
      >
        <div className="px-4 py-4 border-b flex items-center justify-between">
        <img src="/brand/aion-wordmark.svg" alt="AION" className="h-10 w-auto" />
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="lg:hidden rounded-md border px-2 py-1 text-foreground/70 hover:bg-foreground/5"
          >
            <X className="h-4 w-4" />
          </button>
      </div>
      <nav className="px-2 pb-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
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
    </>
  );
}

