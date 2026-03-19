import { Card } from "@/components/ui/card";

export default async function OsDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">OS Corretiva</h1>
        <p className="text-sm opacity-80">ID: {id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-1">
          <div className="font-medium">Dados principais (placeholder)</div>
          <div className="text-sm opacity-70 mt-2">
            Conectar em `service_orders` + `service_order_snapshots` (timeline).
          </div>
        </Card>
        <Card className="p-4 lg:col-span-2">
          <div className="font-medium">Timeline baseada em snapshots</div>
          <div className="text-sm opacity-70 mt-2">
            Próximo passo incremental: renderizar eventos com base em `ServiceOrderSnapshot.raw`
            e aplicar engine de lock + risco assistencial.
          </div>
        </Card>
      </div>
    </div>
  );
}

