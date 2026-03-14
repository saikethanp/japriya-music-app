import { useRef, useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Lock } from "lucide-react";

interface PlayerProps {
  song: any;
}

export function MusicPlayer({ song }: PlayerProps) {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [previewEnded, setPreviewEnded] = useState(false);

  if (!song) return null;

  const audioSrc =
    song.audio ||
    song.audioUrl ||
    song.url ||
    "";

  if (!audioSrc) return null;

  // SAFE convert mm:ss OR seconds → seconds
  const convertTime = (time: any) => {

    if (!time) return 0;

    // if already a number
    if (typeof time === "number") {
      return time;
    }

    // if string like "00:30"
    if (typeof time === "string" && time.includes(":")) {

      const parts = time.split(":");

      const minutes = Number(parts[0]) || 0;
      const seconds = Number(parts[1]) || 0;

      return minutes * 60 + seconds;
    }

    // fallback
    return Number(time) || 0;
  };

  const previewStart = convertTime(song.previewStart || "00:00");
  const previewEnd = convertTime(song.previewEnd || "00:30");

  const togglePlay = () => {

    if (!audioRef.current) return;

    if (playing) {

      audioRef.current.pause();
      setPlaying(false);

    } else {

      if (!song.unlocked && audioRef.current.currentTime < previewStart) {
        audioRef.current.currentTime = previewStart;
      }

      audioRef.current.play();
      setPlaying(true);

    }

  };

  const updateProgress = () => {

    if (!audioRef.current) return;

    const current = audioRef.current.currentTime || 0;

    setProgress(current);

    if (!song.unlocked && current >= previewEnd) {

      audioRef.current.pause();
      setPlaying(false);
      setPreviewEnded(true);

    }

  };

  const handleSeek = (e: any) => {

    if (!audioRef.current) return;

    const value = Number(e.target.value) || 0;

    audioRef.current.currentTime = value;
    setProgress(value);

  };

  const handleVolume = (e: any) => {

    const value = Number(e.target.value) || 0;

    setVolume(value);

    if (audioRef.current) {
      audioRef.current.volume = value;
    }

  };

  useEffect(() => {

    if (!audioRef.current) return;

    setPlaying(false);
    setProgress(0);
    setPreviewEnded(false);

    audioRef.current.volume = volume;

    if (!song.unlocked) {
      audioRef.current.currentTime = previewStart;
    } else {
      audioRef.current.currentTime = 0;
    }

  }, [song]);

  return (

    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 px-6 py-3">

      <div className="flex items-center justify-between">

        {/* LEFT */}

        <div className="flex items-center gap-4 w-1/4">

          <img
            src={song.cover}
            alt={song.title}
            className="w-14 h-14 rounded object-cover"
          />

          <div>
            <p className="text-white font-medium">{song.title}</p>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>

        </div>

        {/* CENTER */}

        <div className="flex flex-col items-center w-2/4">

          <div className="flex items-center gap-6 mb-2">

            <button className="text-gray-400 hover:text-white">
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-2"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button className="text-gray-400 hover:text-white">
              <SkipForward size={20} />
            </button>

          </div>

          <input
            type="range"
            min="0"
            max={song.unlocked ? duration : previewEnd}
            value={progress}
            onChange={handleSeek}
            className="w-full accent-green-500"
          />

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3 w-1/4 justify-end">

          <Volume2 size={18} className="text-gray-400" />

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
          />

        </div>

      </div>

      {!song.unlocked && previewEnded && (

        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-amber-400">

          <Lock size={16} />

          <span>Preview ended • Unlock full song</span>

        </div>

      )}

      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={() => {

          if (!audioRef.current) return;

          const dur = audioRef.current.duration;

          if (!isNaN(dur)) {
            setDuration(dur);
          }

        }}
      />

    </div>

  );

}