import { Suspense } from 'react';
import { PressEditorPage } from '@/components/press/PressEditorPage';

export default function PressEditorRoute() {
  return (
    <Suspense
      fallback={
        <div className="press-auth-gate">
          <p className="press-auth-gate__text">Loading editor…</p>
        </div>
      }
    >
      <PressEditorPage />
    </Suspense>
  );
}
