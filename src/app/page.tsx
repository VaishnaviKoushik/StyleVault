'use client';

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Camera, 
  Brain, 
  Palette,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Search,
  Calendar,
  Cpu,
  Layers,
  ChevronRight,
  Zap,
  CheckCircle2,
  Presentation,
  Droplets,
  Radio
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StyleVaultChat } from "@/components/StyleVaultChat";
import { OnboardingTour } from "@/components/OnboardingTour";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function HomeScreen() {
  return (
    <AppLayout>
      <OnboardingTour />
      <div className="flex flex-col w-full">
        
        {/* FULL-BLEED HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden section-rhythm-dark">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#002526] via-[#002526]/80 to-transparent z-10" />
            <Image 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" 
              alt="Luxury Fashion" 
              fill 
              className="object-cover object-right opacity-60"
              priority
              data-ai-hint="luxury clothing"
            />
          </div>

          <div className="container mx-auto px-6 lg:px-12 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10 animate-entrance">
              <Badge className="bg-accent text-primary font-headline uppercase px-6 py-2 tracking-[0.3em] border-none text-xs">
                Generative Wardrobe Intelligence
              </Badge>
              <h1 className="text-7xl md:text-9xl font-headline font-bold leading-[0.85] tracking-tighter text-white">
                Style is <br/>
                <span className="text-accent italic block mt-4 underline decoration-accent/20 underline-offset-8">Algorithmic.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-slate-300 font-body italic leading-relaxed max-w-xl border-l-4 border-accent pl-8 py-2">
                "Transforming your physical inventory into a dynamic, high-performance digital asset."
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <Button asChild className="h-20 px-12 rounded-full gradient-gold text-primary font-headline text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  <Link href="/add-item">Digitize Now <ChevronRight className="ml-2 h-8 w-8" /></Link>
                </Button>
                <Button asChild className="h-20 px-12 rounded-full bg-white text-primary font-headline text-2xl hover:bg-white/90 active:scale-95 transition-all shadow-2xl">
                  <Link href="/ai-stylist">Consult AI Stylist</Link>
                </Button>
                <Button variant="ghost" asChild className="h-20 px-12 rounded-full text-accent hover:text-white hover:bg-white/5 active:scale-95 transition-all font-headline text-xl flex items-center gap-3">
                  <Link href="/proposal"><Presentation className="h-6 w-6" /> View Presentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SMART STYLE TOOLS - GRID SYSTEM */}
        <section className="py-32 section-rhythm-accent">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col items-center text-center gap-8 mb-20">
              <div className="space-y-4 max-w-4xl mx-auto">
                <h3 className="text-5xl md:text-7xl font-headline font-bold text-primary italic leading-none text-center">
                  The Intelligent <span className="text-accent">Studio.</span>
                </h3>
                <p className="text-xl md:text-2xl text-muted-foreground font-body italic leading-relaxed text-center">
                  "Specialized modules designed to decode trends, optimize acquisitions, and orchestrate your visual identity."
                </p>
              </div>
              <Link href="/wardrobe" className="group flex items-center gap-3 text-primary font-headline font-bold text-xl hover:text-accent transition-colors">
                Explore Master Vault <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Capsule", icon: Layers, desc: "Minimalist Core", href: "/capsule", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Trend Radar", icon: Radio, desc: "Alignment Engine", href: "/trend-radar", color: "text-rose-600", bg: "bg-rose-50" },
                { label: "AI Stylist", icon: Brain, desc: "Generative Logic", href: "/ai-stylist", color: "text-teal-600", bg: "bg-teal-50" },
                { label: "Shopping", icon: ShoppingBag, desc: "Gap Analysis", href: "/shopping", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Catalog", icon: Camera, desc: "AI Vision Vault", href: "/add-item", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Color Lab", icon: Droplets, desc: "Harmony Analysis", href: "/try-on", color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Trends", icon: Search, desc: "Global Forecaster", href: "/trends", color: "text-slate-600", bg: "bg-slate-50" },
                { label: "Journal", icon: Calendar, desc: "Styling Agenda", href: "/wardrobe?tab=journal", color: "text-emerald-600", bg: "bg-emerald-50" }
              ].map((action, idx) => (
                <Link key={action.label} href={action.href} className="group">
                  <Card className={cn("glass-card border-none hover:-translate-y-4 active:scale-95 transition-all duration-500 p-8 flex flex-col items-center text-center gap-6 h-full relative overflow-hidden")}>
                    <div className={cn("h-20 w-20 rounded-[2rem] shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 z-10", action.bg, action.color)}>
                      <action.icon className="h-10 w-10" />
                    </div>
                    <div className="space-y-2 z-10">
                      <h4 className="font-headline font-bold text-2xl text-primary">{action.label}</h4>
                      <p className="text-[10px] text-muted-foreground font-body font-bold uppercase tracking-widest opacity-60">{action.desc}</p>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                      <action.icon className="h-24 w-24" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* REFINE YOUR COLLECTIONS - BOLD SPLIT */}
        <section className="py-32 section-rhythm-light overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10 order-2 lg:order-1">
                <Badge className="bg-primary/5 text-primary font-headline uppercase px-6 py-2 tracking-[0.3em] border-none text-xs">
                  Smart Acquisition Strategy
                </Badge>
                <h2 className="text-6xl md:text-8xl font-headline font-bold leading-[0.9] text-primary italic">
                  Maximize your <span className="text-accent italic">utility.</span>
                </h2>
                <div className="space-y-6">
                  <p className="text-2xl text-muted-foreground font-body leading-relaxed italic border-l-4 border-accent pl-8 py-2">
                    "Our AI identifies key pieces that expand your current collection's styling combinations by 40%."
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {['Color Harmony Matching', 'Geometric Alignment', 'Seasonal Transitions', 'Event-Ready Filters'].map(item => (
                      <li key={item} className="flex items-center gap-3 text-primary font-headline font-bold">
                        <CheckCircle2 className="h-6 w-6 text-accent" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-8">
                  <Button asChild className="h-20 px-12 rounded-full gradient-primary text-white font-headline text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    <Link href="/shopping">View Recommendations <ArrowRight className="ml-2 h-8 w-8" /></Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-10 bg-accent/5 rounded-[5rem] -rotate-3 scale-105 -z-10" />
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-6 mt-12">
                    <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-8 border-white group">
                      <Image src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c" alt="Pink Bag" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                      <Image src="https://images.unsplash.com/photo-1524805444758-09912d619dce" alt="Gold Watch" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                      <Image src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371" alt="Glasses" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-8 border-white group">
                      <Image src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7" alt="Blue Bag" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - NUMERIC RHYTHM */}
        <section className="py-32 section-rhythm-dark">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center space-y-6 mb-24">
              <Badge className="bg-accent/20 text-accent font-headline uppercase px-6 py-2 tracking-[0.3em] border-none text-xs">
                The Protocol
              </Badge>
              <h3 className="text-6xl md:text-8xl font-headline font-bold italic leading-none text-white">
                Algorithmic <span className="text-accent">Success.</span>
              </h3>
              <p className="text-2xl text-slate-400 font-body leading-relaxed italic max-w-3xl mx-auto text-center">
                "We've simplified the journey from a cluttered physical closet to a perfectly curated digital signature."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { step: "01", title: "Digitize", desc: "Upload photos to your vault. AI vision automatically tags brand, color, and fabric.", icon: Camera },
                { step: "02", title: "Analyze", desc: "StyleVault decodes your color harmony and identifies missing high-value pieces.", icon: Cpu },
                { step: "03", title: "Curate", desc: "Use the Visual Assembler or AI Stylist to generate occasion-perfect combinations.", icon: Layers },
                { step: "04", title: "Execute", desc: "Schedule looks in the Journal to eliminate decision fatigue every morning.", icon: Calendar }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="relative group p-8 rounded-[3.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-7xl font-headline font-bold text-accent opacity-20 group-hover:opacity-100 transition-opacity duration-500 leading-none">{item.step}</span>
                      <div className="h-16 w-16 rounded-2xl bg-accent text-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-3xl font-headline font-bold text-white">{item.title}</h4>
                      <p className="text-lg text-slate-400 font-body leading-relaxed italic">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 section-rhythm-accent">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <Card className="glass-card border-none p-20 rounded-[5rem] space-y-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-primary to-accent" />
              <h2 className="text-6xl md:text-8xl font-headline font-bold text-primary italic leading-tight">
                Ready to optimize <br/> your <span className="text-accent">visual identity?</span>
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button asChild className="h-24 px-16 rounded-full gradient-primary text-white font-headline text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  <Link href="/add-item">Start Your Vault</Link>
                </Button>
                <Button variant="outline" asChild className="h-24 px-16 rounded-full border-primary/20 text-primary font-headline text-3xl hover:bg-primary/5 active:scale-95 transition-all">
                  <Link href="/shopping">Browse Analytics</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>

      </div>

      <StyleVaultChat />
    </AppLayout>
  );
}
