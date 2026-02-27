"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Layers, Calendar, Sparkles, Home, LogOut, FileText, Settings, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Catalog", icon: Shirt, href: "/wardrobe" },
  { label: "Assembler", icon: Layers, href: "/outfits" },
  { label: "Planner", icon: Calendar, href: "/planner" },
  { label: "AI Stylist", icon: Sparkles, href: "/ai-stylist" },
  { label: "AR Try-On", icon: PlusCircle, href: "/try-on" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-full h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">StyleVault</h1>
        </Link>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all font-headline font-bold text-sm whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-white shadow-md" 
                    : "text-slate-400 hover:text-primary hover:bg-slate-50"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-300")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className={cn(
            "p-2 rounded-full transition-all text-slate-400 hover:text-primary hover:bg-slate-50",
            pathname === "/settings" && "text-primary bg-slate-50"
          )}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-full font-headline font-bold text-sm text-slate-400 hover:text-destructive hover:bg-red-50 transition-all group"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 text-slate-300 group-hover:text-destructive" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
