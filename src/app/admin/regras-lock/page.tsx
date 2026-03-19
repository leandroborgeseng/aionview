import { Card } from "@/components/ui/card";

export default function AdminRegrasLockPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Admin - Regras de Lock</h1>
        <p className="text-sm opacity-80">Placeholder: CRUD de `classification_rules` e evidências do motor de classificação.</p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Próximo passo</div>
        <div className="text-sm opacity-70 mt-2">
          Implementar serviço de classificação de lock + fallback heurístico e gravar evidências em `lock_classifications`.
        </div>
      </Card>
    </div>
  );
}

