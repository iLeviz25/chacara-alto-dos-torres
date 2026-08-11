import { Palette } from "lucide-react";
import { AdminPlaceholder } from "@/src/components/admin/AdminPlaceholder";

export default function AppearanceAdminPage() {
  return (
    <AdminPlaceholder
      eyebrow="Aparência"
      title="Identidade visual"
      description="Área reservada para futuras opções visuais dos projetos."
      icon={Palette}
    />
  );
}
