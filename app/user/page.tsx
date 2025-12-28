"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowLeftRight,
  Search,
  CreditCard,
  Download,
  Home,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [buses, setBuses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Search States
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

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

  // Get available origins and destinations
  const availableOrigins = Array.from(new Set(buses.map((b) => b.origin)));
  const availableDestinations = Array.from(
    new Set(buses.map((b) => b.destination))
  );

  // Get booked seats for selected bus and date
  const getBookedSeats = () => {
    if (!selectedBus || !journeyDate) return [];
    return bookings
      .filter(
        (b) =>
          b.origin === selectedBus.origin &&
          b.destination === selectedBus.destination &&
          b.booking_date === journeyDate
      )
      .map((b) => b.seat_number);
  };

  const bookedSeats = getBookedSeats();

  const handleSearch = () => {
    if (!searchFrom || !searchTo || !journeyDate) {
      alert("Please fill all search fields");
      return;
    }
    const bus = buses.find(
      (b) => b.origin === searchFrom && b.destination === searchTo
    );
    if (!bus) {
      alert("No bus found for this route");
      return;
    }
    setSelectedBus(bus);
    setShowSeatMap(true);
  };

  const handleSeatSelection = (seatNum: number) => {
    if (bookedSeats.includes(seatNum)) {
      alert("This seat is already booked");
      return;
    }
    setSelectedSeat(seatNum);
  };

  const handleProceedToPayment = () => {
    if (!selectedSeat || !passengerName || !passengerEmail || !passengerPhone) {
      alert("Please fill all passenger details");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!selectedBus || !selectedSeat || !journeyDate) return;

    // Generate ticket ID
    const ticketId = `TKT${Date.now().toString().slice(-8)}`;

    try {
      const bookingRef = await addDoc(collection(db, "bookings"), {
        ticket_id: ticketId,
        passenger_name: passengerName,
        passenger_email: passengerEmail,
        passenger_phone: passengerPhone,
        origin: selectedBus.origin,
        destination: selectedBus.destination,
        seat_number: selectedSeat,
        booking_date: journeyDate,
        price: selectedBus.price,
        payment_status: "paid",
        payment_method: paymentMethod,
        booked_at: new Date().toISOString(),
        validation_status: "not validated",
      });

      const newBooking = {
        id: bookingRef.id,
        ticket_id: ticketId,
        passenger_name: passengerName,
        passenger_email: passengerEmail,
        passenger_phone: passengerPhone,
        origin: selectedBus.origin,
        destination: selectedBus.destination,
        seat_number: selectedSeat,
        booking_date: journeyDate,
        price: selectedBus.price,
        payment_status: "paid",
        payment_method: paymentMethod,
      };

      setCurrentBooking(newBooking);
      alert("Payment successful! Booking confirmed.");
      setShowPayment(false);
      setShowSeatMap(false);
    } catch (error) {
      alert("Error processing payment. Please try again.");
      console.error(error);
    }
  };

  const handleDownloadTicket = () => {
    if (!currentBooking) return;

    const ticketContent = `
═══════════════════════════════════════
         BUS TICKET
═══════════════════════════════════════

Ticket ID: ${currentBooking.ticket_id}
Passenger: ${currentBooking.passenger_name}
Email: ${currentBooking.passenger_email}
Phone: ${currentBooking.passenger_phone}

Route: ${currentBooking.origin} → ${currentBooking.destination}
Journey Date: ${currentBooking.booking_date}
Seat Number: #${currentBooking.seat_number}

Price: ₹${currentBooking.price}
Payment: ${currentBooking.payment_method.toUpperCase()}
Status: ${currentBooking.payment_status.toUpperCase()}

═══════════════════════════════════════
    Thank you for choosing our service!
═══════════════════════════════════════
    `;

    const blob = new Blob([ticketContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${currentBooking.ticket_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-black font-sans pb-20">
      {/* HEADER */}
      <section className="bg-[#2D1B36] pt-12 pb-24 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-tight">
              Bus Booking Portal
            </h1>
            <Link
              href="/"
              className="bg-white text-[#2D1B36] px-6 py-3 rounded-xl font-bold border-b-4 border-gray-300 hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Home size={20} /> Home
            </Link>
          </div>
          <p className="text-gray-300 mb-10 font-bold">
            Search buses, book seats, pay securely, and download tickets
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
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-56 bg-[#FF4B91] text-white font-bold px-6 py-4 rounded-xl border-b-4 border-black hover:bg-[#ff2d7e] transition-all"
            >
              <Search size={20} className="inline mr-2" />
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* BUS DETAILS & SEAT MAP */}
      {showSeatMap && selectedBus && (
        <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-30 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-[4px] border-black mb-6">
            <h2 className="text-2xl font-bold mb-4 uppercase">
              {selectedBus.name}
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                <p className="text-xs text-gray-600 uppercase mb-1">Route</p>
                <p className="text-lg font-bold">
                  {selectedBus.origin} → {selectedBus.destination}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                <p className="text-xs text-gray-600 uppercase mb-1">Price</p>
                <p className="text-lg font-bold">₹{selectedBus.price}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                <p className="text-xs text-gray-600 uppercase mb-1">
                  Available Seats
                </p>
                <p className="text-lg font-bold">
                  {selectedBus.total_seats - bookedSeats.length} /{" "}
                  {selectedBus.total_seats}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 uppercase">
              Select Your Seat
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
              {Array.from(
                { length: selectedBus.total_seats },
                (_, i) => i + 1
              ).map((num) => {
                const isBooked = bookedSeats.includes(num);
                const isSelected = selectedSeat === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleSeatSelection(num)}
                    disabled={isBooked}
                    className={`p-2 rounded border-2 font-bold ${
                      isBooked
                        ? "bg-red-200 border-red-400 cursor-not-allowed"
                        : isSelected
                        ? "bg-black text-white border-black"
                        : "bg-white hover:bg-yellow-100 border-black"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-black rounded"></div>
                <span className="text-sm font-bold">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border-2 border-red-400 rounded"></div>
                <span className="text-sm font-bold">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black border-2 border-black rounded"></div>
                <span className="text-sm font-bold">Selected</span>
              </div>
            </div>

            {selectedSeat && (
              <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-400">
                <h4 className="text-lg font-bold mb-4 uppercase">
                  Passenger Details
                </h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    placeholder="Full Name *"
                    className="border-2 border-black p-3 rounded-xl font-bold"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                  />
                  <input
                    placeholder="Email *"
                    type="email"
                    className="border-2 border-black p-3 rounded-xl font-bold"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                  />
                  <input
                    placeholder="Phone Number *"
                    type="tel"
                    className="border-2 border-black p-3 rounded-xl font-bold"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-xl font-bold uppercase border-b-4 border-green-800 hover:bg-green-700 transition-all"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PAYMENT MODAL */}
      {showPayment && selectedBus && selectedSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-[4px] border-black shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 uppercase flex items-center gap-2">
              <CreditCard className="bg-blue-400 p-1 rounded" /> Payment
            </h2>
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                <p className="text-3xl font-bold">₹{selectedBus.price}</p>
              </div>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-black rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="font-bold">Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-4 border-2 border-black rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="font-bold">UPI</span>
                </label>
                <label className="flex items-center p-4 border-2 border-black rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="font-bold">Wallet</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-gray-300 text-black px-6 py-3 rounded-xl font-bold uppercase border-b-4 border-gray-500 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold uppercase border-b-4 border-green-800 hover:bg-green-700"
              >
                Pay ₹{selectedBus.price}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              * This is a prototype. Payment is simulated.
            </p>
          </div>
        </div>
      )}

      {/* BOOKING CONFIRMATION */}
      {currentBooking && (
        <section className="max-w-4xl mx-auto px-6 mt-8">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-[4px] border-green-500">
            <div className="text-center mb-6">
              <CheckCircle2 size={64} className="mx-auto text-green-600 mb-4" />
              <h2 className="text-3xl font-bold mb-2 uppercase">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600">
                Your ticket has been booked successfully
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-300 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">
                    Ticket ID
                  </p>
                  <p className="text-xl font-bold font-mono">
                    {currentBooking.ticket_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">
                    Passenger
                  </p>
                  <p className="text-xl font-bold">
                    {currentBooking.passenger_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">Route</p>
                  <p className="text-xl font-bold uppercase">
                    {currentBooking.origin} → {currentBooking.destination}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">
                    Journey Date
                  </p>
                  <p className="text-xl font-bold">
                    {currentBooking.booking_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">
                    Seat Number
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    #{currentBooking.seat_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">Price</p>
                  <p className="text-xl font-bold">₹{currentBooking.price}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadTicket}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase border-b-4 border-blue-800 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Download size={20} /> Download Ticket
            </button>

            <button
              onClick={() => {
                setCurrentBooking(null);
                setSelectedBus(null);
                setShowSeatMap(false);
                setSelectedSeat(null);
                setPassengerName("");
                setPassengerEmail("");
                setPassengerPhone("");
                setSearchFrom("");
                setSearchTo("");
                setJourneyDate("");
              }}
              className="w-full mt-4 bg-gray-200 text-black px-8 py-3 rounded-xl font-bold uppercase border-b-4 border-gray-400 hover:bg-gray-300"
            >
              Book Another Ticket
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
