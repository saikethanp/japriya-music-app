import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Music } from "lucide-react";
import { motion } from "motion/react";

export function VerifyOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    setError("");

    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      setError("Enter full 6 digit OTP");
      return;
    }

    try {
      const q = query(
        collection(db, "otp_requests"),
        where("otp", "==", enteredOTP),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Wrong OTP");
        return;
      }

      // mark OTP used
      for (const document of snapshot.docs) {
        await updateDoc(doc(db, "otp_requests", document.id), {
          status: "used",
        });
      }

      navigate("/music");

    } catch (err) {
      console.error(err);
      setError("Verification failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-[#1e293b] border border-white/5 shadow-xl p-8"
      >

        <div className="text-center mb-8">

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
              <Music className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white">
            Enter OTP
          </h1>

          <p className="text-slate-400 mt-2">
            Enter the 6 digit OTP from admin
          </p>

        </div>

        {/* OTP BOXES */}

        <div className="flex justify-center gap-3 mb-6">

          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el!)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-14 text-center text-xl font-bold rounded-lg bg-[#0f172a] border border-white/10 text-white focus:border-purple-500 focus:outline-none"
            />
          ))}

        </div>

        {error && (
          <p className="text-red-400 text-center mb-4">
            {error}
          </p>
        )}

        <button
          onClick={verifyOTP}
          className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Verify OTP
        </button>

      </motion.div>
    </div>
  );
}