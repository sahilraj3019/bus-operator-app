"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  TicketCheck,
  Search,
  CheckCircle2,
  XCircle,
  Home,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export default function ConductorDashboard() {
  const [ticketId, setTicketId] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [foundTicket, setFoundTicket] = useState<any | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "bookings")), (snap) => {
      setBookings(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSearchTicket = () => {
    if (!ticketId.trim()) {
      alert("Please enter a ticket ID");
      return;
    }
    setSearchPerformed(true);
    const ticket = bookings.find(
      (b) =>
        b.ticket_id === ticketId.trim() ||
        b.id === ticketId.trim() ||
        b.id.slice(0, 8) === ticketId.trim()
    );
    setFoundTicket(ticket || null);
  };

  const handleValidateTicket = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        validation_status: "validated",
        validated_at: new Date().toISOString(),
      });
      alert("Ticket validated successfully!");
      setFoundTicket({
        ...foundTicket,
        validation_status: "validated",
      });
    } catch (error) {
      alert("Error validating ticket");
      console.error(error);
    }
  };

  const handleIssueTicket = async () => {
    if (!foundTicket) return;
    if (foundTicket.payment_status !== "paid") {
      alert("Payment not completed. Cannot issue ticket.");
      return;
    }
    try {
      await updateDoc(doc(db, "bookings", foundTicket.id), {
        ticket_issued: true,
        issued_at: new Date().toISOString(),
      });
      alert("Ticket issued successfully!");
      setFoundTicket({
        ...foundTicket,
        ticket_issued: true,
      });
    } catch (error) {
      alert("Error issuing ticket");
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-black font-sans pb-20">
      {/* HEADER */}
      <section className="bg-[#1E3A8A] pt-8 pb-8 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-tight flex items-center gap-3">
              <TicketCheck size={40} /> Conductor Dashboard
            </h1>
            <p className="text-gray-200 font-bold">
              Check tickets, validate tickets, and issue tickets
            </p>
          </div>
          <Link
            href="/"
            className="bg-white text-[#1E3A8A] px-6 py-3 rounded-xl font-bold border-b-4 border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            <Home size={20} /> Home
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        {/* TICKET SEARCH */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border-[3px] border-black mb-8">
          <h2 className="text-2xl font-bold mb-6 uppercase flex items-center gap-2">
            <Search className="bg-blue-400 p-1 rounded" /> Search Ticket
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Ticket ID"
              className="flex-1 border-2 border-black p-4 rounded-xl font-bold text-lg"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchTicket()}
            />
            <button
              onClick={handleSearchTicket}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase border-b-4 border-blue-800 hover:bg-blue-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* TICKET RESULT */}
        {searchPerformed && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-[3px] border-black">
            {foundTicket ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-2">
                    <Ticket className="bg-green-400 p-1 rounded" /> Ticket
                    Details
                  </h2>
                  <div
                    className={`px-4 py-2 rounded-lg font-bold ${
                      foundTicket.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {foundTicket.payment_status === "paid" ? "PAID" : "UNPAID"}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                    <p className="text-xs text-gray-600 uppercase mb-1">
                      Ticket ID
                    </p>
                    <p className="text-lg font-bold font-mono">
                      {foundTicket.ticket_id || foundTicket.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                    <p className="text-xs text-gray-600 uppercase mb-1">
                      Passenger Name
                    </p>
                    <p className="text-lg font-bold">
                      {foundTicket.passenger_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                    <p className="text-xs text-gray-600 uppercase mb-1">
                      Route
                    </p>
                    <p className="text-lg font-bold uppercase">
                      {foundTicket.origin} → {foundTicket.destination}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                    <p className="text-xs text-gray-600 uppercase mb-1">
                      Journey Date
                    </p>
                    <p className="text-lg font-bold">
                      {foundTicket.booking_date}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                    <p className="text-xs text-gray-600 uppercase mb-1">
                      Seat Number
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      #{foundTicket.seat_number}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                    <p className="text-xs text-gray-600 uppercase mb-1">
                      Validation Status
                    </p>
                    <p className="text-lg font-bold">
                      {foundTicket.validation_status === "validated" ? (
                        <span className="text-green-600 flex items-center gap-2">
                          <CheckCircle2 size={20} /> Validated
                        </span>
                      ) : (
                        <span className="text-gray-600 flex items-center gap-2">
                          <XCircle size={20} /> Not Validated
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  {foundTicket.payment_status === "paid" &&
                    !foundTicket.ticket_issued && (
                      <button
                        onClick={handleIssueTicket}
                        className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl font-bold uppercase border-b-4 border-green-800 hover:bg-green-700 transition-all"
                      >
                        Issue Ticket
                      </button>
                    )}
                  {foundTicket.validation_status !== "validated" && (
                    <button
                      onClick={() => handleValidateTicket(foundTicket.id)}
                      className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold uppercase border-b-4 border-blue-800 hover:bg-blue-700 transition-all"
                    >
                      Validate Ticket
                    </button>
                  )}
                  {foundTicket.validation_status === "validated" && (
                    <div className="flex-1 bg-green-100 text-green-800 px-6 py-4 rounded-xl font-bold uppercase text-center border-2 border-green-600">
                      ✓ Ticket Validated
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Ticket Not Found</h3>
                <p className="text-gray-600">
                  No ticket found with ID: {ticketId}
                </p>
              </div>
            )}
          </div>
        )}

        {/* RECENT BOOKINGS */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border-[3px] border-black mt-8">
          <h2 className="text-2xl font-bold mb-6 uppercase">Recent Bookings</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {bookings.length === 0 ? (
              <p className="text-center text-gray-400 font-bold py-8">
                No bookings yet
              </p>
            ) : (
              bookings.slice(0, 10).map((booking) => (
                <div
                  key={booking.id}
                  className="flex justify-between items-center p-4 bg-gray-50 border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-all"
                >
                  <div>
                    <p className="font-bold">
                      {booking.passenger_name}
                      <span className="text-xs text-gray-600 ml-2 font-mono">
                        ({booking.ticket_id || booking.id.slice(0, 8)})
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.origin} → {booking.destination} | Seat #
                      {booking.seat_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.validation_status === "validated" ? (
                      <CheckCircle2 size={20} className="text-green-600" />
                    ) : (
                      <XCircle size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
