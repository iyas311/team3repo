"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // Use OAuth2 Form Data for /login if needed, but we'll try JSON first.
        // Actually, OAuth2PasswordRequestForm requires form-data with 'username' and 'password'
        const formData = new URLSearchParams();
        formData.append("username", email); // Swagger usually maps username to email
        formData.append("password", password);

        const res = await fetch("/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });
        
        // If 4XX/5XX, let's try JSON just in case the backend uses custom JSON 
        if (!res.ok) {
           const jsonRes = await fetch("/users/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
           });
           if (!jsonRes.ok) throw new Error("Login failed");
           const data = await jsonRes.json();
           localStorage.setItem("token", data.access_token);
        } else {
           const data = await res.json();
           localStorage.setItem("token", data.access_token);
        }
        
        router.push("/");
      } else {
        // Register relies on JSON
        const res = await fetch("/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) throw new Error("Registration failed");
        setIsLogin(true); // Switch to login
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/80 transition">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
