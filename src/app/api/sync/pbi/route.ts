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
  const url = new URL(req.url);
  const includeAllEndpoints = url.searchParams.get("all") === "1";
  const osPeriodo = url.searchParams.get("osPeriodo") ?? undefined;
  const defaultPeriodo = url.searchParams.get("periodo") ?? undefined;
  const dataInicio = url.searchParams.get("dataInicio") ?? undefined;
  const dataFim = url.searchParams.get("dataFim") ?? undefined;
  const empresasIds = (url.searchParams.get("empresasIds") ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  // Executa a sincronização de forma síncrona e retorna o resultado.
  // (No próximo passo podemos desacoplar em background/filas, mas já atende o Railway.)
  const result = await runPbiSync({
    includeAllEndpoints,
    queryOverrides: {
      osPeriodo,
      defaultPeriodo,
      dataInicio,
      dataFim,
      empresasIds,
    },
  });
  return NextResponse.json(result, { status: 200 });
}

export async function POST(req: Request) {
  return handleSync(req);
}

export async function GET(req: Request) {
  return handleSync(req);
}

