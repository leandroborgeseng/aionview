import type { PbiEndpointKey } from "@/server/integrations/pbi/endpoints";

export function resolvePbiPath(defaultPath: string, pathEnv: string): string {
  const custom = process.env[pathEnv];
  return custom?.trim() ? custom.trim() : defaultPath;
}

export function applyPbiEndpointQuery(endpoint: PbiEndpointKey, path: string): string {
  if (endpoint !== "disponibilidade_equipamento_mes_a_mes") return path;

  const periodo = process.env.PBI_DISP_MES_PERIODO?.trim();
  const dataInicio = process.env.PBI_DISP_MES_DATA_INICIO?.trim();
  const dataFim = process.env.PBI_DISP_MES_DATA_FIM?.trim();

  const params = new URLSearchParams();
  if (periodo) params.set("periodo", periodo);
  if (dataInicio) params.set("data_inicio", dataInicio);
  if (dataFim) params.set("data_fim", dataFim);

  if (!params.toString()) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${params.toString()}`;
}

