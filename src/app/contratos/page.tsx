import { Card } from "@/components/ui/card";

export default function ContratosPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Contratos</h1>
        <p className="text-sm opacity-80">Placeholder: manutenção e locação, custos, fornecedores e contratos a vencer.</p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">`contracts` (type = manutencao/locacao).</div>
      </Card>
    </div>
  );
}

