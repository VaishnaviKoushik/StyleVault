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
    <div className="w-80 h-full flex flex-col p-8 bg-white/50 backdrop-blur-md">
      <div className="mb-12 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">ClosetMind</h1>
      </div>
      
      <nav className="flex-1 space-y-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-white")} />
              <span className="font-headline font-bold text-lg">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t pt-8">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-muted-foreground hover:text-primary",
            pathname === "/settings" && "bg-primary/5 text-primary"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="font-headline font-bold text-lg">Settings</span>
        </Link>
        <button className="flex items-center gap-4 px-5 py-4 rounded-2xl text-muted-foreground hover:text-destructive transition-colors w-full group">
          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-headline font-bold text-lg">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
