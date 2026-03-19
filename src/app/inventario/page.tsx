import { Card } from "@/components/ui/card";

export default function InventarioPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Inventário com Auditoria</h1>
        <p className="text-sm opacity-80">Placeholder: auditorias por equipamento, divergências e status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="font-medium">Aguardando conferência</div>
          <div className="text-sm opacity-70 mt-2">Conectar em `inventory_audits` e `inventory_audit_items`.</div>
        </Card>
        <Card className="p-4">
          <div className="font-medium">Divergências para engenharia clínica</div>
          <div className="text-sm opacity-70 mt-2">Conectar em status e trilha de observações.</div>
        </Card>
      </div>
    </div>
  );
}

