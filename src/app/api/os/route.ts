import { NextResponse } from "next/server";

import { getLatestPayloadByEndpoint } from "@/server/repositories/raw-payload-repository";
import { normalizeServiceOrders } from "@/server/services/pbi-normalizers";

export async function GET() {
  const latestAnalitico = await getLatestPayloadByEndpoint("listagem_analitica_das_os");
  const latestResumido = await getLatestPayloadByEndpoint("listagem_analitica_das_os_resumida");
  const latest = latestAnalitico ?? latestResumido;

  if (!latest) {
    return NextResponse.json(
      {
        source: "raw_api_payloads",
        syncedAt: null,
        total: 0,
        items: [],
      },
      { status: 200 },
    );
  }

  const items = normalizeServiceOrders(latest.payload);
  return NextResponse.json(
    {
      source: "raw_api_payloads",
      syncedAt: latest.receivedAt,
      total: items.length,
      items,
    },
    { status: 200 },
  );
}

