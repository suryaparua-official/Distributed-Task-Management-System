"use client";

import { useApp } from "@/context/AppContext";
import { CheckSquare, LogOut } from "lucide-react";

export default function Navbar() {
  const { logout, role } = useApp();

  return (
    <nav className="h-14 flex items-center justify-between px-6 bg-[#0d0d1a] border-b border-[#1a1a2e] flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center flex-shrink-0">
          <CheckSquare size={14} className="text-white" />
        </div>
        <span className="font-semibold text-[#f1f5f9] tracking-tight text-[15px]">
          Task Manager
        </span>
      </div>

      <div className="flex items-center gap-3">
        {role && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              role === "admin"
                ? "bg-violet-500/10 text-violet-400 border-violet-500/25"
                : "bg-slate-800/60 text-slate-400 border-slate-700/60"
            }`}
          >
            {role}
          </span>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-150 border border-transparent hover:border-[#1a1a2e]"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </nav>
  );
}
