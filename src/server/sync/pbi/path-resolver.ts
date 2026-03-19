import type { PbiEndpointKey } from "@/server/integrations/pbi/endpoints";

export function resolvePbiPath(defaultPath: string, pathEnv: string): string {
  const custom = process.env[pathEnv];
  return custom?.trim() ? custom.trim() : defaultPath;
}

export type PbiQueryOverrides = {
  osPeriodo?: string;
  defaultPeriodo?: string;
  empresasIds?: string[];
  dataInicio?: string;
  dataFim?: string;
};

export function applyPbiEndpointQuery(
  endpoint: PbiEndpointKey,
  path: string,
  overrides?: PbiQueryOverrides,
): string {
  const current = new URL(path, "https://dummy.local");
  const params = current.searchParams;

  const defaultPeriodo =
    overrides?.defaultPeriodo?.trim() ||
    process.env.PBI_DEFAULT_PERIODO?.trim() ||
    "MesAtual";
  const defaultOsPeriodo =
    overrides?.osPeriodo?.trim() || process.env.PBI_OS_PERIODO?.trim() || "AnoCorrente";
  const defaultTipoManutencao =
    process.env.PBI_DEFAULT_TIPO_MANUTENCAO?.trim() || "Todos";
  const defaultDataInicio =
    overrides?.dataInicio?.trim() ||
    process.env.PBI_DEFAULT_DATA_INICIO?.trim() ||
    getDateOffsetIso(-30);
  const defaultDataFim =
    overrides?.dataFim?.trim() ||
    process.env.PBI_DEFAULT_DATA_FIM?.trim() ||
    getDateOffsetIso(0);
  const defaultCompanyId = process.env.PBI_COMPANY_ID?.trim();
  const defaultEmpresasIds =
    overrides?.empresasIds && overrides.empresasIds.length
      ? overrides.empresasIds
      : (process.env.PBI_EMPRESAS_IDS?.trim() || "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);

  switch (endpoint) {
    case "cronograma": {
      ensure(params, "dataInicio", defaultDataInicio);
      ensure(params, "dataFim", defaultDataFim);
      addMulti(params, "listaEmpresaId", defaultEmpresasIds);
      break;
    }
    case "tipo_manutencao": {
      ensure(params, "apenasAtivos", "true");
      ensure(params, "tipo", defaultTipoManutencao);
      break;
    }
    case "listagem_analitica_das_os":
    case "listagem_analitica_das_os_resumida": {
      ensure(params, "tipoManutencao", defaultTipoManutencao);
      ensure(params, "periodo", defaultOsPeriodo);
      ensure(params, "pagina", "0");
      ensure(params, "qtdPorPagina", "50000");
      addMulti(params, "listaEmpresaId", defaultEmpresasIds);
      break;
    }
    case "equipamentos": {
      ensure(params, "apenasAtivos", "true");
      ensure(params, "incluirComponentes", "false");
      ensure(params, "incluirCustoSubstituicao", "false");
      addMulti(params, "listaEmpresaId", defaultEmpresasIds);
      break;
    }
    case "tempo_medio_entre_falhas":
    case "tempo_de_parada_medio":
    case "disponibilidade_equipamento":
    case "monitor_reacao":
    case "monitor_atendimento": {
      ensure(params, "dataInicio", defaultDataInicio);
      ensure(params, "dataFim", defaultDataFim);
      addMulti(params, "listaEmpresaId", defaultEmpresasIds);
      addMulti(params, "listCompanyId", defaultEmpresasIds);
      break;
    }
    case "oficina": {
      if (defaultCompanyId) ensure(params, "companyId", defaultCompanyId);
      ensure(params, "apenasAtivos", "true");
      break;
    }
    case "disponibilidade_equipamento_mes_a_mes": {
      const periodo = process.env.PBI_DISP_MES_PERIODO?.trim() || defaultPeriodo;
      const dataInicio = process.env.PBI_DISP_MES_DATA_INICIO?.trim() || defaultDataInicio;
      const dataFim = process.env.PBI_DISP_MES_DATA_FIM?.trim() || defaultDataFim;
      addMulti(params, "empresasId", defaultEmpresasIds);
      if (periodo) ensure(params, "periodo", periodo);
      // Se periodo vier como Todos, API exige datas
      if ((params.get("periodo") || "").toLowerCase() === "todos") {
        ensure(params, "dataInicio", dataInicio);
        ensure(params, "dataFim", dataFim);
      }
      break;
    }
    case "anexos_equipamento":
    case "anexos_os": {
      addMulti(params, "filtros.empresaIds", defaultEmpresasIds);
      break;
    }
    default:
      break;
  }

  const finalPath = `${current.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  return finalPath;
}

function ensure(params: URLSearchParams, key: string, value: string) {
  if (!params.has(key) && value) params.set(key, value);
}

function addMulti(params: URLSearchParams, key: string, values: string[]) {
  if (params.has(key)) return;
  values.forEach((value) => params.append(key, value));
}

function getDateOffsetIso(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

