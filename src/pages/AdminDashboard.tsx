import { motion } from 'motion/react';
import { OTPTable } from '../components/OTPTable';
import { SongTable } from '../components/SongTable';
import { Users, Music, Activity } from 'lucide-react';
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function AdminDashboard() {

  const [songsCount, setSongsCount] = useState(0);
  const [otpCount, setOtpCount] = useState(0);

  useEffect(() => {

    const unsubSongs = onSnapshot(
      collection(db, "songs"),
      (snapshot) => {
        setSongsCount(snapshot.size);
      }
    );

    const unsubOTP = onSnapshot(
      collection(db, "otp_requests"),
      (snapshot) => {
        setOtpCount(snapshot.size);
      }
    );

    return () => {
      unsubSongs();
      unsubOTP();
    };

  }, []);

  const stats = [
    {
      label: "Total Users",
      value: otpCount,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      label: "Active Songs",
      value: songsCount,
      icon: Music,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      label: "OTP Requests",
      value: otpCount,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-400">
          Monitor activity, OTP requests, and platform metrics.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {stats.map((stat, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-card-dark border border-white/5 p-6 shadow-lg"
          >

            <div className="flex items-center gap-4">

              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400">
                  {stat.label}
                </p>

                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>

            </div>

          </motion.div>

        ))}

      </div>

      {/* Tables */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Manage Songs
          </h2>

          <SongTable />

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent OTP Requests
          </h2>

          <OTPTable />

        </motion.div>

      </div>

    </div>
  );
}