import { Card } from "@/components/ui/card";

export default function DisponibilidadePage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Disponibilidade e Confiabilidade</h1>
        <p className="text-sm opacity-80">
          Placeholder: filtros + ranking + cruzamentos com MEL e backup/filhos únicos.
        </p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">
          `availability_metrics`, `availability_monthly_metrics`, `mtbf_metrics`, `tpm_metrics`.
        </div>
      </Card>
    </div>
  );
}

