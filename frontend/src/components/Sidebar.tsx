"use client";

import type { ElementType } from "react";
import { LayoutDashboard, ListTodo, Shield, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

type NavItem = { name: string; icon: ElementType };

const BASE_ITEMS: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Tasks", icon: ListTodo },
  { name: "Profile", icon: User },
];

export default function Sidebar({
  active,
  setActive,
}: {
  active: string;
  setActive: (v: string) => void;
}) {
  const { role } = useApp();

  const items: NavItem[] =
    role === "admin"
      ? [...BASE_ITEMS, { name: "Admin", icon: Shield }]
      : BASE_ITEMS;

  return (
    <aside className="w-52 bg-[#0d0d1a] border-r border-[#1a1a2e] flex flex-col py-5 px-2.5 flex-shrink-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-2.5 mb-2">
        Navigation
      </p>

      <nav className="flex flex-col gap-0.5">
        {items.map(({ name, icon: Icon }) => {
          const isActive = active === name;
          return (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-500 hover:text-[#f1f5f9] hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon
                size={15}
                className={isActive ? "text-indigo-400" : "text-slate-600"}
              />
              {name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
