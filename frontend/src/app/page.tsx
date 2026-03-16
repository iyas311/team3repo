"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check auth
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Fetch Events via NGINX API route -> EventService
    fetch("/api/v1/events/")
      .then(res => res.json())
      .then(data => {
        // Fastapi might return a list directly, or under a key
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
      alert("Please log in first to book an event.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/bookings/", {
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
        alert("Booking successful! Payment initiated in background.");
      } else {
        const err = await res.json();
        alert(`Booking failed: ${JSON.stringify(err)}`);
      }
    } catch (e: any) {
      alert("Booking error: " + e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Welcome to <span className="text-primary">Team3</span> Platform
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          A seamless experience connecting you to events, bookings, and seamless payments driven by our hyper-scalable microservices backend.
        </p>
      </div>

      {!token && (
        <button 
          onClick={() => router.push("/login")}
          className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/80 transition shadow-lg shadow-primary/25"
        >
          Login / Register to Start
        </button>
      )}

      <div className="w-full mt-12">
        <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">Upcoming Events</h3>
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Loading Events from Backend...</div>
        ) : events.length === 0 ? (
           <div className="text-center text-slate-400 py-12">No events found. Start by creating one from the API!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt, idx) => (
              <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-primary transition duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{evt.name || "Unnamed Event"}</h3>
                  <p className="text-slate-400 mb-4 text-sm">{evt.description || "No description provided."}</p>
                  
                  <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg mb-6 text-sm">
                     <div>
                        <span className="block text-slate-500 text-xs">Capacity</span>
                        <span className="font-mono text-emerald-400">{evt.available_seats}/{evt.capacity}</span>
                     </div>
                     <div className="text-right">
                        <span className="block text-slate-500 text-xs">Price</span>
                        <span className="font-mono text-primary font-bold">${evt.price || "Free"}</span>
                     </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleBook(evt.id, evt.price)}
                  className="bg-primary/20 text-primary px-4 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition w-full"
                >
                  Book Seat Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
