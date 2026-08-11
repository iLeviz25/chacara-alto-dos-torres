import { Settings } from "lucide-react";
import { AdminPlaceholder } from "@/src/components/admin/AdminPlaceholder";

export default function SettingsAdminPage() {
  return (
    <AdminPlaceholder
      eyebrow="Configurações"
      title="Preferências do painel"
      description="Área reservada para configurações administrativas futuras."
      icon={Settings}
    />
  );
}
