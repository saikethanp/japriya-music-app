import { useState, useEffect } from 'react';
import { Trash2, Check, X, RefreshCcw } from 'lucide-react';

import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";

import { db } from "../lib/firebase";

export function OTPTable() {

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "otp_requests"),
      (snapshot) => {

        const now = new Date();

        const data = snapshot.docs.map((d) => {

          const raw: any = d.data();

          let status = raw.status;

          if (raw.createdAt) {

            const created = raw.createdAt.toDate();

            const diffSeconds =
              (now.getTime() - created.getTime()) / 1000;

            // expire after 8 minutes
            if (diffSeconds > 480 && raw.status === "pending") {
              status = "expired";
            }

          }

          return {
            id: d.id,
            user: raw.identifier,
            otp: raw.otp,
            type: raw.type,
            status: status,
            createdAt: raw.createdAt
          };

        })
        .sort((a, b) =>
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setRequests(data);

      }
    );

    return () => unsubscribe();

  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {

    await updateDoc(doc(db, "otp_requests", id), {
      status: newStatus
    });

  };

  const handleDelete = async (id: string) => {

    if (window.confirm("Delete this OTP request?")) {

      await deleteDoc(doc(db, "otp_requests", id));

    }

  };

  const clearAllOTPs = async () => {

    if (!window.confirm("Clear ALL OTP requests?")) return;

    const snapshot = await getDocs(collection(db, "otp_requests"));

    snapshot.forEach(async (docItem) => {

      await deleteDoc(doc(db, "otp_requests", docItem.id));

    });

  };

  const clearExpiredOTPs = async () => {

    const snapshot = await getDocs(collection(db, "otp_requests"));

    const now = new Date();

    snapshot.forEach(async (docItem) => {

      const data: any = docItem.data();

      if (!data.createdAt) return;

      const created = data.createdAt.toDate();

      const diffSeconds =
        (now.getTime() - created.getTime()) / 1000;

      if (diffSeconds > 480) {

        await deleteDoc(doc(db, "otp_requests", docItem.id));

      }

    });

  };

  return (

    <div className="overflow-hidden rounded-xl border border-white/10 bg-card-dark shadow-xl">

      <div className="flex justify-between items-center p-4 border-b border-white/10">

        <h2 className="text-white font-semibold">
          OTP Requests
        </h2>

        <div className="flex gap-3">

          <button
            onClick={clearExpiredOTPs}
            className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg"
          >
            <RefreshCcw className="h-4 w-4"/>
            Clear Expired
          </button>

          <button
            onClick={clearAllOTPs}
            className="flex items-center gap-2 bg-rose-500/20 text-rose-400 px-3 py-1 rounded-lg"
          >
            <Trash2 className="h-4 w-4"/>
            Clear All
          </button>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm text-slate-300">

          <thead className="bg-white/5 text-xs uppercase text-slate-400">

            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">OTP</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>

          </thead>

          <tbody className="divide-y divide-white/5">

            {requests.map((req) => (

              <tr key={req.id} className="hover:bg-white/5 transition-colors">

                <td className="px-6 py-4 text-white">
                  {req.user}
                </td>

                <td className="px-6 py-4 font-mono text-purple-400">
                  {req.otp}
                </td>

                <td className="px-6 py-4">
                  {req.type}
                </td>

                <td className="px-6 py-4">

                  <span className={`px-2 py-1 rounded text-xs ${
                    req.status === "verified"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : req.status === "pending"
                      ? "bg-amber-500/10 text-amber-400"
                      : req.status === "used"
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}>

                    {req.status}

                  </span>

                </td>

                <td className="px-6 py-4 text-right">

                  <div className="flex justify-end gap-2">

                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(req.id, "verified")}
                          className="text-emerald-400"
                        >
                          <Check className="h-4 w-4"/>
                        </button>

                        <button
                          onClick={() => handleStatusChange(req.id, "expired")}
                          className="text-rose-400"
                        >
                          <X className="h-4 w-4"/>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(req.id)}
                      className="text-slate-400"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {requests.length === 0 && (

              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No OTP requests found.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}