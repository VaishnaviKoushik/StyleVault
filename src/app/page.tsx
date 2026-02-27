'use client';

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera, MapPin, Zap, ArrowRight, Sun, ChevronRight } from "lucide-react";
import { MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HomeScreen() {
  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-foreground">Welcome back, Alex ✨</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-body">San Francisco, CA</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border">
            <div className="px-4 py-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Style Score</p>
              <p className="text-lg font-headline font-bold text-primary">92/100</p>
            </div>
            <div className="h-12 w-12 rounded-full border-2 border-primary p-0.5">
              <Image 
                src="https://picsum.photos/seed/user1/200" 
                alt="Profile" 
                width={48} 
                height={48} 
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weather & Quick Suggestion */}
            <Card className="glass-card border-none shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto">
                  <Image 
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                    alt="Today's Look" 
                    fill 
                    className="object-cover"
                    data-ai-hint="white shirt"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary font-headline shadow-lg">Today's Selection</Badge>
                  </div>
                </div>
                <CardContent className="md:w-1/2 p-8 flex flex-col justify-center space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Sun className="h-7 w-7 text-accent" />
                    </div>
                    <div>
                      <p className="text-xl font-bold font-headline">72°F & Sunny</p>
                      <p className="text-sm text-muted-foreground font-body">Ideal for light linen layers</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold">Casual Coffee Run</h3>
                    <p className="text-muted-foreground font-body leading-relaxed">
                      "A crisp white linen shirt paired with relaxed denim ensures a polished yet effortless vibe for your morning meetings."
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 font-headline text-white shadow-lg shadow-primary/20">
                      <Link href="/ai-stylist">View Styling Tips</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 w-12 rounded-full border-primary text-primary p-0 hover:bg-primary/5 transition-colors">
                      <Link href="/try-on"><Sparkles className="h-5 w-5" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Wardrobe Glance */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-headline font-bold">From Your Catalog</h3>
                <Link href="/wardrobe" className="text-sm font-bold text-primary hover:underline font-headline flex items-center gap-1">
                  VIEW FULL CLOSET <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {MOCK_WARDROBE.slice(0, 4).map((item) => (
                  <div key={item.id} className="group relative space-y-2 cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all border border-transparent group-hover:border-accent">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs font-bold font-headline truncate">{item.name}</p>
                  </div>
                ))}
                <Link href="/add-item" className="aspect-[3/4] rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary gap-2 hover:bg-primary/10 transition-colors">
                  <Camera className="h-8 w-8" />
                  <span className="text-xs font-bold font-headline">ADD NEW</span>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white p-6 space-y-6">
              <h4 className="font-headline font-bold text-lg border-b pb-2">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-2xl p-4 text-center space-y-1">
                  <p className="text-3xl font-bold font-headline text-primary">{MOCK_WARDROBE.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Items</p>
                </div>
                <div className="bg-accent/10 rounded-2xl p-4 text-center space-y-1">
                  <p className="text-3xl font-bold font-headline text-accent">12</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Looks</p>
                </div>
              </div>
              <Button asChild className="w-full gradient-pill font-headline h-12 shadow-lg shadow-primary/20 text-white">
                <Link href="/add-item">
                  <Zap className="mr-2 h-4 w-4" /> New AI Analysis
                </Link>
              </Button>
            </Card>

            <Card className="border-none shadow-lg bg-white p-6 space-y-4">
              <h4 className="font-headline font-bold text-lg border-b pb-2">Upcoming Events</h4>
              <div className="space-y-4">
                {[
                  { title: "Team Lunch", date: "Tomorrow, 12:30 PM", icon: "🍱" },
                  { title: "Gala Night", date: "Saturday, 7:00 PM", icon: "✨" }
                ].map((ev, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <span className="text-2xl">{ev.icon}</span>
                    <div>
                      <p className="text-sm font-bold font-headline">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">{ev.date}</p>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <Button asChild variant="ghost" className="w-full text-primary font-headline text-sm hover:bg-primary/5">
                <Link href="/planner">Manage Schedule</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
