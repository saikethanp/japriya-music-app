import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SongCard } from "../components/SongCard";
import { MusicPlayer } from "../components/MusicPlayer";

import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../lib/firebase";

export function MusicLibrary() {

  const [songs, setSongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any | null>(null);
  const [otpSong, setOtpSong] = useState<any | null>(null);
  const [otpInput, setOtpInput] = useState("");

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "songs"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          unlocked: false,
          ...doc.data()
        }));

        setSongs(data);

      }
    );

    return () => unsubscribe();

  }, []);

  const requestOTP = async (song: any) => {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await addDoc(collection(db, "otp_requests"), {

      identifier: "user",
      otp: otp,
      type: "unlock",
      songId: song.id,
      status: "pending",
      createdAt: serverTimestamp()

    });

    setOtpSong(song);

    alert("OTP requested. Ask admin for OTP.");

  };

  const verifyOTP = async () => {

    if (!otpSong) return;

    const q = query(
      collection(db, "otp_requests"),
      where("otp", "==", otpInput),
      where("songId", "==", otpSong.id),
      where("status", "==", "pending")
    );

    const snap = await getDocs(q);

    if (snap.empty) {

      alert("Invalid OTP");
      return;

    }

    const docRef = snap.docs[0];
    const data: any = docRef.data();

    const created = data.createdAt?.toDate();
    const now = new Date();

    const diffSeconds =
      (now.getTime() - created.getTime()) / 1000;

    // OTP expires after 5 minutes
    if (diffSeconds > 300) {

      await updateDoc(doc(db, "otp_requests", docRef.id), {
        status: "expired"
      });

      alert("OTP expired. Request new OTP.");
      return;

    }

    // mark OTP used
    await updateDoc(doc(db, "otp_requests", docRef.id), {
      status: "used"
    });

    const updatedSongs = songs.map((s) => {

      if (s.id === otpSong.id) {

        return { ...s, unlocked: true };

      }

      return s;

    });

    setSongs(updatedSongs);

    alert("Song unlocked!");

    setOtpSong(null);
    setOtpInput("");

  };

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white mb-2">
          Discover Music
        </h1>

        <p className="text-slate-400">
          Listen to previews and unlock your favorite tracks.
        </p>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6"
      >

        {songs.map((song) => (

          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <SongCard
              song={song}
              onPlay={() => setCurrentSong(song)}
              onUnlock={() => requestOTP(song)}
            />

          </motion.div>

        ))}

      </motion.div>

      {currentSong && (
        <MusicPlayer song={currentSong} />
      )}

      {/* OTP MODAL */}

      {otpSong && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-card-dark p-6 rounded-xl w-80">

            <h2 className="text-white text-lg mb-4">
              Enter OTP from Admin
            </h2>

            <input
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
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
                onClick={() => setOtpSong(null)}
                className="flex-1 bg-white/10 py-2 rounded text-white"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}