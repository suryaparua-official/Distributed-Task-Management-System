"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { CheckSquare, Mail, Lock } from "lucide-react";

export default function Login() {
  const { loginUser } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await loginUser(email, password);
    if (ok) router.push("/dashboard");
    else setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080812] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-60 -left-60 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[360px]">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <CheckSquare size={17} className="text-white" />
            </div>
            <span className="text-[18px] font-semibold text-[#f1f5f9]">
              Task Manager
            </span>
          </div>
        </div>

        <div className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl p-7 shadow-2xl shadow-black/60">
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-0.5">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Sign in to continue to your workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#13131f] border border-[#1e1e30] text-[#f1f5f9] placeholder-slate-700 rounded-md py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#13131f] border border-[#1e1e30] text-[#f1f5f9] placeholder-slate-700 rounded-md py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-md transition-colors duration-150 mt-1"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
