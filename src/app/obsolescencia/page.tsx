import { Card } from "@/components/ui/card";

export default function ObsolescenciaPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Obsolescência e Risco Regulatário</h1>
        <p className="text-sm opacity-80">
          Placeholder: score de obsolescência + validade Anvisa + EOL/EOS.
        </p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">
          `obsolescence_profiles` + campos de `equipments` (endOfLife/endOfService/anvisaRegisterValidUntil).
        </div>
      </Card>
    </div>
  );
}

