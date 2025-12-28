"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  Bus,
  Users,
  Trash2,
  MapPin,
  Settings,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function OperatorDashboard() {
  const [buses, setBuses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Add Bus Form State
  const [busName, setBusName] = useState("");
  const [busFrom, setBusFrom] = useState("");
  const [busTo, setBusTo] = useState("");
  const [seats, setSeats] = useState(50);
  const [price, setPrice] = useState(450);

  useEffect(() => {
    const unsubBuses = onSnapshot(query(collection(db, "buses")), (snap) => {
      setBuses(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const unsubBookings = onSnapshot(
      query(collection(db, "bookings")),
      (snap) => {
        setBookings(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => {
      unsubBuses();
      unsubBookings();
    };
  }, []);

  // INITIALIZE DEFAULT BUSES
  const initializeDefaults = async () => {
    const busRef = collection(db, "buses");
    await addDoc(busRef, {
      name: "Patna Exp",
      origin: "Patna",
      destination: "Motihari",
      total_seats: 50,
      price: 450,
    });
    await addDoc(busRef, {
      name: "Motihari Exp",
      origin: "Motihari",
      destination: "Patna",
      total_seats: 50,
      price: 450,
    });
    alert("Patna/Motihari Routes Initialized!");
  };

  async function handleAddBus() {
    if (!busName || !busFrom || !busTo)
      return alert("Please fill Name, From, and To fields");
    await addDoc(collection(db, "buses"), {
      name: busName,
      origin: busFrom,
      destination: busTo,
      total_seats: Number(seats),
      price: Number(price),
    });
    setBusName("");
    setBusFrom("");
    setBusTo("");
    alert("New bus route added and synced!");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans pb-20">
      {/* HEADER */}
      <section className="bg-[#2D1B36] pt-8 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-tight">
              Bus Operator Dashboard
            </h1>
            <p className="text-gray-300 font-bold">
              Manage buses, routes, pricing, and view bookings
            </p>
          </div>
          <Link
            href="/"
            className="bg-white text-black px-6 py-3 rounded-xl font-bold border-b-4 border-gray-300 hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <Home size={20} /> Home
          </Link>
        </div>
      </section>

      {/* ADMIN PANELS */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 mt-12">
        {/* ADD BUS WITH FROM/TO */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-[3px] border-black h-fit">
          <h2 className="text-xl font-bold mb-5 uppercase flex items-center gap-2">
            <Bus className="bg-blue-400 p-1 rounded" /> Add New Bus
          </h2>
          <div className="space-y-4">
            <input
              className="w-full border-2 border-black p-3 rounded-xl font-bold"
              placeholder="Bus Name"
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="w-full border-2 border-black p-3 rounded-xl font-bold"
                placeholder="From"
                value={busFrom}
                onChange={(e) => setBusFrom(e.target.value)}
              />
              <input
                className="w-full border-2 border-black p-3 rounded-xl font-bold"
                placeholder="To"
                value={busTo}
                onChange={(e) => setBusTo(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Seats Group */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold ml-1" htmlFor="seats">
                  Seats
                </label>
                <input
                  id="seats"
                  className="w-full border-2 border-black p-3 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                  type="number"
                  placeholder="0"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                />
              </div>

              {/* Price Group */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold ml-1" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  className="w-full border-2 border-black p-3 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-200"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <button
              onClick={handleAddBus}
              className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase border-b-4 border-gray-600"
            >
              Save Bus
            </button>
            <button
              onClick={initializeDefaults}
              className="w-full border-2 border-dashed border-blue-600 text-blue-600 py-2 rounded-xl font-bold text-xs uppercase"
            >
              Initialize Patna/Motihari Routes
            </button>
          </div>
        </div>

        {/* MANAGE BUSES LIST */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-[3px] border-black h-fit">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold uppercase flex items-center gap-2">
              <MapPin className="bg-green-400 p-1 rounded" /> Manage Bus
            </h2>
            <Link
              href="/routes"
              className="p-2 bg-gray-100 rounded-lg border border-black hover:bg-yellow-200 transition-all"
            >
              <Settings size={20} />
            </Link>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {buses.length === 0 ? (
              <p className="text-center text-gray-400 font-bold py-8">
                No buses added yet
              </p>
            ) : (
              buses.map((bus) => (
                <div
                  key={bus.id}
                  className="flex justify-between items-center p-4 bg-gray-50 border-2 border-black rounded-2xl"
                >
                  <div>
                    <p className="font-bold text-sm uppercase">{bus.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">
                      {bus.origin} → {bus.destination}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Seats: {bus.total_seats} | Price: ₹{bus.price}
                    </p>
                  </div>
                  <button
                    onClick={async () =>
                      await deleteDoc(doc(db, "buses", bus.id))
                    }
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOOKING RECORDS */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-[3px] border-black lg:col-span-2">
          <h2 className="text-xl font-bold mb-5 uppercase flex items-center gap-2">
            <Users className="bg-yellow-400 p-1 rounded" /> All Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-2">Ticket ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Route</th>
                  <th className="p-2">Journey Date</th>
                  <th className="p-2">Seat</th>
                  <th className="p-2">Payment</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-400">
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100">
                      <td className="p-2 text-xs font-mono">
                        {b.ticket_id || b.id.slice(0, 8)}
                      </td>
                      <td className="p-2">{b.passenger_name}</td>
                      <td className="p-2 text-[10px] uppercase">
                        {`${b.origin} → ${b.destination}`}
                      </td>
                      <td className="p-2">{b.booking_date}</td>
                      <td className="p-2">
                        <span className="bg-pink-100 px-2 rounded">
                          #{b.seat_number}
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            b.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {b.payment_status || "pending"}
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            b.validation_status === "validated"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {b.validation_status || "not validated"}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={async () =>
                            await deleteDoc(doc(db, "bookings", b.id))
                          }
                          className="text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

