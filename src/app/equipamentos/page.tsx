"use client";

import Link from "next/link";
import { DataTable } from "@/components/common/DataTable";

type EquipmentRow = {
  id: string;
  tag: string;
  patrimonio: string;
  serialNumber: string;
  name: string;
  sector: string;
};

const data: EquipmentRow[] = Array.from({ length: 23 }).map((_, i) => ({
  id: `eq-${i + 1}`,
  tag: `TAG-${i + 1}`,
  patrimonio: `PAT-${(i + 1) * 10}`,
  serialNumber: `SN-${i + 1}`,
  name: `Equipamento ${i + 1}`,
  sector: i % 2 === 0 ? "Setor Principal" : "Setor Secundário",
}));

const columns = [
  {
    accessorKey: "tag",
    header: "Tag",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "patrimonio",
    header: "Patrimônio",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "serialNumber",
    header: "Número de Série",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "sector",
    header: "Setor",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "actions",
    header: "Ações",
    cell: (row: any) => (
      <Link className="text-primary hover:underline" href={`/equipamentos/${row.row.original.id}`}>
        Abrir
      </Link>
    ),
  },
] as const;

export default function EquipamentosPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Inventário - Equipamentos</h1>
        <p className="text-sm opacity-80">Lista por setor com estrutura pronta para auditoria.</p>
      </div>

      <DataTable columns={columns as any} data={data} getRowId={(r) => r.id} />
    </div>
  );
}

