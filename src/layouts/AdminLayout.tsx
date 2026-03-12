import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-bg-dark text-white">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
