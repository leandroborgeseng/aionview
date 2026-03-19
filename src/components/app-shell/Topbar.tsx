"use client";

import { useSession } from "next-auth/react";

export function Topbar() {
  const { data } = useSession();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-background/60 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center font-bold">
          A
        </div>
        <div>
          <div className="font-semibold leading-tight">Engenharia Clínica</div>
          <div className="text-xs opacity-70">Transparência e Governança</div>
        </div>
      </div>

      <div className="text-sm opacity-80">
        {data?.user?.email ?? "—"}
      </div>
    </header>
  );
}

