'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera, MapPin, Zap, ArrowRight, Sun } from "lucide-react";
import { MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function HomeScreen() {
  const [showOnboarding, setShowOnboarding] = useState(false); // Can be driven by localstorage

  return (
    <div className="px-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-headline font-bold text-[#1C1C1E]">Hi, Fashionista ✨</h2>
          <div className="flex items-center gap-1.5 text-[#8E8E93]">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs font-body">San Francisco, CA</span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full border-2 border-[#6E4AE0] p-0.5">
          <Image 
            src="https://picsum.photos/seed/user1/200" 
            alt="Profile" 
            width={48} 
            height={48} 
            className="rounded-full object-cover"
          />
        </div>
      </header>

      {/* Weather Chip */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Sun className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold font-headline">72°F & Sunny</p>
            <p className="text-[10px] text-[#8E8E93] font-body">Perfect for light layers</p>
          </div>
        </div>
        <Link href="/ai-stylist">
          <Button variant="ghost" size="sm" className="text-[#6E4AE0] text-[10px] font-bold">
            GET STYLE TIPS <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Hero Suggestion */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-headline font-bold">Today's Look</h3>
          <Badge variant="secondary" className="bg-[#6E4AE0]/10 text-[#6E4AE0] font-headline">98% Match</Badge>
        </div>
        <div className="glass-card rounded-[32px] overflow-hidden border-glow">
          <div className="relative aspect-[4/5]">
            <Image 
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
              alt="Today's Outfit" 
              fill 
              className="object-cover"
              data-ai-hint="white shirt"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <h4 className="text-xl font-headline font-bold">Casual Coffee Run</h4>
              <p className="text-sm font-body text-white/80 line-clamp-1 italic">Classic whites and denim for a relaxed morning.</p>
              <div className="flex gap-2">
                <Link href="/ai-stylist" className="flex-1">
                  <Button className="w-full rounded-full bg-white text-[#6E4AE0] hover:bg-white/90 font-headline">
                    View Details
                  </Button>
                </Link>
                <Link href="/try-on">
                  <Button variant="outline" className="rounded-full border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 px-3">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <p className="text-2xl font-bold font-headline text-[#6E4AE0]">{MOCK_WARDROBE.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold">Items</p>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <p className="text-2xl font-bold font-headline text-[#00C9B7]">12</p>
          <p className="text-[10px] uppercase tracking-wider text-[#8E8E93] font-bold">Outfits</p>
        </div>
      </div>

      {/* Wardrobe Glance */}
      <section className="space-y-3 pb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-headline font-bold">Wardrobe Glance</h3>
          <Link href="/wardrobe" className="text-xs font-bold text-[#6E4AE0] font-headline">SEE ALL</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          {MOCK_WARDROBE.slice(0, 5).map((item) => (
            <div key={item.id} className="min-w-[120px] space-y-2">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>
              <p className="text-[10px] font-bold font-headline truncate">{item.name}</p>
            </div>
          ))}
          <Link href="/wardrobe" className="min-w-[120px] aspect-[3/4] rounded-2xl bg-[#6E4AE0]/5 border-2 border-dashed border-[#6E4AE0]/20 flex flex-col items-center justify-center text-[#6E4AE0] gap-2">
            <Camera className="h-6 w-6" />
            <span className="text-[10px] font-bold font-headline">ADD NEW</span>
          </Link>
        </div>
      </section>
    </div>
  );
}