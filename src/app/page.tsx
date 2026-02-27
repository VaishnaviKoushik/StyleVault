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
import { MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomeScreen() {
  return (
    <AppLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        {/* 1. SMART GREETING HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-bold text-foreground tracking-tight">Good Morning, Alex ✨</h2>
            <p className="text-lg text-muted-foreground font-body italic">Your AI stylist has curated something special today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-5 py-2 rounded-full border border-white/40 shadow-sm">
              <Sun className="h-5 w-5 text-accent" />
              <span className="font-headline font-bold">72°F Sunny</span>
            </div>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-5 py-2 rounded-full border border-white/40 shadow-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Style Score</span>
              <span className="font-headline font-bold text-primary">92/100</span>
            </div>
            <div className="h-12 w-12 rounded-full p-0.5 bg-gradient-to-br from-[#6E4AE0] to-[#E879F9]">
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
        <Card className="glass-card border-none shadow-2xl overflow-hidden group">
          <div className="md:flex">
            <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <div className="grid grid-cols-2 h-full gap-0.5 bg-slate-100">
                <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" alt="Shirt" fill className="object-cover relative" />
                <div className="grid grid-rows-2 gap-0.5 h-full">
                  <Image src="https://images.unsplash.com/photo-1714143136372-ddaf8b606da7" alt="Jeans" width={300} height={300} className="object-cover w-full h-full" />
                  <Image src="https://images.unsplash.com/photo-1710632609125-da337a1e1ddd" alt="Boots" width={300} height={300} className="object-cover w-full h-full" />
                </div>
              </div>
              <div className="absolute top-6 left-6">
                <Badge className="bg-white/90 text-primary font-headline shadow-lg px-4 py-1">98% AI Match</Badge>
              </div>
            </div>
            <CardContent className="md:w-1/2 p-10 flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase">Casual</Badge>
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase">Comfortable</Badge>
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase">Brunch Ready</Badge>
                </div>
                <h3 className="text-4xl font-headline font-bold tracking-tight">Casual Coffee Run</h3>
                <p className="text-muted-foreground font-body text-lg leading-relaxed italic">
                  "A crisp white linen shirt paired with relaxed denim ensures a polished yet effortless vibe for your morning meetings."
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild className="flex-1 h-14 rounded-full gradient-pill font-headline text-lg text-white shadow-xl hover:scale-105 transition-all">
                  <Link href="/try-on">Virtual Try-On <Sparkles className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" className="h-14 w-14 rounded-full border-primary/20 text-primary hover:bg-primary/5 transition-all">
                  <Zap className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">Styled just for you by ClosetMind AI</p>
            </CardContent>
          </div>
        </Card>

        {/* 3. QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Add New Item", icon: Camera, desc: "Digitize your wardrobe", href: "/add-item", color: "from-[#6E4AE0]/10 to-[#A78BFA]/10" },
            { label: "Generate Outfit", icon: Brain, desc: "AI-powered styling", href: "/ai-stylist", color: "from-[#00C9B7]/10 to-[#00C9B7]/5" },
            { label: "Plan My Week", icon: Calendar, desc: "Schedule your looks", href: "/planner", color: "from-[#E879F9]/10 to-[#E879F9]/5" },
            { label: "Virtual Try-On", icon: Shirt, desc: "AR mirror simulation", href: "/try-on", color: "from-primary/10 to-primary/5" }
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className={cn("glass-card border-none hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center gap-4 bg-gradient-to-br", action.color)}>
                <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center text-primary">
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg">{action.label}</h4>
                  <p className="text-xs text-muted-foreground font-body">{action.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 4. QUICK STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Items", value: "42", icon: Shirt, color: "text-[#6E4AE0]" },
            { label: "Looks Created", value: "18", icon: Palette, color: "text-[#E879F9]" },
            { label: "Most Worn", value: "White Tee", icon: TrendingUp, color: "text-[#00C9B7]" },
            { label: "Style Type", value: "Minimal", icon: Brain, color: "text-primary" }
          ].map((stat) => (
            <Card key={stat.label} className="glass-card border-none p-6">
              <div className="flex items-center gap-4">
                <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-headline font-bold">{stat.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 5. HOW YOUR AI STYLIST WORKS */}
        <section className="space-y-8 py-10">
          <h3 className="text-3xl font-headline font-bold text-center flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" /> How Your AI Stylist Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Understand Closet", desc: "AI analyzes photos using vision models.", icon: Camera },
              { step: 2, title: "Learn Preferences", desc: "Tracks colors, patterns & frequency.", icon: Brain },
              { step: 3, title: "Check External", desc: "Integrates weather & calendar data.", icon: CloudSun },
              { step: 4, title: "Generate Look", desc: "Recommends smart outfits instantly.", icon: Sparkles }
            ].map((step) => (
              <div key={step.step} className="relative group text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-white shadow-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-primary/20 transition-all border border-slate-50">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-lg">Step {step.step}: {step.title}</h4>
                  <p className="text-xs text-muted-foreground font-body">{step.desc}</p>
                </div>
                {step.step < 4 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-px bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6 & 7. PLANNER & INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Planner Preview */}
          <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/40">
              <h4 className="text-2xl font-headline font-bold flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" /> Upcoming Events
              </h4>
              <Link href="/planner" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View Full Planner</Link>
            </div>
            <CardContent className="p-8">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[
                  { day: "Today", date: "Mar 22", outfit: "Casual Coffee", weather: "Sun", color: "bg-accent/10" },
                  { day: "Tomorrow", date: "Mar 23", outfit: "Office Chic", weather: "Cloud", color: "bg-primary/10" },
                  { day: "Friday", date: "Mar 24", outfit: "Date Night", weather: "Sun", color: "bg-pink-100/50" },
                  { day: "Saturday", date: "Mar 25", outfit: "Yoga Look", weather: "Rain", color: "bg-teal-100/50" }
                ].map((item) => (
                  <div key={item.date} className="min-w-[160px] flex flex-col gap-3 group">
                    <div className={cn("aspect-square rounded-[2rem] p-4 flex flex-col items-center justify-center text-center space-y-1 group-hover:scale-105 transition-all shadow-sm", item.color)}>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{item.day}</p>
                      <p className="text-xl font-headline font-bold">{item.date}</p>
                      <Sun className="h-5 w-5 opacity-40" />
                    </div>
                    <p className="text-xs font-headline font-bold text-center truncate px-2">{item.outfit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Style Insights */}
          <Card className="glass-card border-none p-8 space-y-8 bg-gradient-to-br from-white to-primary/5">
            <h4 className="text-2xl font-headline font-bold flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" /> Style Insights
            </h4>
            <div className="space-y-6">
              {[
                { label: "Neutral Tones Preference", value: 63, text: "You wear neutral tones 63% of the time." },
                { label: "Item Recency", value: 20, text: "You haven’t worn your leather jacket in 21 days." },
                { label: "Weekend Vibes", value: 85, text: "You prefer casual outfits on weekends." }
              ].map((insight) => (
                <div key={insight.label} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{insight.label}</p>
                    <p className="text-xs font-headline font-bold text-primary">{insight.value}%</p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full gradient-pill" style={{ width: `${insight.value}%` }} />
                  </div>
                  <p className="text-xs font-body italic text-muted-foreground">{insight.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 8. RECENTLY ADDED ITEMS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-headline font-bold">Recently Added</h3>
            <Link href="/wardrobe" className="text-sm font-bold text-primary hover:underline font-headline flex items-center gap-1">
              VIEW FULL CLOSET <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
            {MOCK_WARDROBE.slice(0, 6).map((item) => (
              <div key={item.id} className="min-w-[180px] group relative space-y-3 cursor-pointer">
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 border-2 border-transparent group-hover:border-primary/20 bg-white">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="h-3 w-3 text-accent" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/90 text-[8px] font-bold uppercase border-none shadow-md">Worn 3x</Badge>
                  </div>
                </div>
                <div className="px-2">
                  <p className="text-xs font-bold font-headline truncate group-hover:text-primary transition-colors">{item.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating AI Chat Trigger */}
        <Button className="fixed bottom-8 right-8 h-16 px-8 rounded-full gradient-pill shadow-2xl border-glow text-white font-headline text-lg group z-50">
          <Brain className="mr-3 h-6 w-6 group-hover:animate-pulse" />
          Ask your stylist...
        </Button>
      </div>
    </AppLayout>
  );
}
