import { Card } from "@/components/ui/card";

export default function BackupsPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Backup e Filhos Únicos</h1>
        <p className="text-sm opacity-80">
          Placeholder: identificar falta de redundância e riscos assistenciais.
        </p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">
          Campos de `equipments` (hasBackup, backupQuantity, isChildUnique) + cruzamento com MEL e indisponibilidade.
        </div>
      </Card>
    </div>
  );
}

