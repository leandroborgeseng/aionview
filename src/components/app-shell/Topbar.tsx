"use client";

import { useSession } from "next-auth/react";

export function Topbar() {
  const { data } = useSession();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-background/70 backdrop-blur">
      <div className="flex items-center gap-3">
        <div>
          <img src="/brand/aion-wordmark.svg" alt="AION" className="h-8 w-auto" />
        </div>
      </div>

      <div className="text-sm opacity-80">
        {data?.user?.email ?? "—"}
      </div>
    </header>
  );
}

