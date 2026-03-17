"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Booking {
  id: number;
  event_id: number;
  seat_number: string;
  status: string;
  created_at: string;
  event_name?: string; // Enrichment
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 1. Get User Profile
        const profileRes = await fetch("/proxy/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profile = await profileRes.json();
        const userId = profile.id;

        // 2. Get Bookings
        const bookingsRes = await fetch(`/proxy/bookings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        const bookingsData: Booking[] = await bookingsRes.json();

        // 3. Enrich with Event Names (Optional but better UX)
        // 3. Enrich with Event Names (Event Service)
        const eventsRes = await fetch("/proxy/api/v1/events/");
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const eventsMap = new Map();
          const eventsList = Array.isArray(eventsData) ? eventsData : eventsData.events || [];
          eventsList.forEach((e: any) => eventsMap.set(e.id, e.name));
          
          bookingsData.forEach(b => {
             b.event_name = eventsMap.get(b.event_id) || `Event #${b.event_id}`;
          });
        }

        setBookings(bookingsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading your bookings...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <p className="text-slate-400 mt-2">Manage your reserved seats and track payment status.</p>
        </div>
        <Link href="/" className="text-primary hover:underline text-sm font-medium">Browse more events &rarr;</Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <p className="text-lg">You haven't booked any events yet.</p>
          <Link href="/" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-6 rounded-lg">Explore Events</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center hover:bg-slate-800/60 transition group">
              <div className="flex items-center space-x-6">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl">
                  {booking.event_name?.charAt(0) || "E"}
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition">{booking.event_name}</h3>
                  <div className="flex items-center space-x-3 text-sm text-slate-400 mt-1">
                    <span>Seat: <span className="font-mono text-slate-200">{booking.seat_number}</span></span>
                    <span>&bull;</span>
                    <span>Booked on: {new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' : 
                  booking.status === 'PENDING_PAYMENT' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {booking.status.replace('_', ' ')}
                </span>
                {booking.status === 'CONFIRMED' && (
                  <Link 
                    href="/tickets" 
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition"
                  >
                    View Ticket
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
