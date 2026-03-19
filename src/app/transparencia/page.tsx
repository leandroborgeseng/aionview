import { Card } from "@/components/ui/card";

export default function TransparenciaPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Transparência das Ações</h1>
        <p className="text-sm opacity-80">Placeholder: manutenções/preventivas/calibrações/TSE/OS em andamento/pedências/compras e contratos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="font-medium">Indicadores por setor</div>
          <div className="text-sm opacity-70 mt-2">Conectar em `equipments/service_orders/availability_metrics`.</div>
        </Card>
        <Card className="p-4">
          <div className="font-medium">Auditoria</div>
          <div className="text-sm opacity-70 mt-2">Conectar em `audit_logs` e `sync_runs`.</div>
        </Card>
        <Card className="p-4">
          <div className="font-medium">Notificações</div>
          <div className="text-sm opacity-70 mt-2">Conectar em `notifications`.</div>
        </Card>
      </div>
    </div>
  );
}

