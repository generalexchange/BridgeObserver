import { EditorWorkbench } from '@/components/editor/EditorWorkbench';
import { RequireEditorAuth } from '@/components/editor/RequireEditorAuth';

export default function EditorDashboardPage() {
  return (
    <RequireEditorAuth>
      <EditorWorkbench />
    </RequireEditorAuth>
  );
}
