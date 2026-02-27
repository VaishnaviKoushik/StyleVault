"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Layers, Calendar, Sparkles, Home, LogOut, Settings, Camera, Presentation, Smartphone, TrendingUp, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "My Wardrobe", icon: Shirt, href: "/wardrobe" },
  { label: "Assembler", icon: Layers, href: "/outfits" },
  { label: "Planner", icon: Calendar, href: "/planner" },
  { label: "AI Stylist", icon: Sparkles, href: "/ai-stylist" },
  { label: "Smart Shopping", icon: ShoppingBag, href: "/shopping" },
  { label: "Trend Researcher", icon: TrendingUp, href: "/trends" },
  { label: "Virtual Try-On", icon: Smartphone, href: "/try-on" },
  { label: "Presentation", icon: Presentation, href: "/proposal" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-full h-24 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-16">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tighter">StyleVault</h1>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-headline font-bold text-sm whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-white shadow-lg -translate-y-0.5" 
                    : "text-slate-400 hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-300")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
           <Link href="/add-item" className="p-3 rounded-2xl glass-card hover:bg-accent hover:text-white transition-all text-primary">
              <Camera className="h-5 w-5" />
           </Link>
           <Link href="/settings" className="p-3 rounded-2xl glass-card hover:bg-primary hover:text-white transition-all text-primary">
              <Settings className="h-5 w-5" />
           </Link>
        </div>
        <button 
          className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-headline font-bold text-sm text-white gradient-primary shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          title="Sign Out"
        >
          <span>Alex Chen</span>
          <div className="h-6 w-px bg-white/20 mx-1" />
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
