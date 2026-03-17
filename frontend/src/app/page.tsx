"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);

  useEffect(() => {
    // Check auth
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Fetch Events
    fetch("/api/v1/events/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data);
        else if (data.events) setEvents(data.events);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch events:", err);
        setIsLoading(false);
      });
  }, []);

  const handleBook = async (eventId: string, price: number) => {
    if (!token) {
      router.push("/login");
      return;
    }

    setBookingInProgress(eventId);

    try {
      const res = await fetch("/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: eventId,
          seat_number: `SEAT-${Math.floor(Math.random() * 1000)}`,
        })
      });

      if (res.ok) {
        // Successfully booked!
        router.push("/bookings");
      } else {
        const err = await res.json();
        alert(`Booking failed: ${err.detail || JSON.stringify(err)}`);
      }
    } catch (e: any) {
      alert("Booking error: " + e.message);
    } finally {
      setBookingInProgress(null);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 mt-2 mb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30"></div>
        <div className="text-center space-y-8 relative">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">
             Next-Gen Event Management
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
            Elevate Your <span className="text-primary italic">Experience</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Discover and book exclusive events with our seamless microservices-powered platform. Fast, secure, and hyper-scalable.
          </p>
          {!token && (
            <button 
              onClick={() => router.push("/login")}
              className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-10 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-primary/40 active:scale-95 translate-y-2"
            >
              Start Your Journey
            </button>
          )}
        </div>
      </section>

      {/* Events Grid */}
      <section id="events" className="scroll-mt-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black">Upcoming Events</h2>
            <div className="h-1.5 w-20 bg-primary mt-2 rounded-full"></div>
          </div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Showing {events.length} Events
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-96 bg-slate-800/20 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
           <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-20 text-center">
              <div className="text-slate-500 mb-4">
                <svg className="mx-auto w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-300">No events found</h3>
              <p className="text-slate-500 mt-2">Check back later or create one via the API.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((evt, idx) => (
              <div key={idx} className="group relative bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col">
                <div className="aspect-[16/10] bg-slate-800 relative overflow-hidden">
                   {/* Abstract background for event images */}
                   <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${idx % 2 === 0 ? 'from-primary to-accent' : 'from-accent to-primary'}`}></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-black text-white/10 uppercase tracking-[0.2em]">{evt.name?.split(' ')[0]}</span>
                   </div>
                   <div className="absolute bottom-4 left-4">
                      <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider">
                         {evt.category || "General"}
                      </div>
                   </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black group-hover:text-primary transition">{evt.name || "Unnamed Event"}</h3>
                  </div>
                  
                  <p className="text-slate-400 mb-8 text-sm line-clamp-2 leading-relaxed">
                    {evt.description || "Join us for this incredible experience. Limited seats available."}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Seats Available</span>
                        <span className="font-mono text-emerald-400 font-bold">{evt.available_seats}/{evt.capacity}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Entry Fee</span>
                        <span className="font-mono text-primary font-black text-lg">${evt.price || "0"}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleBook(evt.id, evt.price)}
                      disabled={bookingInProgress === evt.id}
                      className={`w-full py-4 rounded-2xl font-black transition-all duration-300 ${
                        bookingInProgress === evt.id ? 'bg-slate-800 text-slate-600' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {bookingInProgress === evt.id ? 'PROCESSING...' : 'BOOK NOW'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900/30 border border-slate-800/50 p-10 rounded-[40px] grid grid-cols-2 md:grid-cols-4 gap-8">
         {[
           { label: 'Events Active', val: '24+' },
           { label: 'Users Worldwide', val: '1.2k' },
           { label: 'Booking Speed', val: '< 2s' },
           { label: 'Uptime', val: '99.9%' }
         ].map((stat, i) => (
           <div key={i} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</div>
           </div>
         ))}
      </section>
    </div>
  );
}
