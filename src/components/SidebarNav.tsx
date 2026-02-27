"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Layers, Calendar, Sparkles, Home, LogOut, FileText, Settings, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Digital Catalog", icon: Shirt, href: "/wardrobe" },
  { label: "Outfit Assembler", icon: Layers, href: "/outfits" },
  { label: "Smart Planner", icon: Calendar, href: "/planner" },
  { label: "AI Personal Stylist", icon: Sparkles, href: "/ai-stylist" },
  { label: "AR Try-On", icon: PlusCircle, href: "/try-on" },
  { label: "Project Brief", icon: FileText, href: "/proposal" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-72 h-full flex flex-col p-6 bg-white border-r border-slate-100">
      <div className="mb-10 flex items-center gap-2 px-2">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold font-headline text-primary">ClosetMind</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-4 mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-headline font-bold",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:text-primary hover:bg-slate-50"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-300 group-hover:text-primary")} />
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-headline font-bold text-slate-400 hover:text-primary hover:bg-slate-50",
            pathname === "/settings" && "text-primary bg-slate-50"
          )}
        >
          <Settings className="h-5 w-5 text-slate-300" />
          <span className="text-base">Settings</span>
        </Link>
        <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-headline font-bold text-slate-400 hover:text-destructive w-full group">
          <LogOut className="h-5 w-5 text-slate-300 group-hover:text-destructive" />
          <span className="text-base">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
