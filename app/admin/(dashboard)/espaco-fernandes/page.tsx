import { PartyPopper } from "lucide-react";
import { AdminPlaceholder } from "@/src/components/admin/AdminPlaceholder";

export default function VenueAdminPage() {
  return (
    <AdminPlaceholder
      eyebrow="Projeto"
      title="Espaço Fernandes"
      description="Estrutura futura para administrar as informações do espaço."
      icon={PartyPopper}
    />
  );
}
