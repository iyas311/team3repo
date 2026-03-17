"use client";

import './globals.css'
import LogoutButton from './LogoutButton'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Listen for storage changes (for same-domain tabs) or custom events
    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  return (
    <html lang="en">
      <body className="antialiased font-sans flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <header className="w-full bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Team3 Platform
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="hover:text-primary transition text-sm font-medium">Events</Link>
              {isLoggedIn && (
                <>
                  <Link href="/bookings" className="hover:text-primary transition text-sm font-medium">My Bookings</Link>
                  <Link href="/tickets" className="hover:text-primary transition text-sm font-medium">My Tickets</Link>
                </>
              )}
              {!isLoggedIn ? (
                <Link href="/login" className="hover:text-primary transition text-sm font-medium bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                  Login / Register
                </Link>
              ) : (
                <div className="flex items-center space-x-4 border-l border-slate-700 pl-4">
                  <LogoutButton />
                </div>
              )}
            </div>
          </nav>
        </header>

        <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </main>

        <footer className="w-full bg-slate-900 border-t border-slate-800 p-8 text-center text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>&copy; {new Date().getFullYear()} Team 3 Microservices Platform</div>
            <div className="flex space-x-6">
              <span className="hover:text-slate-200 cursor-pointer transition">Status</span>
              <span className="hover:text-slate-200 cursor-pointer transition">Docs</span>
              <span className="hover:text-slate-200 cursor-pointer transition">Support</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
