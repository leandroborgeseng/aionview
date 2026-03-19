import { Card } from "@/components/ui/card";

export default function AdminUsuariosPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Admin - Usuários</h1>
        <p className="text-sm opacity-80">Placeholder: gestão de usuários, roles, permissions e scopes.</p>
      </div>

      <Card className="p-4">
        <div className="font-medium">Conectar em</div>
        <div className="text-sm opacity-70 mt-2">`users/roles/permissions/user_scopes`.</div>
      </Card>
    </div>
  );
}

