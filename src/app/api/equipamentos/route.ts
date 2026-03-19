import { NextResponse } from "next/server";

import { getLatestPayloadByEndpoint } from "@/server/repositories/raw-payload-repository";
import { normalizeEquipments } from "@/server/services/pbi-normalizers";

export async function GET() {
  const latest = await getLatestPayloadByEndpoint("disponibilidade_equipamento_mes_a_mes");

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

  const items = normalizeEquipments(latest.payload);
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

