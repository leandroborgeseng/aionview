import { Card } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm opacity-80">Placeholder: preferências, filtros persistentes e configurações de classificação.</p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">`classification_rules` e (futuramente) parâmetros por organização/unidade/setor.</div>
      </Card>
    </div>
  );
}

