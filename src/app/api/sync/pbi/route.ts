import { NextResponse } from "next/server";

import { runPbiSync } from "@/server/sync/pbi/runPbiSync";

export async function POST(req: Request) {
  const configured = process.env.CRON_SECRET;
  const provided = req.headers.get("x-cron-secret");

  if (!configured || !provided || provided !== configured) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Executa a sincronização de forma síncrona e retorna o resultado.
  // (No próximo passo podemos desacoplar em background/filas, mas já atende o Railway.)
  const result = await runPbiSync();
  return NextResponse.json(result, { status: 200 });
}

