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
}> = [
  { key: "cronograma", path: "/api/pbi/v1/cronograma", apiKeyEnv: "API_PBI_REL_CRONO_MANU" },
  { key: "tipo_manutencao", path: "/api/pbi/v1/tipo_manutencao", apiKeyEnv: "API_PBI_TIP_MANU" },
  {
    key: "listagem_analitica_das_os",
    path: "/api/pbi/v1/listagem_analitica_das_os",
    apiKeyEnv: "API_PBI_REL_OS_ANALITICO",
  },
  {
    key: "listagem_analitica_das_os_resumida",
    path: "/api/pbi/v1/listagem_analitica_das_os_resumida",
    apiKeyEnv: "API_PBI_REL_OS_ANALITICO_RESUMIDO",
  },
  {
    key: "equipamentos",
    path: "/api/pbi/v1/equipamentos",
    apiKeyEnv: "API_PBI_REL_EQUIPAMENTOS",
  },
  {
    key: "tempo_medio_entre_falhas",
    path: "/api/pbi/v1/tempo_medio_entre_falhas",
    apiKeyEnv: "API_PBI_REL_TMEF",
  },
  {
    key: "tempo_de_parada_medio",
    path: "/api/pbi/v1/tempo_de_parada_medio",
    apiKeyEnv: "API_PBI_REL_TPM",
  },
  {
    key: "disponibilidade_equipamento",
    path: "/api/pbi/v1/disponibilidade_equipamento",
    apiKeyEnv: "API_PBI_REL_DISP_EQUIPAMENTO",
  },
  {
    key: "monitor_reacao",
    path: "/api/pbi/v1/monitor_reacao",
    apiKeyEnv: "API_PBI_MONITOR_REACAO",
  },
  {
    key: "monitor_atendimento",
    path: "/api/pbi/v1/monitor_atendimento",
    apiKeyEnv: "API_PBI_MONITOR_ATENDIMENTO",
  },
  { key: "oficina", path: "/api/pbi/v1/oficina", apiKeyEnv: "API_PBI_OFICINA" },
  {
    key: "disponibilidade_equipamento_mes_a_mes",
    path: "/api/pbi/v1/disponibilidade_equipamento_mes_a_mes",
    apiKeyEnv: "API_PBI_REL_DISP_EQUIPAMENTO_MES",
  },
  {
    key: "anexos_equipamento",
    path: "/api/pbi/v1/anexos_equipamento",
    apiKeyEnv: "API_PBI_ANEXOS_EQUIPAMENTO",
  },
  { key: "anexos_os", path: "/api/pbi/v1/anexos_os", apiKeyEnv: "API_PBI_ANEXOS_OS" },
];

