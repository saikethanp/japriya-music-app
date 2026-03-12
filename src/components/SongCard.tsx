import { Play, Lock } from "lucide-react";
import { motion } from "motion/react";

interface SongCardProps {
  song: any;
  onPlay: (song: any) => void;
  onUnlock: (song: any) => void;
}

export function SongCard({ song, onPlay, onUnlock }: SongCardProps) {

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card-dark shadow-xl cursor-pointer"
    >

      <div className="relative aspect-square overflow-hidden">

        <img
          src={song.cover}
          alt={song.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">

          <button
            onClick={() => onPlay(song)}
            className="h-12 w-12 rounded-full bg-primary flex items-center justify-center"
          >
            <Play className="text-white ml-1"/>
          </button>

        </div>

      </div>

      <div className="p-4">

        <h3 className="text-white font-semibold">{song.title}</h3>
        <p className="text-slate-400 text-sm">{song.artist}</p>

        {!song.unlocked && (

          <button
            onClick={() => onUnlock(song)}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-sm text-white"
          >
            <Lock className="h-4 w-4"/>
            Unlock Full Song
          </button>

        )}

      </div>

    </motion.div>
  );
}