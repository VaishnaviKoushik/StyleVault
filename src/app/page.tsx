'use client';

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Camera, 
  Brain, 
  Palette,
  TrendingUp,
  Star,
  Shield,
  ShoppingBag,
  ArrowRight,
  Search,
  Quote,
  Globe,
  ZapOff,
  UserCheck,
  Layers,
  Calendar,
  Cpu
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StyleVaultChat } from "@/components/StyleVaultChat";

const testimonials = [
  {
    quote: "StyleVault has completely transformed my morning routine. I save at least 20 minutes a day, and I've never felt more confident in my choices.",
    author: "Sarah J.",
    role: "Creative Director",
    avatar: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    quote: "The color analysis tool is a total game changer for my clients. It's like having a professional stylist in your pocket at all times.",
    author: "Michael R.",
    role: "Personal Stylist",
    avatar: "https://picsum.photos/seed/michael/100/100"
  },
  {
    quote: "I finally feel like I'm using 100% of my wardrobe. The AI gap analysis is brilliant—it identified exactly what my collection was missing.",
    author: "Elena T.",
    role: "Tech Executive",
    avatar: "https://picsum.photos/seed/elena/100/100"
  }
];

export default function HomeScreen() {
  return (
    <AppLayout>
      <div className="animate-in fade-in duration-1000">
        
        {/* HERO SECTION */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-headline font-bold leading-none tracking-tighter">
              <span className="text-primary italic block">Style is</span>
              <span className="text-accent italic block ml-12 md:ml-24 underline decoration-accent/20">Algorithmic.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body italic leading-relaxed max-w-lg border-l-4 border-accent pl-6">
              "Transforming your wardrobe into a dynamic, performance-driven asset through generative logic."
            </p>
          </div>

          {/* EDITORIAL IMAGE COMPOSITION */}
          <div className="relative h-[500px] w-full group">
            <div className="absolute inset-0 bg-accent/5 rounded-[3rem] -rotate-2 scale-105 -z-10" />
            <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="https://images.unsplash.com/photo-1589400445193-c881a4b0b38a" 
                alt="Signature Look" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                data-ai-hint="trench coat"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              
              <div className="absolute -bottom-6 -left-6 w-40 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-6 hidden md:block">
                 <Image 
                  src="https://images.unsplash.com/photo-1524805444758-09912d619dce" 
                  alt="Watch detail" 
                  fill 
                  className="object-cover"
                  data-ai-hint="gold watch"
                />
              </div>

              <div className="absolute top-12 -right-6 w-32 h-32 rounded-full overflow-hidden shadow-2xl border-4 border-white -rotate-12 hidden md:block">
                 <Image 
                  src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371" 
                  alt="Glasses detail" 
                  fill 
                  className="object-cover"
                  data-ai-hint="black glasses"
                />
              </div>

              <div className="absolute bottom-10 left-10 right-10 text-white space-y-2">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-headline uppercase text-[10px] tracking-widest px-3">
                  Featured Combination
                </Badge>
                <h3 className="text-3xl font-headline font-bold">The Modern Professional</h3>
                <p className="text-sm font-body italic opacity-80">"A sophisticated blend of structured outerwear and timeless accessories."</p>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="py-24 space-y-12">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h3 className="text-4xl font-headline font-bold text-primary italic">Style Intelligence <span className="text-accent">Modules.</span></h3>
            <p className="text-muted-foreground font-body italic border-t border-accent/20 pt-4 px-10">
              "Access specialized AI engines to decode trends, optimize acquisition, and orchestrate your signature visual identity."
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { label: "Catalog", icon: Camera, desc: "Add new items", href: "/add-item", color: "from-primary/10 to-primary/5" },
              { label: "Shopping", icon: ShoppingBag, desc: "AI Suggestions", href: "/shopping", color: "from-accent/10 to-accent/5" },
              { label: "AI Stylist", icon: Brain, desc: "GenAI Advice", href: "/ai-stylist", color: "from-primary/10 to-accent/5" },
              { label: "Assembler", icon: Palette, desc: "Create looks", href: "/planner", color: "from-accent/10 to-primary/5" },
              { label: "Trends", icon: Search, desc: "AI Researcher", href: "/trends", color: "from-primary/10 to-primary/5" }
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
        </section>

        {/* SIGNATURE LOOKBOOK & SMART ACQUISITION */}
        <section className="py-24">
          <div className="p-10 md:p-20 rounded-[4rem] bg-white/40 border border-white/20 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="lg:w-1/2 space-y-8">
                <Badge className="bg-primary/10 text-primary font-headline uppercase px-6 py-1 tracking-widest border-none">
                  Smart Acquisition Engine
                </Badge>
                <h2 className="text-5xl md:text-7xl font-headline font-bold leading-[0.9] text-primary italic">
                  Refine your <span className="text-accent italic">collections.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-body leading-relaxed max-w-2xl italic border-r-4 border-accent pr-6 text-right lg:text-left lg:border-r-0 lg:border-l-4 lg:pl-6">
                  "Our AI has analyzed your 18 items and identified 4 key pieces that would expand your styling combinations by 40%. View your personalized shopping strategy now."
                </p>
                
                <div className="pt-6">
                  <Button asChild className="h-16 px-10 rounded-full gradient-primary text-white font-headline text-xl shadow-xl hover:scale-105 transition-all">
                    <Link href="/shopping">View Smart Suggestions <ArrowRight className="ml-2 h-6 w-6" /></Link>
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c" alt="Accessory" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <Image src="https://images.unsplash.com/photo-1524805444758-09912d619dce" alt="Watch" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <Image src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371" alt="Glasses" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    <Image src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7" alt="Bag" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 space-y-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <Badge className="bg-accent/10 text-accent font-headline uppercase px-6 py-1 tracking-widest border-none">
              The Process
            </Badge>
            <h3 className="text-5xl md:text-6xl font-headline font-bold text-primary italic">
              How StyleVault <span className="text-accent italic">Works.</span>
            </h3>
            <p className="text-lg text-muted-foreground font-body leading-relaxed italic">
              "We've simplified the journey from a cluttered closet to a curated signature wardrobe."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Digitize",
                desc: "Upload photos to your secure vault. AI vision automatically tags brand, color, and fabric.",
                icon: Camera,
                color: "bg-primary/5 text-primary"
              },
              {
                step: "02",
                title: "Analyze",
                desc: "StyleVault decodes your color harmony and identifies missing high-value essentials.",
                icon: Cpu,
                color: "bg-accent/5 text-accent"
              },
              {
                step: "03",
                title: "Curate",
                desc: "Use the Visual Assembler or AI Stylist to generate occasion-perfect combinations.",
                icon: Layers,
                color: "bg-primary/5 text-primary"
              },
              {
                step: "04",
                title: "Execute",
                desc: "Schedule your looks in the Style Journal to eliminate decision fatigue every morning.",
                icon: Calendar,
                color: "bg-accent/5 text-accent"
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 space-y-6 group hover:-translate-y-2 transition-all duration-500">
                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", item.color)}>
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-headline font-bold text-primary">{item.title}</h4>
                    <span className="text-4xl font-headline font-bold opacity-10">{item.step}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed border-l-2 border-slate-100 pl-4">
                    {item.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="bg-accent/10 text-accent font-headline uppercase px-6 py-1 tracking-widest border-none">
              Community Voices
            </Badge>
            <h3 className="text-5xl md:text-6xl font-headline font-bold text-primary italic">
              Style with Purpose. <span className="text-accent italic block">Proven Results.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                <div className="space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/20">
                    <Quote className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-body text-slate-600 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-8 border-t border-slate-50 mt-8">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/10">
                    <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                  </div>
                  <div>
                    <h5 className="font-headline font-bold text-primary">{t.author}</h5>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <StyleVaultChat />
    </AppLayout>
  );
}
