import { NextResponse } from "next/server";

import { getLatestPayloadByEndpoint } from "@/server/repositories/raw-payload-repository";
import { buildDashboardSummary } from "@/server/services/pbi-normalizers";

export async function GET() {
  const equipamentos = await getLatestPayloadByEndpoint("disponibilidade_equipamento_mes_a_mes");
  const osResumido = await getLatestPayloadByEndpoint("listagem_analitica_das_os_resumida");

  const summary = buildDashboardSummary({
    equipmentPayload: equipamentos?.payload ?? [],
    osPayload: osResumido?.payload ?? [],
    disponibilidadePayload: equipamentos?.payload ?? [],
    tmefPayload: [],
    tpmPayload: [],
  });

  const syncedAt = [equipamentos?.receivedAt, osResumido?.receivedAt]
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

  return NextResponse.json(
    {
      source: "raw_api_payloads",
      syncedAt,
      summary,
    },
    { status: 200 },
  );
}

