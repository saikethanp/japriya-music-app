import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export function UnlockOTPModal({ song, onClose, onUnlock }: any) {

  const [otp, setOtp] = useState("");

  const verifyOTP = async () => {

    try {

      const q = query(
        collection(db, "otp_requests"),
        where("otp", "==", otp),
        where("songId", "==", song.id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {

        onUnlock(song);
        alert("Song unlocked successfully");
        onClose();

      } else {

        alert("Invalid OTP");

      }

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-card-dark p-6 rounded-xl w-80">

        <h2 className="text-white text-lg mb-4">
          Enter OTP from Admin
        </h2>

        <input
          value={otp}
          onChange={(e)=>setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full rounded-lg p-3 bg-bg-dark text-white mb-4"
        />

        <div className="flex gap-3">

          <button
            onClick={verifyOTP}
            className="flex-1 bg-primary py-2 rounded text-white"
          >
            Verify
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-white/10 py-2 rounded text-white"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  );
}