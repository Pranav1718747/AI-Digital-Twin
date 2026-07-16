"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Network, Workflow, Search, Users, Settings, LogOut, Activity, TrendingUp, LineChart, Megaphone, FolderKanban, Headphones, Cpu, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Knowledge Graph", href: "/graph", icon: Network },
  { name: "SOP Workflows", href: "/workflows", icon: Workflow },
  { name: "Agent Search", href: "/search", icon: Search },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Employee Simulator", href: "/employees-simulator", icon: Activity },
  { name: "Finance Simulator", href: "/finance-simulator", icon: TrendingUp },
  { name: "Sales Simulator", href: "/sales-simulator", icon: LineChart },
  { name: "Marketing Simulator", href: "/marketing-simulator", icon: Megaphone },
  { name: "Project Simulator", href: "/project-simulator", icon: FolderKanban },
  { name: "Customer Support Simulator", href: "/customer-support-simulator", icon: Headphones },
  { name: "AI Automation Simulator", href: "/ai-automation-simulator", icon: Cpu },
  { name: "Company Health Simulator", href: "/company-health-simulator", icon: Heart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-y-0 border-l-0 rounded-none h-screen flex flex-col sticky top-0 z-40 bg-background/40">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
          SentinelOS
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/10 rounded-lg border border-white/5"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative px-4 py-3 flex items-center gap-3 rounded-lg transition-colors ${
                isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
                <item.icon size={18} className={isActive ? "text-indigo-400" : ""} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="px-4 py-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-xs text-indigo-300">
          Clearance Level: <span className="font-bold text-indigo-400">Level 5 (Admin)</span>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2.5 flex items-center gap-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-sm font-medium cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
