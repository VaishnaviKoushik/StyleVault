'use client';

import { useState, useEffect } from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

export function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 h-[59px] flex items-center justify-between px-8 z-50 pointer-events-none">
      <span className="text-[15px] font-bold tracking-tight text-[#1C1C1E]">{time}</span>
      <div className="flex items-center gap-1.5 text-[#1C1C1E]">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <div className="relative">
          <Battery className="h-5 w-5" />
          <div className="absolute right-[3px] top-[7px] h-2 w-3 bg-[#1C1C1E] rounded-[1px]" />
        </div>
      </div>
    </div>
  );
}