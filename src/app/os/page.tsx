"use client";

import Link from "next/link";
import { DataTable } from "@/components/common/DataTable";

type OsRow = {
  id: string;
  orderNumber: string;
  equipment: string;
  priority: string;
  status: string;
  lockCategory: string;
  ageDays: number;
};

const data: OsRow[] = Array.from({ length: 31 }).map((_, i) => ({
  id: `os-${i + 1}`,
  orderNumber: `OS-${String(i + 1).padStart(5, "0")}`,
  equipment: `Equipamento ${i % 6 === 0 ? "Crítico" : i + 1}`,
  priority: i % 3 === 0 ? "Alta" : i % 3 === 1 ? "Média" : "Baixa",
  status: i % 4 === 0 ? "Aguardando" : i % 4 === 1 ? "Em andamento" : "Aberta",
  lockCategory:
    i % 5 === 0
      ? "aguardando_compra"
      : i % 5 === 1
      ? "aguardando_peça"
      : i % 5 === 2
      ? "em_execucao"
      : i % 5 === 3
      ? "em_execucao"
      : "sem_tratativa_clara",
  ageDays: 2 + i * 3,
}));

const columns = [
  {
    accessorKey: "orderNumber",
    header: "Número",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "equipment",
    header: "Equipamento",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "lockCategory",
    header: "Lock (gerencial)",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "ageDays",
    header: "Idade (dias)",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "actions",
    header: "Ações",
    cell: (row: any) => (
      <Link className="text-primary hover:underline" href={`/os/${row.row.original.id}`}>
        Detalhes
      </Link>
    ),
  },
] as const;

export default function OsPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Ordens de Serviço Corretivas</h1>
        <p className="text-sm opacity-80">
          Placeholder: filtros por período/setor/oficina, SLA e classificação de lock.
        </p>
      </div>

      <DataTable columns={columns as any} data={data} getRowId={(r) => r.id} />
    </div>
  );
}

