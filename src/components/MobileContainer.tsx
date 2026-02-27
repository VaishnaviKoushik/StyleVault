'use client';

import { StatusBar } from './StatusBar';
import { BottomTabBar } from './BottomTabBar';

export function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-container group">
      <StatusBar />
      <div className="h-full overflow-y-auto scrollbar-hide bg-[#F8F9FF] relative pt-[59px] pb-[88px]">
        {children}
      </div>
      <BottomTabBar />
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-[#1C1C1E] rounded-full z-[60]" />
    </div>
  );
}