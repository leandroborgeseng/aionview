import { Card } from "@/components/ui/card";

export default function PreventivasPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Preventivas, Calibração e TSE</h1>
        <p className="text-sm opacity-80">
          Placeholder: previsto vs realizado, atrasos e percentual por período.
        </p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">
          `maintenance_schedule` (type = preventiva/calibracao/tse), por setor/oficina/equipamento.
        </div>
      </Card>
    </div>
  );
}

