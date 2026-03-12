import { useRef, useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface PlayerProps {
  song: any;
}

export function MusicPlayer({ song }: PlayerProps) {

  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  if (!song) return null;

  const previewStart = isNaN(Number(song?.previewStart))
    ? 0
    : Number(song.previewStart);

  const previewEnd = isNaN(Number(song?.previewEnd))
    ? 5
    : Number(song.previewEnd);

  const togglePlay = () => {

    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);

  };

  const updateProgress = () => {

    if (!audioRef.current) return;

    const current = audioRef.current.currentTime || 0;

    setProgress(current);

    if (!song.unlocked && current >= previewEnd) {

      audioRef.current.pause();
      setPlaying(false);

      alert("Preview finished. Unlock song to hear full track.");

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

      <audio
        ref={audioRef}
        src={song.audio}
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