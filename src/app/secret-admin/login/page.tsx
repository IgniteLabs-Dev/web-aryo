"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/secret-admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 mb-4">
            <Shield className="w-10 h-10 text-brand-yellow" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0a1729] border border-slate-800 rounded-2xl p-8 space-y-5 shadow-2xl">
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-slate-100 outline-none transition-all"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-slate-100 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-yellow hover:bg-brand-yellow-dark disabled:bg-slate-700 text-[#030c17] font-bold shadow-lg active:scale-95 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
