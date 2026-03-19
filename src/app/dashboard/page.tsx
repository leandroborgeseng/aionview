"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type DashboardSummary = {
  totalEquipamentos: number;
  totalOsPeriodo: number;
  osCorretivasAbertas: number;
  osTravadas: number;
  disponibilidadeMedia: number;
  tmefMedio: number;
  tpmMedio: number;
  osByMonth: Array<{ month: string; count: number }>;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalEquipamentos: 0,
    totalOsPeriodo: 0,
    osCorretivasAbertas: 0,
    osTravadas: 0,
    disponibilidadeMedia: 0,
    tmefMedio: 0,
    tpmMedio: 0,
    osByMonth: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar dashboard");
        const json = (await res.json()) as { summary: DashboardSummary };
        if (!active) return;
        setSummary(json.summary);
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

  const kpiCards = useMemo(
    () => [
      { label: "Total de Equipamentos", value: summary.totalEquipamentos },
      { label: "Total de OS no Período", value: summary.totalOsPeriodo },
      { label: "OS Corretivas Abertas", value: summary.osCorretivasAbertas },
      { label: "OS Travadas", value: summary.osTravadas },
      { label: "Disponibilidade Média", value: summary.disponibilidadeMedia },
      { label: "TMEF Médio", value: summary.tmefMedio },
      { label: "TPM Médio", value: summary.tpmMedio },
    ],
    [summary],
  );

  const osByMonth = summary.osByMonth.length
    ? summary.osByMonth
    : [
        { month: "Jan", count: 0 },
        { month: "Fev", count: 0 },
        { month: "Mar", count: 0 },
      ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Geral</h1>
        <p className="text-sm opacity-80">
          Visão operacional e executiva da Engenharia Clínica.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="text-sm opacity-80">{c.label}</div>
            <div className="text-2xl font-semibold mt-2">{loading ? "-" : c.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">OS por mês</div>
              <div className="text-base font-medium mt-1">
                Preventivas x Corretivas (placeholder)
              </div>
            </div>
          </div>

          <div className="h-80 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={osByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {error ? <div className="text-sm text-destructive mt-2">{error}</div> : null}
        </Card>

        <Card className="p-4">
          <div className="text-sm opacity-80">Notas</div>
          <div className="mt-2 text-sm leading-relaxed">
            Este dashboard já está pronto para evoluir incrementalmente:
            primeiro conectaremos as leituras do banco (equipamentos/OS/snaphots)
            e depois implementaremos os demais módulos (MEL, MEL por área,
            disponibilidade, obsolescência, contratos e compras).
          </div>
        </Card>
      </div>
    </div>
  );
}

