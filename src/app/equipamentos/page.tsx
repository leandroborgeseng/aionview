"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/common/DataTable";

type EquipmentRow = {
  id: string;
  tag: string;
  patrimonio: string;
  serialNumber: string;
  name: string;
  sector: string;
};

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
  const [data, setData] = useState<EquipmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/equipamentos", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar equipamentos");
        const json = (await res.json()) as { items: EquipmentRow[] };
        if (!active) return;
        setData(json.items ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Erro inesperado");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) return <div className="text-sm opacity-70">Carregando equipamentos...</div>;
    if (error) return <div className="text-sm text-destructive">{error}</div>;
    return <DataTable columns={columns as any} data={data} getRowId={(r) => r.id} />;
  }, [loading, error, data]);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Inventário - Equipamentos</h1>
        <p className="text-sm opacity-80">Lista por setor com estrutura pronta para auditoria.</p>
      </div>

      {content}
    </div>
  );
}

