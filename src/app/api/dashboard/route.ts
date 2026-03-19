import { NextResponse } from "next/server";

import { getLatestPayloadByEndpoint } from "@/server/repositories/raw-payload-repository";
import { buildDashboardSummary } from "@/server/services/pbi-normalizers";

export async function GET() {
  const equipamentos =
    (await getLatestPayloadByEndpoint("equipamentos")) ??
    (await getLatestPayloadByEndpoint("disponibilidade_equipamento_mes_a_mes"));
  const osAnalitico = await getLatestPayloadByEndpoint("listagem_analitica_das_os");
  const osResumido = await getLatestPayloadByEndpoint("listagem_analitica_das_os_resumida");
  const disponibilidade = await getLatestPayloadByEndpoint("disponibilidade_equipamento");
  const tmef = await getLatestPayloadByEndpoint("tempo_medio_entre_falhas");
  const tpm = await getLatestPayloadByEndpoint("tempo_de_parada_medio");

  const summary = buildDashboardSummary({
    equipmentPayload: equipamentos?.payload ?? [],
    osPayload: (osAnalitico ?? osResumido)?.payload ?? [],
    disponibilidadePayload: disponibilidade?.payload ?? [],
    tmefPayload: tmef?.payload ?? [],
    tpmPayload: tpm?.payload ?? [],
  });

  const syncedAt = [
    equipamentos?.receivedAt,
    osAnalitico?.receivedAt,
    osResumido?.receivedAt,
    disponibilidade?.receivedAt,
    tmef?.receivedAt,
    tpm?.receivedAt,
  ]
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

