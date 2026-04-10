import { AdminControlCenter } from '@/components/admin/AdminControlCenter';
import { RequireAdminAuth } from '@/components/admin/RequireAdminAuth';

export default function AdminDashboardPage() {
  return (
    <RequireAdminAuth>
      <AdminControlCenter />
    </RequireAdminAuth>
  );
}
