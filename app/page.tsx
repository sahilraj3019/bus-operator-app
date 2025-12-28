"use client";
import Link from "next/link";
import { Bus, TicketCheck, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-black font-sans">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 uppercase tracking-tight bg-gradient-to-r from-[#2D1B36] to-[#FF4B91] bg-clip-text text-transparent">
            Bus Operator System
          </h1>
          <p className="text-xl text-gray-700 font-bold">
            Complete bus management and booking platform
          </p>
        </div>

        {/* THREE ENDPOINTS */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* OPERATOR ENDPOINT */}
          <Link
            href="/operator"
            className="bg-white p-8 rounded-3xl shadow-2xl border-[4px] border-black hover:scale-105 transition-all group"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-all">
              <Bus size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 uppercase">Operator</h2>
            <p className="text-gray-600 mb-4">
              Manage buses, routes, pricing, seats, and view all bookings
            </p>
            <div className="flex items-center text-blue-600 font-bold">
              Access Dashboard
              <ArrowRight
                size={20}
                className="ml-2 group-hover:translate-x-2 transition-all"
              />
            </div>
          </Link>

          {/* CONDUCTOR ENDPOINT */}
          <Link
            href="/conductor"
            className="bg-white p-8 rounded-3xl shadow-2xl border-[4px] border-black hover:scale-105 transition-all group"
          >
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-all">
              <TicketCheck size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 uppercase">Conductor</h2>
            <p className="text-gray-600 mb-4">
              Check tickets, validate tickets, and issue tickets on board
            </p>
            <div className="flex items-center text-green-600 font-bold">
              Access Dashboard
              <ArrowRight
                size={20}
                className="ml-2 group-hover:translate-x-2 transition-all"
              />
            </div>
          </Link>

          {/* USER ENDPOINT */}
          <Link
            href="/user"
            className="bg-white p-8 rounded-3xl shadow-2xl border-[4px] border-black hover:scale-105 transition-all group"
          >
            <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-200 transition-all">
              <Users size={32} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 uppercase">Passenger</h2>
            <p className="text-gray-600 mb-4">
              Search buses, book seats, pay securely, and download tickets
            </p>
            <div className="flex items-center text-pink-600 font-bold">
              Book Now
              <ArrowRight
                size={20}
                className="ml-2 group-hover:translate-x-2 transition-all"
              />
            </div>
          </Link>
        </div>

        {/* FEATURES */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-[3px] border-black">
          <h3 className="text-2xl font-bold mb-6 uppercase text-center">
            System Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bus size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Route Management</h4>
                <p className="text-sm text-gray-600">
                  Add and manage bus routes with origin, destination, seats, and
                  pricing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <TicketCheck size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Ticket Validation</h4>
                <p className="text-sm text-gray-600">
                  Real-time ticket checking and validation for conductors
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Users size={24} className="text-pink-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Easy Booking</h4>
                <p className="text-sm text-gray-600">
                  Simple search, seat selection, and booking process for
                  passengers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <ArrowRight size={24} className="text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Payment & Tickets</h4>
                <p className="text-sm text-gray-600">
                  Secure payment processing and instant ticket download
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
