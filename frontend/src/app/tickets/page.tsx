"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Ticket {
  id: string;
  booking_id: string;
  event_id: string;
  created_at: string;
  event_name?: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
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

        // 2. Get Tickets
        const ticketsRes = await fetch(`/proxy/tickets/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!ticketsRes.ok) throw new Error("Failed to fetch tickets");
        const ticketsData: Ticket[] = await ticketsRes.json();

        // 3. Enrich with Event Names
        const eventsRes = await fetch("/proxy/api/v1/events/");
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const eventsMap = new Map();
          const eventsList = Array.isArray(eventsData) ? eventsData : eventsData.events || [];
          eventsList.forEach((e: any) => eventsMap.set(e.id.toString(), e.name));
          
          ticketsData.forEach(t => {
             t.event_name = eventsMap.get(t.event_id.toString()) || `Event #${t.event_id}`;
          });
        }

        setTickets(ticketsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading your tickets...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold">My Tickets</h1>
          <p className="text-slate-400 mt-2">Your digital passes for upcoming events.</p>
        </div>
        <Link href="/bookings" className="text-primary hover:underline text-sm font-medium">View your bookings &rarr;</Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <p className="text-lg">No tickets generated yet.</p>
          <p className="text-sm mt-2">Tickets are generated automatically after a successful payment for your booking.</p>
          <Link href="/bookings" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-6 rounded-lg">Check Bookings Status</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:border-primary transition group">
              <div className="bg-gradient-to-br from-primary to-accent h-32 p-6 flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  Event Pass
                </div>
                <div className="text-right text-white/80">
                   <div className="text-[10px] uppercase font-bold">Ticket ID</div>
                   <div className="font-mono text-xs">{ticket.id}</div>
                </div>
              </div>
              
              <div className="p-6 -mt-10">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl">
                  <h3 className="text-xl font-bold mb-4">{ticket.event_name}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="text-slate-500 uppercase font-bold">Booking ID</span>
                      <span className="font-mono">{ticket.booking_id}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="text-slate-500 uppercase font-bold">Date</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg mb-2">
                       {/* Placeholder for QR - In a real app, this would be the actual QR image */}
                       <div className="w-32 h-32 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                          <span className="text-[10px] text-slate-400 text-center px-4 font-bold">QR CODE<br/>{ticket.id}</span>
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-2 italic">Scan at entrance</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-center">
                 <button className="text-primary hover:text-white transition text-xs font-bold uppercase tracking-widest flex items-center space-x-2">
                    <span>Download PDF</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
