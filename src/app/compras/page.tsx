import { Card } from "@/components/ui/card";

export default function ComprasPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Solicitações de Compra</h1>
        <p className="text-sm opacity-80">
          Placeholder: fluxo de status + aprovações técnicas/gerenciais.
        </p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">
          `purchase_requests` + `purchase_request_approvals`, com histórico completo e filtros por prioridade/setor/OS travada.
        </div>
      </Card>
    </div>
  );
}

