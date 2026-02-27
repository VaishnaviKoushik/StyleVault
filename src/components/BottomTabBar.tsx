'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shirt, Sparkles, User, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Shirt, label: 'Closet', href: '/wardrobe' },
  { icon: PlusCircle, label: 'Add', href: '/add-item', primary: true },
  { icon: Sparkles, label: 'Magic', href: '/ai-stylist' },
  { icon: User, label: 'Me', href: '/settings' },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#F2F2F7] h-[88px] flex items-start justify-around px-4 pt-3 pb-8 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        
        if (tab.primary) {
          return (
            <Link key={tab.href} href={tab.href} className="relative -top-8">
              <div className="h-14 w-14 rounded-full gradient-pill border-glow flex items-center justify-center text-white shadow-xl">
                <Icon className="h-7 w-7" />
              </div>
            </Link>
          );
        }

        return (
          <Link 
            key={tab.href} 
            href={tab.href} 
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-[#6E4AE0]" : "text-[#8E8E93]"
            )}
          >
            <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-headline font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}