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
  ArrowLeftRight,
  Trash2,
  Search,
  MapPin,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [buses, setBuses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Add Bus Form State
  const [busName, setBusName] = useState("");
  const [busFrom, setBusFrom] = useState("");
  const [busTo, setBusTo] = useState("");
  const [seats, setSeats] = useState(50);
  const [price, setPrice] = useState(450);

  // Search & Booking States
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [passengerName, setPassengerName] = useState("");

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

  // SYNC DROPDOWNS: These automatically update when a bus is added
  const availableOrigins = Array.from(new Set(buses.map((b) => b.origin)));
  const availableDestinations = Array.from(
    new Set(buses.map((b) => b.destination))
  );

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

  const handleSearch = () => {
    const hasBus = buses.some(
      (b) => b.origin === searchFrom && b.destination === searchTo
    );
    if (!hasBus) return alert("No bus found for this route");
    setShowSeatMap(true);
  };

  async function handleConfirmBooking() {
    if (!selectedSeat || !passengerName || !journeyDate)
      return alert("Fill all details");
    await addDoc(collection(db, "bookings"), {
      passenger_name: passengerName,
      origin: searchFrom,
      destination: searchTo,
      seat_number: selectedSeat,
      booking_date: journeyDate,
    });
    alert("Booking Successful!");
    setShowSeatMap(false);
    setSelectedSeat(null);
    setPassengerName("");
  }

  console.log(bookings);

  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans pb-20">
      {/* HERO SECTION */}
      <section className="bg-[#2D1B36] pt-12 pb-24 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-tight">
          Bus Booking Services
        </h1>
        <p className="text-gray-300 mb-10 font-bold">
          Book tickets for comfortable travel across India
        </p>

        {/* SEARCH BAR */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-4 border-[3px] border-black">
          <div className="w-full text-left">
            <label className="text-xs font-bold text-black ml-1 uppercase">
              From
            </label>
            <select
              className="w-full border-2 border-black p-3 rounded-xl font-bold bg-gray-50"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
            >
              <option value="">Select Origin</option>
              {availableOrigins.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <ArrowLeftRight className="hidden md:block text-black mt-5" />
          <div className="w-full text-left">
            <label className="text-xs font-bold text-black ml-1 uppercase">
              To
            </label>
            <select
              className="w-full border-2 border-black p-3 rounded-xl font-bold bg-gray-50"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
            >
              <option value="">Select Destination</option>
              {availableDestinations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full text-left">
            <label className="text-xs font-bold text-black ml-1 uppercase">
              Journey Date
            </label>
            <input
              type="date"
              className="w-full border-2 border-black p-3 rounded-xl font-bold bg-gray-50"
              onChange={(e) => setJourneyDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full md:w-56 bg-[#FF4B91] text-white font-bold px-6 py-4 rounded-xl border-b-4 border-black hover:bg-[#ff2d7e]"
          >
            SEARCH
          </button>
        </div>
      </section>

      {/* SEAT MAP */}
      {showSeatMap && (
        <section className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl -mt-12 relative z-30 mb-16 border-[4px] border-black">
          <h2 className="text-2xl font-bold mb-6 border-b-4 border-yellow-400 inline-block">
            SELECT SEAT (1-50)
          </h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setSelectedSeat(num)}
                className={`p-2 rounded border-2 font-bold border-black ${
                  selectedSeat === num
                    ? "bg-black text-white"
                    : "bg-white hover:bg-yellow-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Passenger Name"
              className="border-2 border-black p-3 rounded-xl flex-1 font-bold"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
            />
            <button
              onClick={handleConfirmBooking}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold border-b-4 border-black"
            >
              CONFIRM BOOKING
            </button>
          </div>
        </section>
      )}

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
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="flex justify-between items-center p-4 bg-gray-50 border-2 border-black rounded-2xl"
              >
                <div>
                  <p className="font-bold text-sm uppercase">{bus.name}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">
                    {bus.origin} → {bus.destination}
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
            ))}
          </div>
        </div>

        {/* BOOKING RECORDS */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border-[3px] border-black lg:col-span-2">
          <h2 className="text-xl font-bold mb-5 uppercase flex items-center gap-2">
            <Users className="bg-yellow-400 p-1 rounded" /> Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Route</th>
                  <th className="p-2">Journey Date</th>
                  <th className="p-2">Seat</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-100">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
