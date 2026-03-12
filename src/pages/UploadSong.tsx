import { useState, FormEvent, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, Music, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { supabase } from "../lib/supabase";

export function UploadSong() {

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:30");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // convert mm:ss to seconds
  const convertTimeToSeconds = (time:string) => {

    const parts = time.split(":");

    const minutes = Number(parts[0]) || 0;
    const seconds = Number(parts[1]) || 0;

    return minutes * 60 + seconds;

  };

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    if (!audioFile || !imageFile) {
      alert("Upload audio and cover image");
      return;
    }

    try {

      // upload audio
      const { data: audioData, error: audioError } =
        await supabase.storage
          .from("songs")
          .upload(`audio/${Date.now()}-${audioFile.name}`, audioFile);

      if (audioError) {
        console.error(audioError);
        alert("Audio upload failed");
        return;
      }

      const { data: audioURL } =
        supabase.storage
          .from("songs")
          .getPublicUrl(audioData.path);

      // upload image
      const { data: imageData, error: imageError } =
        await supabase.storage
          .from("songs")
          .upload(`covers/${Date.now()}-${imageFile.name}`, imageFile);

      if (imageError) {
        console.error(imageError);
        alert("Image upload failed");
        return;
      }

      const { data: imageURL } =
        supabase.storage
          .from("songs")
          .getPublicUrl(imageData.path);

      // convert preview times
      const previewStartSeconds = convertTimeToSeconds(startTime);
      const previewEndSeconds = convertTimeToSeconds(endTime);

      await addDoc(collection(db, "songs"), {

        title,
        artist,
        audio: audioURL.publicUrl,
        cover: imageURL.publicUrl,
        previewStart: previewStartSeconds,
        previewEnd: previewEndSeconds,
        createdAt: serverTimestamp()

      });

      alert("Song uploaded successfully!");

      setTitle("");
      setArtist("");
      setStartTime("00:00");
      setEndTime("00:30");
      setAudioFile(null);
      setImageFile(null);

    } catch (err) {

      console.error(err);
      alert("Upload failed");

    }

  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (

    <div className="max-w-3xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Upload New Song
        </h1>
        <p className="text-slate-400">
          Add a new track to the Japriya library.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card-dark border border-white/5 p-8 shadow-xl"
      >

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* title + artist */}

          <div className="grid grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Song Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-white/10 bg-bg-dark px-4 py-3 text-white"
              required
            />

            <input
              type="text"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="rounded-xl border border-white/10 bg-bg-dark px-4 py-3 text-white"
              required
            />

          </div>

          {/* audio */}

          <label className="flex justify-center border border-dashed border-white/20 rounded-xl px-6 py-8 cursor-pointer">

            <div className="text-center">

              {audioFile ? (
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
              ) : (
                <Music className="mx-auto h-8 w-8 text-slate-400" />
              )}

              <p className="mt-2 text-slate-400">
                {audioFile ? audioFile.name : "Upload audio"}
              </p>

            </div>

            <input
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={handleAudioChange}
            />

          </label>

          {/* image */}

          <label className="flex justify-center border border-dashed border-white/20 rounded-xl px-6 py-8 cursor-pointer">

            <div className="text-center">

              {imageFile ? (
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
              ) : (
                <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
              )}

              <p className="mt-2 text-slate-400">
                {imageFile ? imageFile.name : "Upload cover"}
              </p>

            </div>

            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />

          </label>

          {/* preview timeline */}

          <div className="grid grid-cols-2 gap-6">

            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="00:10"
              className="rounded-xl border border-white/10 bg-bg-dark px-4 py-3 text-white"
            />

            <input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="00:20"
              className="rounded-xl border border-white/10 bg-bg-dark px-4 py-3 text-white"
            />

          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-primary px-6 py-3 rounded-xl text-white"
          >
            <Upload className="h-5 w-5"/>
            Upload Song
          </button>

        </form>

      </motion.div>

    </div>
  );
}