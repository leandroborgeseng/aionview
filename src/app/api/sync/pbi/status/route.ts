import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { normalizeEquipments, normalizeServiceOrders } from "@/server/services/pbi-normalizers";

function authorized(req: Request) {
  const configured = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const provided = req.headers.get("x-cron-secret") ?? url.searchParams.get("secret");
  return Boolean(configured && provided && configured === provided);
}

async function latest(endpoint: string) {
  return prisma.rawApiPayload.findFirst({
    where: { endpoint, status: "success" },
    orderBy: { receivedAt: "desc" },
    select: { receivedAt: true, payload: true, syncRunId: true },
  });
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [eq, dispMes, osAnalitico, osResumida] = await Promise.all([
    latest("equipamentos"),
    latest("disponibilidade_equipamento_mes_a_mes"),
    latest("listagem_analitica_das_os"),
    latest("listagem_analitica_das_os_resumida"),
  ]);

  const equipmentSource = eq ?? dispMes;
  const osSource = osAnalitico ?? osResumida;

  const equipmentItems = normalizeEquipments(equipmentSource?.payload ?? []);
  const osItems = normalizeServiceOrders(osSource?.payload ?? []);

  return NextResponse.json({
    ok: true,
    sources: {
      equipamentos: eq ? "equipamentos" : dispMes ? "disponibilidade_equipamento_mes_a_mes" : null,
      os: osAnalitico ? "listagem_analitica_das_os" : osResumida ? "listagem_analitica_das_os_resumida" : null,
    },
    latest: {
      equipamentosAt: equipmentSource?.receivedAt ?? null,
      osAt: osSource?.receivedAt ?? null,
      equipamentosSyncRunId: equipmentSource?.syncRunId ?? null,
      osSyncRunId: osSource?.syncRunId ?? null,
    },
    totals: {
      equipamentos: equipmentItems.length,
      os: osItems.length,
    },
    sample: {
      equipamento: equipmentItems[0] ?? null,
      os: osItems[0] ?? null,
    },
  });
}

