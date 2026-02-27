'use client';

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Camera, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Sun, 
  ChevronRight, 
  Brain, 
  Calendar, 
  Palette,
  Clock,
  Shirt,
  TrendingUp,
  CloudSun
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StyleVaultChat } from "@/components/StyleVaultChat";

export default function HomeScreen() {
  return (
    <AppLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        {/* 1. SMART GREETING HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-bold text-foreground tracking-tight">Good Morning, Alex ✨</h2>
            <p className="text-lg text-muted-foreground font-body italic">Your StyleVault stylist has curated something special today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 glass-card px-5 py-2 rounded-full shadow-sm">
              <Sun className="h-5 w-5 text-accent" />
              <span className="font-headline font-bold">72°F Sunny</span>
            </div>
            <div className="flex items-center gap-3 glass-card px-5 py-2 rounded-full shadow-sm">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Style Score</span>
              <span className="font-headline font-bold text-primary">92/100</span>
            </div>
            <div className="h-12 w-12 rounded-full p-0.5 bg-gradient-to-br from-primary to-accent">
              <Image 
                src="https://picsum.photos/seed/alex/200" 
                alt="Profile" 
                width={48} 
                height={48} 
                className="rounded-full object-cover border-2 border-white"
              />
            </div>
          </div>
        </header>

        {/* 2. HERO SECTION – TODAY’S AI OUTFIT */}
        <Card className="glass-card border-none shadow-2xl overflow-hidden group relative">
          <div className="md:flex">
            <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <div className="grid grid-cols-2 h-full gap-0.5 bg-slate-100">
                <div className="relative h-full w-full">
                  <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" alt="Shirt" fill className="object-cover" />
                </div>
                <div className="grid grid-rows-2 gap-0.5 h-full">
                  <div className="relative h-full w-full">
                    <Image src="https://images.unsplash.com/photo-1714143136372-ddaf8b606da7" alt="Jeans" fill className="object-cover" />
                  </div>
                  <div className="relative h-full w-full">
                    <Image src="https://images.unsplash.com/photo-1710632609125-da337a1e1ddd" alt="Boots" fill className="object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute top-6 left-6">
                <Badge className="bg-white/90 text-primary font-headline shadow-lg px-4 py-1">98% AI Match</Badge>
              </div>
            </div>
            <CardContent className="md:w-1/2 p-10 flex flex-col justify-center space-y-8 relative z-10 bg-white/40 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase px-3">Casual</Badge>
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase px-3">Comfortable</Badge>
                </div>
                <h3 className="text-4xl font-headline font-bold tracking-tight text-primary">The "Morning Meetings" Look</h3>
                <p className="text-muted-foreground font-body text-lg leading-relaxed italic">
                  "A crisp white linen shirt paired with relaxed denim ensures a polished yet effortless vibe for your busy Monday schedule."
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild className="flex-1 h-14 rounded-full gradient-primary font-headline text-lg text-white shadow-xl hover:scale-[1.02] transition-all">
                  <Link href="/planner">Schedule for Today <Calendar className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" className="h-14 w-14 rounded-full border-primary/20 text-primary hover:bg-primary/5 transition-all">
                  <Zap className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center opacity-60">Styled exclusively for you by StyleVault AI</p>
            </CardContent>
          </div>
        </Card>

        {/* 3. QUICK ACTIONS GRID - CARD SYSTEM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Add New Item", icon: Camera, desc: "Digitize your closet", href: "/add-item", color: "from-primary/10 to-primary/5" },
            { label: "AI Stylist", icon: Brain, desc: "Powered by Gemini", href: "/ai-stylist", color: "from-accent/10 to-accent/5" },
            { label: "My Outfits", icon: Palette, desc: "Signature looks", href: "/outfits", color: "from-primary/10 to-accent/5" },
            { label: "AR Try-On", icon: Shirt, desc: "Virtual mirror", href: "/try-on", color: "from-accent/10 to-primary/5" }
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className={cn("glass-card border-none hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center text-center gap-4 bg-gradient-to-br", action.color)}>
                <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <action.icon className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-xl">{action.label}</h4>
                  <p className="text-xs text-muted-foreground font-body opacity-80">{action.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 4. ANALYTICS & STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card border-none p-8 flex items-center gap-6">
             <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="h-8 w-8" />
             </div>
             <div>
                <p className="text-4xl font-headline font-bold">128</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Closet Value</p>
             </div>
          </Card>
          <Card className="glass-card border-none p-8 flex items-center gap-6">
             <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Sparkles className="h-8 w-8" />
             </div>
             <div>
                <p className="text-4xl font-headline font-bold">42</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Outfits Created</p>
             </div>
          </Card>
          <Card className="glass-card border-none p-8 flex items-center gap-6">
             <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-8 w-8" />
             </div>
             <div>
                <p className="text-4xl font-headline font-bold">12</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Planned Events</p>
             </div>
          </Card>
        </div>

        {/* 5. STYLEVAULT TECHNOLOGY PREVIEW */}
        <section className="py-12 px-10 rounded-[3rem] bg-primary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-3/5 space-y-6">
              <Badge className="bg-accent text-primary font-headline uppercase px-4 py-1">Advanced AI</Badge>
              <h3 className="text-5xl font-headline font-bold">Redefining Personal Style with Gemini</h3>
              <p className="text-lg opacity-80 font-body leading-relaxed">
                StyleVault uses state-of-the-art vision and language models to understand your clothing preferences, local weather, and calendar events to recommend the perfect look, every single time.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-accent" />
                   <span className="text-sm font-headline">Vision Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-accent" />
                   <span className="text-sm font-headline">Predictive Planning</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
               <div className="h-48 w-48 rounded-full border-4 border-accent/30 flex items-center justify-center animate-pulse">
                  <Brain className="h-24 w-24 text-accent" />
               </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating AI Chat Trigger */}
      <StyleVaultChat />
    </AppLayout>
  );
}