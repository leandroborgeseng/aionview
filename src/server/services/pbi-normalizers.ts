type Dict = Record<string, unknown>;

function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const obj = payload as Dict;
  const candidateKeys = [
    "data",
    "items",
    "Itens",
    "itens",
    "results",
    "value",
    "rows",
    "content",
  ];
  for (const key of candidateKeys) {
    const value = obj[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function asRecord(input: unknown): Dict | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  return input as Dict;
}

function pickString(record: Dict, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function pickNumber(record: Dict, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "");
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

function pickDate(record: Dict, keys: string[]): Date | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date;
    }
  }
  return null;
}

export type NormalizedEquipment = {
  id: string;
  tag: string;
  patrimonio: string;
  serialNumber: string;
  name: string;
  sector: string;
};

export function normalizeEquipments(payload: unknown): NormalizedEquipment[] {
  const rows = asArray(payload);

  return rows
    .map((row, index) => {
      const r = asRecord(row);
      if (!r) return null;

      const tag = pickString(r, ["Tag", "tag", "TAG", "CodigoTag", "Codigo", "Code"]);
      const patrimonio = pickString(r, ["Patrimonio", "patrimonio", "Asset", "asset"]);
      const serialNumber = pickString(r, [
        "NumeroSerie",
        "numeroSerie",
        "NumeroDeSerie",
        "serialNumber",
        "SerialNumber",
      ]);
      const name = pickString(r, ["NomeEquipamento", "nomeEquipamento", "Equipamento", "Nome", "name"], "Sem nome");
      const sector = pickString(r, ["Setor", "setor", "Departamento", "department"], "Não informado");

      const id =
        pickString(r, ["id", "Id", "ID", "CodigoEquipamento", "codigoEquipamento"]) ||
        `${tag || patrimonio || serialNumber || "eq"}-${index}`;

      return { id, tag, patrimonio, serialNumber, name, sector };
    })
    .filter((x): x is NormalizedEquipment => !!x);
}

export type NormalizedServiceOrder = {
  id: string;
  orderNumber: string;
  equipment: string;
  priority: string;
  status: string;
  lockCategory: string;
  ageDays: number;
  openedAt: Date | null;
};

export function normalizeServiceOrders(payload: unknown): NormalizedServiceOrder[] {
  const rows = asArray(payload);
  const now = Date.now();

  return rows
    .map((row, index) => {
      const r = asRecord(row);
      if (!r) return null;

      const orderNumber = pickString(r, ["NumeroOS", "numeroOS", "OS", "os", "orderNumber"], `OS-${index + 1}`);
      const equipment = pickString(r, ["Equipamento", "equipamento", "NomeEquipamento", "nomeEquipamento"], "Não informado");
      const priority = pickString(r, ["Prioridade", "prioridade", "priority"], "Não informado");
      const status = pickString(r, ["Status", "status"], "Não informado");
      const situacao = pickString(r, ["SituacaoDaOS", "situacaoDaOS", "situacao"], "");
      const pendencia = pickString(r, ["Pendencia", "pendencia"], "");

      const openedAt = pickDate(r, ["DataAbertura", "dataAbertura", "CreatedAt", "createdAt", "DataCriacao"]);
      const ageDays = openedAt
        ? Math.max(0, Math.floor((now - openedAt.getTime()) / (1000 * 60 * 60 * 24)))
        : pickNumber(r, ["IdadeDias", "idadeDias", "AgeDays"], 0);

      const lockCategory = classifyLock(status, situacao, pendencia);

      const id =
        pickString(r, ["id", "Id", "ID", "CodigoOS", "codigoOS"]) ||
        `${orderNumber}-${index}`;

      return {
        id,
        orderNumber,
        equipment,
        priority,
        status,
        lockCategory,
        ageDays,
        openedAt,
      };
    })
    .filter((x): x is NormalizedServiceOrder => !!x);
}

function classifyLock(status: string, situacao: string, pendencia: string): string {
  const s = `${status} ${situacao} ${pendencia}`.toLowerCase();
  if (s.includes("compra")) return "aguardando_compra";
  if (s.includes("peça") || s.includes("peca")) return "aguardando_peca";
  if (s.includes("fornecedor")) return "aguardando_fornecedor";
  if (s.includes("concl")) return "concluida";
  if (s.includes("cancel")) return "cancelada";
  if (s.includes("execu") || s.includes("andamento")) return "em_execucao";
  if (s.includes("aguard")) return "aguardando_tratativa";
  return "sem_tratativa_clara";
}

export type DashboardSummary = {
  totalEquipamentos: number;
  totalOsPeriodo: number;
  osCorretivasAbertas: number;
  osTravadas: number;
  disponibilidadeMedia: number;
  tmefMedio: number;
  tpmMedio: number;
  osByMonth: Array<{ month: string; count: number }>;
};

export function buildDashboardSummary(params: {
  equipmentPayload: unknown;
  osPayload: unknown;
  disponibilidadePayload: unknown;
  tmefPayload: unknown;
  tpmPayload: unknown;
}): DashboardSummary {
  const equipments = normalizeEquipments(params.equipmentPayload);
  const orders = normalizeServiceOrders(params.osPayload);

  const osByMonthMap = new Map<string, number>();
  for (const os of orders) {
    const month = os.openedAt
      ? os.openedAt.toLocaleDateString("pt-BR", { month: "short" })
      : "N/D";
    osByMonthMap.set(month, (osByMonthMap.get(month) ?? 0) + 1);
  }

  return {
    totalEquipamentos: equipments.length,
    totalOsPeriodo: orders.length,
    osCorretivasAbertas: orders.filter((o) => !/concl|cancel/i.test(o.status)).length,
    osTravadas: orders.filter((o) => o.lockCategory !== "em_execucao" && o.lockCategory !== "concluida").length,
    disponibilidadeMedia: averageFromPayload(params.disponibilidadePayload),
    tmefMedio: averageFromPayload(params.tmefPayload),
    tpmMedio: averageFromPayload(params.tpmPayload),
    osByMonth: Array.from(osByMonthMap.entries()).map(([month, count]) => ({ month, count })),
  };
}

function averageFromPayload(payload: unknown): number {
  const rows = asArray(payload);
  const values: number[] = [];
  for (const row of rows) {
    const r = asRecord(row);
    if (!r) continue;
    const value = pickNumber(r, ["valor", "Valor", "value", "Media", "media", "Percentual", "percentual"], Number.NaN);
    if (Number.isFinite(value)) values.push(value);
  }
  if (!values.length) return 0;
  const avg = values.reduce((acc, n) => acc + n, 0) / values.length;
  return Number(avg.toFixed(2));
}

