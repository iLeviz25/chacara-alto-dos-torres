import { EspacoContentEditor } from "@/src/components/admin/EspacoContentEditor";
import { getSiteEditorState } from "@/src/lib/content/admin-site-content";

export default async function VenueAdminPage() {
  const state = await getSiteEditorState("espaco-fernandes");

  return (
    <EspacoContentEditor
      draftUpdatedAt={state.draftUpdatedAt}
      hasDraft={state.hasDraft}
      initialContent={state.content}
      publishedAt={state.publishedAt}
    />
  );
}
