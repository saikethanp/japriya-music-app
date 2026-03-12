import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Music, Upload, Users, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'OTP Requests', href: '/admin/dashboard', icon: Users },
  { name: 'Songs', href: '/admin/dashboard', icon: Music },
  { name: 'Upload Song', href: '/admin/upload-song', icon: Upload },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-white/10 bg-card-dark flex flex-col hidden md:flex">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-white/10">
        <Music className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">Japriya Admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link
          to="/admin/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
