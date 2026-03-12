import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function SongTable() {

  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "songs"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setSongs(data);

      }
    );

    return () => unsubscribe();

  }, []);

  const handleDelete = async (id: string) => {

    if (window.confirm("Are you sure you want to delete this song?")) {

      await deleteDoc(doc(db, "songs", id));

    }

  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-card-dark shadow-xl">

      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm text-slate-300">

          <thead className="bg-white/5 text-xs uppercase text-slate-400">

            <tr>

              <th className="px-6 py-4 font-medium">Song</th>
              <th className="px-6 py-4 font-medium">Artist</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>

            </tr>

          </thead>

          <tbody className="divide-y divide-white/5">

            {songs.map((song) => (

              <tr key={song.id} className="hover:bg-white/5 transition-colors">

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={song.cover}
                      alt={song.title}
                      className="h-10 w-10 rounded-md object-cover"
                    />

                    <span className="font-medium text-white">
                      {song.title}
                    </span>

                  </div>

                </td>

                <td className="px-6 py-4">
                  {song.artist}
                </td>

                <td className="px-6 py-4">

                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400">
                    Free
                  </span>

                </td>

                <td className="px-6 py-4 text-right">

                  <button
                    onClick={() => handleDelete(song.id)}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Song"
                  >

                    <Trash2 className="h-4 w-4" />

                  </button>

                </td>

              </tr>

            ))}

            {songs.length === 0 && (

              <tr>

                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No songs found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}