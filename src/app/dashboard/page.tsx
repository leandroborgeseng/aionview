"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const kpiCards = [
  { label: "Total de Equipamentos", value: 0 },
  { label: "Total de OS no Período", value: 0 },
  { label: "OS Corretivas Abertas", value: 0 },
  { label: "OS Vencidas", value: 0 },
  { label: "OS Travadas", value: 0 },
  { label: "Disponibilidade Média", value: 0 },
  { label: "TMEF Médio", value: 0 },
  { label: "TPM Médio", value: 0 },
];

const osByMonth = [
  { month: "Jan", count: 0 },
  { month: "Fev", count: 0 },
  { month: "Mar", count: 0 },
  { month: "Abr", count: 0 },
  { month: "Mai", count: 0 },
  { month: "Jun", count: 0 },
];

export default function DashboardPage() {
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
            <div className="text-2xl font-semibold mt-2">{c.value}</div>
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

