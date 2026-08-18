import { AppearanceEditor } from "@/src/components/admin/AppearanceEditor";
import { getSiteThemeEditorState } from "@/src/lib/theme/admin-theme";

export default async function AppearanceAdminPage() {
  const states = await Promise.all([
    getSiteThemeEditorState("chacara-alto-dos-torres"),
    getSiteThemeEditorState("espaco-fernandes"),
  ]);

  return <AppearanceEditor states={states} />;
}
