"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { Trash2, Bus, ArrowRight } from "lucide-react";

export default function RoutesPage() {
  const [buses, setBuses] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "buses")), (snap) => {
      setBuses(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  async function updatePrice(id: string, newPrice: string) {
    if (!newPrice) return;
    await updateDoc(doc(db, "buses", id), { price: Number(newPrice) });
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 text-black font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b-4 border-black pb-6">
          <h1 className="text-4xl font-bold uppercase tracking-tighter">
            Route Pricing
          </h1>
          <Link
            href="/"
            className="bg-black text-white px-8 py-3 rounded-2xl font-bold border-b-4 border-gray-700 hover:scale-105 transition-all"
          >
            ← DASHBOARD
          </Link>
        </div>

        <div className="grid gap-6">
          {buses.length === 0 && (
            <p className="text-center font-bold text-gray-400 p-20 border-4 border-dashed rounded-3xl">
              No buses added. Go to dashboard to add routes.
            </p>
          )}

          {buses.map((bus) => (
            <div
              key={bus.id}
              className="flex flex-col md:flex-row justify-between items-center p-6 border-[3px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-5">
                <div className="bg-yellow-400 p-4 rounded-2xl border-2 border-black">
                  <Bus size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold uppercase leading-tight">
                    {bus.name}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-sm">
                    <span>{bus.origin}</span> <ArrowRight size={14} />{" "}
                    <span>{bus.destination}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 md:mt-0">
                <div className="flex items-center border-[3px] border-black rounded-2xl px-4 py-2 bg-gray-50">
                  <span className="font-bold text-xl mr-1">₹</span>
                  <input
                    type="number"
                    defaultValue={bus.price}
                    className="bg-transparent w-24 font-bold text-xl outline-none"
                    onBlur={(e) => updatePrice(bus.id, e.target.value)}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (confirm("Delete bus?"))
                      await deleteDoc(doc(db, "buses", bus.id));
                  }}
                  className="bg-red-500 text-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
