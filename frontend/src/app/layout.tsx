import type { Metadata } from 'next'
import './globals.css'
import LogoutButton from './LogoutButton'

export const metadata: Metadata = {
  title: 'Team 3 Interactive Platform',
  description: 'Manage Events, Bookings and More',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <header className="w-full bg-slate-900 border-b border-slate-800 p-4">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Team3 Platform</a>
            <div className="space-x-4">
              <a href="/" className="hover:text-primary transition">Events</a>
              {/* <a href="/bookings" className="hover:text-primary transition">Bookings</a> */}
              <a href="/login" className="hover:text-primary transition">Login / Register</a>
              <LogoutButton />
            </div>
          </nav>
        </header>

        <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </main>

        <footer className="w-full bg-slate-900 border-t border-slate-800 p-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Team 3 Microservices Platform
        </footer>
      </body>
    </html>
  )
}
