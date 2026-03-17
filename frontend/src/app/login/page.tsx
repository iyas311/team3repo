"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("/proxy/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Invalid email or password");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        // Force a layout refresh to show nav links
        window.location.href = "/";
      } else {
        const res = await fetch("/proxy/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role: "attendee" }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Registration failed");
        }

        const loginRes = await fetch("/proxy/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem("token", data.access_token);
          window.location.href = "/";
        } else {
          setIsLogin(true);
          setError("Registered! Please log in now.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="w-full max-w-lg bg-slate-900/40 backdrop-blur-xl p-10 md:p-14 rounded-[40px] border border-slate-800 shadow-2xl relative">
        <div className="text-center mb-10">
           <Link href="/" className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-6 inline-block">Team3</Link>
           <h2 className="text-4xl font-black mb-3">
             {isLogin ? "Welcome Back" : "Join the Elite"}
           </h2>
           <p className="text-slate-400 text-sm font-medium">
             {isLogin ? "Enter your credentials to access your dashboard." : "Create your account and start booking exclusive events."}
           </p>
        </div>

        {error && (
          <div className={`p-4 rounded-2xl mb-8 text-sm font-bold flex items-center space-x-3 ${
            error.startsWith("Registered") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}>
             <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
             <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all placeholder:text-slate-700"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all placeholder:text-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all placeholder:text-slate-700"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "AUTHENTICATING..." : isLogin ? "LOG IN NOW" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-slate-500 text-sm">
            {isLogin ? "Don't have an account? " : "Already a member? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }} 
              className="text-primary font-black hover:underline underline-offset-4 ml-1"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-12 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] flex space-x-8">
         <span className="cursor-pointer hover:text-slate-400 transition">Privacy Policy</span>
         <span className="cursor-pointer hover:text-slate-400 transition">Terms of Service</span>
      </div>
    </div>
  );
}
