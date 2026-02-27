
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Layers, Calendar, Sparkles, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Wardrobe", icon: Shirt, href: "/wardrobe" },
  { label: "Outfits", icon: Layers, href: "/outfits" },
  { label: "Planner", icon: Calendar, href: "/planner" },
  { label: "AI Stylist", icon: Sparkles, href: "/ai-stylist" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border flex items-center justify-around h-16 px-2 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-colors",
              isActive ? "text-accent" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5 mb-1", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium font-headline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
