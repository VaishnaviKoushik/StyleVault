
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Layers, Calendar, Sparkles, Home, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Wardrobe Catalog", icon: Shirt, href: "/wardrobe" },
  { label: "Outfit Assembler", icon: Layers, href: "/outfits" },
  { label: "Outfit Planner", icon: Calendar, href: "/planner" },
  { label: "AI Stylist", icon: Sparkles, href: "/ai-stylist" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-white border-r border-border flex flex-col p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">ClosetMind</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-headline font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t">
        <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors w-full">
          <LogOut className="h-5 w-5" />
          <span className="font-headline font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}
