"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Sparkles, Home, LogOut, Settings, Camera, Presentation, ShoppingBag, TrendingUp, Zap, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Master Vault", icon: Shirt, href: "/wardrobe" },
  { label: "AI Stylist", icon: Sparkles, href: "/ai-stylist" },
  { label: "Color Lab", icon: Palette, href: "/try-on" },
  { label: "Shopping", icon: ShoppingBag, href: "/shopping" },
  { label: "Trends", icon: TrendingUp, href: "/trends" },
  { label: "Presentation", icon: Presentation, href: "/proposal" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-full h-28 flex items-center justify-between px-12 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-xl fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-[0_15px_30px_-5px_rgba(0,61,62,0.4)] group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="flex flex-col -space-y-1">
            <h1 className="text-4xl font-bold font-headline text-primary tracking-tighter">StyleVault</h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Intelligence</span>
          </div>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith('/wardrobe') && item.href === '/wardrobe');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-500 font-headline font-bold text-sm whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-white shadow-2xl -translate-y-1" 
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
        <div className="hidden xl:flex items-center gap-3">
           <Link href="/add-item" className="p-4 rounded-2xl glass-card hover:bg-accent hover:text-white transition-all text-primary group shadow-lg">
              <Camera className="h-6 w-6 group-hover:scale-110 transition-transform" />
           </Link>
           <Link href="/settings" className="p-4 rounded-2xl glass-card hover:bg-primary hover:text-white transition-all text-primary group shadow-lg">
              <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform" />
           </Link>
        </div>
        <button 
          className="flex items-center gap-4 px-8 py-4 rounded-full font-headline font-bold text-lg text-white gradient-pill shadow-[0_15px_30px_-5px_rgba(0,61,62,0.3)] hover:scale-105 transition-all active:scale-95 group"
        >
          <Zap className="h-5 w-5 text-accent animate-pulse" />
          <span>Optimize</span>
          <div className="h-6 w-px bg-white/20 mx-1" />
          <LogOut className="h-5 w-5 opacity-60 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
