import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fixed admin credentials
  const ADMIN_EMAIL = "admin@japriya.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

      // store admin session
      localStorage.setItem("admin_logged_in", "true");

      navigate('/admin/dashboard');

    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-bg-dark relative">

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-card-dark shadow-2xl border border-white/5"
      >
        <div className="p-8">

          <div className="mb-8 flex flex-col items-center text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <Lock className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to manage Japriya
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-bg-dark px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-bg-dark px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
            >
              Login to Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

          </form>

        </div>
      </motion.div>
    </div>
  );
}