import { ChacaraContentEditor } from "@/src/components/admin/ChacaraContentEditor";
import { getSiteEditorState } from "@/src/lib/content/admin-site-content";

export default async function PropertyAdminPage() {
  const state = await getSiteEditorState("chacara-alto-dos-torres");

  return (
    <ChacaraContentEditor
      draftUpdatedAt={state.draftUpdatedAt}
      hasDraft={state.hasDraft}
      initialContent={state.content}
      publishedAt={state.publishedAt}
    />
  );
}
