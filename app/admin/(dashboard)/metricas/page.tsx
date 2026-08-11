import { BarChart3 } from "lucide-react";
import { AdminPlaceholder } from "@/src/components/admin/AdminPlaceholder";

export default function MetricsPage() {
  return (
    <AdminPlaceholder
      eyebrow="Métricas"
      title="Desempenho dos sites"
      description="Área reservada para os indicadores da próxima etapa."
      icon={BarChart3}
    />
  );
}
