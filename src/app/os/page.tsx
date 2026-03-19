"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const [data, setData] = useState<OsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/os", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar OS");
        const json = (await res.json()) as { items: OsRow[] };
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
    if (loading) return <div className="text-sm opacity-70">Carregando ordens de serviço...</div>;
    if (error) return <div className="text-sm text-destructive">{error}</div>;
    if (!data.length) {
      return (
        <div className="text-sm rounded-md border bg-card px-4 py-3">
          Nenhuma OS disponível no endpoint ativo para o período atual.
        </div>
      );
    }
    return <DataTable columns={columns as any} data={data} getRowId={(r) => r.id} />;
  }, [loading, error, data]);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Ordens de Serviço Corretivas</h1>
        <p className="text-sm opacity-80">
          Placeholder: filtros por período/setor/oficina, SLA e classificação de lock.
        </p>
      </div>

      {content}
    </div>
  );
}

