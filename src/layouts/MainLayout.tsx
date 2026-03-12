import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { MusicPlayer } from '../components/MusicPlayer';

export function MainLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/verify-otp' || location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-bg-dark text-white">
      <Navbar />
      <main className={`flex-1 ${!isAuthPage ? 'pb-24' : ''}`}>
        <Outlet />
      </main>
      {!isAuthPage && <MusicPlayer />}
    </div>
  );
}
