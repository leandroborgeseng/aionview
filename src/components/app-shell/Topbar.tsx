"use client";

import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";

export function Topbar({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const { data } = useSession();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-background/70 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={onOpenMenu}
          className="lg:hidden rounded-md border px-2 py-1 text-foreground/70 hover:bg-foreground/5"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <img src="/brand/aion-wordmark.svg" alt="AION" className="h-8 w-auto" />
        </div>
      </div>

      <div className="hidden sm:block text-sm opacity-80">
        {data?.user?.email ?? "—"}
      </div>
    </header>
  );
}

