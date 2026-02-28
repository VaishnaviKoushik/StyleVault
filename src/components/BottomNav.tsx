"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Home, PlusCircle, Presentation, Layers, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Vault", icon: Shirt, href: "/wardrobe" },
  { label: "Add", icon: PlusCircle, href: "/add-item", primary: true },
  { label: "Capsule", icon: Layers, href: "/capsule" },
  { label: "Radar", icon: Radio, href: "/trend-radar" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around h-20 px-4 pb-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith('/wardrobe') && item.href === '/wardrobe');
        const Icon = item.icon;
        
        if (item.primary) {
          return (
            <Link key={item.href} href={item.href} className="relative -top-6">
              <div className="h-14 w-14 rounded-full gradient-pill border-glow flex items-center justify-center text-white shadow-xl">
                <Icon className="h-7 w-7" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-all",
              isActive ? "text-primary scale-110" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-6 w-6 mb-1", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-bold font-headline uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
