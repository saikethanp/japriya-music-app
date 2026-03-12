import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Music, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function Login() {
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!contact) return;

    try {
      // Generate random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save request to Firestore
      await addDoc(collection(db, "otp_requests"), {
        identifier: contact,
        otp: otp,
        status: "pending",
        type: "login"
      });

      alert("OTP request sent to admin");

      navigate('/verify-otp');
    } catch (error) {
      console.error("Error sending OTP request:", error);
      alert("Failed to request OTP");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-card-dark shadow-2xl border border-white/5"
      >
        <div className="p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Music className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome to Japriya
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter your email or phone to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="contact" className="sr-only">
                Email or Phone
              </label>

              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email address or phone number"
                className="w-full rounded-xl border border-white/10 bg-bg-dark px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
            >
              Request OTP
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
        
        <div className="border-t border-white/5 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-slate-400">
            Are you an admin?{" "}
            <Link
              to="/admin/login"
              className="font-medium text-primary hover:text-primary-hover hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}