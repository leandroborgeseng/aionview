import { NextResponse } from "next/server";

import { runPbiSync } from "@/server/sync/pbi/runPbiSync";

async function authorizeCron(req: Request) {
  const configured = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const provided =
    req.headers.get("x-cron-secret") ?? url.searchParams.get("secret");

  if (!configured || !provided || provided !== configured) {
    return false;
  }
  return true;
}

async function handleSync(req: Request) {
  const authorized = await authorizeCron(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Executa a sincronização de forma síncrona e retorna o resultado.
  // (No próximo passo podemos desacoplar em background/filas, mas já atende o Railway.)
  const result = await runPbiSync();
  return NextResponse.json(result, { status: 200 });
}

export async function POST(req: Request) {
  return handleSync(req);
}

export async function GET(req: Request) {
  return handleSync(req);
}

