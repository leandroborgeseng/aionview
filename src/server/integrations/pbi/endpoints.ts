export type PbiEndpointKey =
  | "cronograma"
  | "tipo_manutencao"
  | "listagem_analitica_das_os"
  | "listagem_analitica_das_os_resumida"
  | "equipamentos"
  | "tempo_medio_entre_falhas"
  | "tempo_de_parada_medio"
  | "disponibilidade_equipamento"
  | "monitor_reacao"
  | "monitor_atendimento"
  | "oficina"
  | "disponibilidade_equipamento_mes_a_mes"
  | "anexos_equipamento"
  | "anexos_os";

export const pbiEndpoints: Array<{
  key: PbiEndpointKey;
  path: string;
  apiKeyEnv: string;
  pathEnv: string;
}> = [
  {
    key: "cronograma",
    path: "/api/pbi/v1/cronograma",
    apiKeyEnv: "API_PBI_REL_CRONO_MANU",
    pathEnv: "PBI_PATH_CRONOGRAMA",
  },
  {
    key: "tipo_manutencao",
    path: "/api/pbi/v1/tipo_manutencao",
    apiKeyEnv: "API_PBI_TIP_MANU",
    pathEnv: "PBI_PATH_TIPO_MANUTENCAO",
  },
  {
    key: "listagem_analitica_das_os",
    path: "/api/pbi/v1/listagem_analitica_das_os",
    apiKeyEnv: "API_PBI_REL_OS_ANALITICO",
    pathEnv: "PBI_PATH_OS_ANALITICO",
  },
  {
    key: "listagem_analitica_das_os_resumida",
    path: "/api/pbi/v1/listagem_analitica_das_os_resumida",
    apiKeyEnv: "API_PBI_REL_OS_ANALITICO_RESUMIDO",
    pathEnv: "PBI_PATH_OS_ANALITICO_RESUMIDO",
  },
  {
    key: "equipamentos",
    path: "/api/pbi/v1/equipamentos",
    apiKeyEnv: "API_PBI_REL_EQUIPAMENTOS",
    pathEnv: "PBI_PATH_EQUIPAMENTOS",
  },
  {
    key: "tempo_medio_entre_falhas",
    path: "/api/pbi/v1/tempo_medio_entre_falhas",
    apiKeyEnv: "API_PBI_REL_TMEF",
    pathEnv: "PBI_PATH_TMEF",
  },
  {
    key: "tempo_de_parada_medio",
    path: "/api/pbi/v1/tempo_de_parada_medio",
    apiKeyEnv: "API_PBI_REL_TPM",
    pathEnv: "PBI_PATH_TPM",
  },
  {
    key: "disponibilidade_equipamento",
    path: "/api/pbi/v1/disponibilidade_equipamento",
    apiKeyEnv: "API_PBI_REL_DISP_EQUIPAMENTO",
    pathEnv: "PBI_PATH_DISPONIBILIDADE_EQUIPAMENTO",
  },
  {
    key: "monitor_reacao",
    path: "/api/pbi/v1/monitor_reacao",
    apiKeyEnv: "API_PBI_MONITOR_REACAO",
    pathEnv: "PBI_PATH_MONITOR_REACAO",
  },
  {
    key: "monitor_atendimento",
    path: "/api/pbi/v1/monitor_atendimento",
    apiKeyEnv: "API_PBI_MONITOR_ATENDIMENTO",
    pathEnv: "PBI_PATH_MONITOR_ATENDIMENTO",
  },
  {
    key: "oficina",
    path: "/api/pbi/v1/oficina",
    apiKeyEnv: "API_PBI_OFICINA",
    pathEnv: "PBI_PATH_OFICINA",
  },
  {
    key: "disponibilidade_equipamento_mes_a_mes",
    path: "/api/pbi/v1/disponibilidade_equipamento_mes_a_mes",
    apiKeyEnv: "API_PBI_REL_DISP_EQUIPAMENTO_MES",
    pathEnv: "PBI_PATH_DISPONIBILIDADE_EQUIPAMENTO_MES_A_MES",
  },
  {
    key: "anexos_equipamento",
    path: "/api/pbi/v1/anexos_equipamento",
    apiKeyEnv: "API_PBI_ANEXOS_EQUIPAMENTO",
    pathEnv: "PBI_PATH_ANEXOS_EQUIPAMENTO",
  },
  {
    key: "anexos_os",
    path: "/api/pbi/v1/anexos_os",
    apiKeyEnv: "API_PBI_ANEXOS_OS",
    pathEnv: "PBI_PATH_ANEXOS_OS",
  },
];

