import { Trees } from "lucide-react";
import { AdminPlaceholder } from "@/src/components/admin/AdminPlaceholder";

export default function PropertyAdminPage() {
  return (
    <AdminPlaceholder
      eyebrow="Projeto"
      title="Chácara Alto dos Torres"
      description="Estrutura futura para administrar as informações da propriedade."
      icon={Trees}
    />
  );
}
