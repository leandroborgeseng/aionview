"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/app-shell/Sidebar";
import { Topbar } from "@/components/app-shell/Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mantém login "limpo".
  if (pathname.startsWith("/login")) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 bg-background">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}

