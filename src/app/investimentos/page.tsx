import { Card } from "@/components/ui/card";

export default function InvestimentosPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Plano de Investimentos</h1>
        <p className="text-sm opacity-80">Placeholder: carteira anual e histórico (previsto vs aprovado vs executado).</p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">`investment_plan_items` (tipo/status/prioridade e valores por período).</div>
      </Card>
    </div>
  );
}

