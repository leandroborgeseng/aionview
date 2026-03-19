import { Card } from "@/components/ui/card";

export default function MelPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">MEL por Área</h1>
        <p className="text-sm opacity-80">
          Placeholder: cruzar `mel_definitions/mel_items` com indisponibilidade e backup/filhos únicos.
        </p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Indicadores iniciais</div>
        <div className="text-sm opacity-70 mt-2">
          `setores abaixo do MEL`, itens críticos sem cobertura e impacto assistencial potencial.
        </div>
      </Card>
    </div>
  );
}

