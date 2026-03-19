import { Card } from "@/components/ui/card";

export default async function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Equipamento</h1>
        <p className="text-sm opacity-80">ID: {id}</p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Prontuário técnico (placeholder)</div>
        <div className="text-sm opacity-70 mt-2">
          Próximo passo incremental: carregar dados do inventário, histórico de OS, disponibilidade,
          custos e anexos, além de calcular risco assistencial/obsolescência.
        </div>
      </Card>
    </div>
  );
}

