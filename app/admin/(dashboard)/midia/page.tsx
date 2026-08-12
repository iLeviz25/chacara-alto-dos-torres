import { MediaManager } from "@/src/components/admin/MediaManager";
import { getMediaEditorState } from "@/src/lib/media/admin-media";

export default async function MediaAdminPage() {
  const states = await Promise.all([
    getMediaEditorState("chacara-alto-dos-torres"),
    getMediaEditorState("espaco-fernandes"),
  ]);
  return <MediaManager states={states} />;
}
