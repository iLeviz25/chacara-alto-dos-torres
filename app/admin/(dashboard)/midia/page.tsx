import { ImageIcon } from "lucide-react";
import { AdminPlaceholder } from "@/src/components/admin/AdminPlaceholder";

export default function MediaAdminPage() {
  return (
    <AdminPlaceholder
      eyebrow="Mídia"
      title="Fotos e vídeos"
      description="Área reservada para a futura biblioteca de mídia."
      icon={ImageIcon}
    />
  );
}
