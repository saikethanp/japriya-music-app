import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, LogOut } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/verify-otp' || location.pathname === '/';

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-bg-dark/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Music className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-white">Japriya</span>
        </Link>
        {!isAuthPage && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
