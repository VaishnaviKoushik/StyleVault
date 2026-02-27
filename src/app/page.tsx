'use client';

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Camera, 
  Brain, 
  Palette,
  Clock,
  TrendingUp,
  Sun,
  Zap,
  ChevronRight,
  Layers,
  Star,
  Shield,
  Smartphone,
  ShoppingBag,
  Heart,
  ArrowRight,
  Search,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wind,
  Globe,
  ZapOff,
  UserCheck,
  Activity,
  Cpu,
  MousePointer2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StyleVaultChat } from "@/components/StyleVaultChat";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { MOCK_WARDROBE, MOCK_OUTFITS } from "@/lib/mock-data";
import { seasonalTransitionAlert, type SeasonalTransitionOutput } from "@/ai/flows/seasonal-transition-alert";
import { useToast } from "@/hooks/use-toast";

const chartData = [
  { month: "Jan", index: 65 },
  { month: "Feb", index: 72 },
  { month: "Mar", index: 68 },
  { month: "Apr", index: 85 },
  { month: "May", index: 88 },
  { month: "Jun", index: 94 },
];

const chartConfig = {
  index: {
    label: "Style Index",
    color: "hsl(var(--primary))",
  },
};

export default function HomeScreen() {
  const [transitionAlert, setTransitionAlert] = useState<SeasonalTransitionOutput | null>(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setAlertLoading(true);
      const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());

      try {
        const transitionResult = await seasonalTransitionAlert({ currentMonth });
        setTransitionAlert(transitionResult);
      } catch (error) {
        console.error("Failed to fetch dashboard intelligence:", error);
      } finally {
        setAlertLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-12 animate-in fade-in duration-1000 pt-8">
        
        {/* SEASONAL TRANSITION ALERT */}
        {transitionAlert && (
          <section className="animate-in slide-in-from-top-8 duration-1000">
            <Card className="border-none shadow-2xl bg-gradient-to-r from-primary/95 to-primary text-white overflow-hidden rounded-[2.5rem] relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Wind className="h-40 w-40" />
              </div>
              <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <Badge className="bg-white/20 text-white border-none font-headline uppercase tracking-widest">
                      Seasonal Transition Detected
                    </Badge>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-headline font-bold leading-tight italic">
                    {transitionAlert.title}
                  </h3>
                  <p className="text-lg font-body italic opacity-80 border-l-2 border-accent/40 pl-6 leading-relaxed">
                    "{transitionAlert.description}"
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpFromLine className="h-4 w-4 text-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Rotate In</span>
                    </div>
                    <ul className="space-y-1">
                      {transitionAlert.rotateIn.map((item, i) => (
                        <li key={i} className="font-headline font-bold text-sm flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-accent" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownToLine className="h-4 w-4 text-white/60" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Rotate Out</span>
                    </div>
                    <ul className="space-y-1">
                      {transitionAlert.rotateOut.map((item, i) => (
                        <li key={i} className="font-headline font-bold text-sm flex items-center gap-2 opacity-70">
                          <div className="h-1 w-1 rounded-full bg-white/40" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="sm:col-span-2 p-5 rounded-3xl bg-accent text-primary space-y-2 shadow-xl border border-white/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                      <Sparkles className="h-3 w-3" /> Professional Storage Advice
                    </p>
                    <p className="font-body text-sm font-bold italic leading-relaxed">
                      {transitionAlert.preparationTip}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-accent/10 text-accent font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">
              Intelligence Dashboard
            </Badge>
            <h1 className="text-6xl md:text-8xl font-headline font-bold leading-none tracking-tighter">
              <span className="text-primary italic block">Style is</span>
              <span className="text-accent italic block ml-12 md:ml-24 underline decoration-accent/20">Algorithmic.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body italic leading-relaxed max-w-lg border-l-4 border-accent pl-6">
              "Transforming your wardrobe into a dynamic, performance-driven asset through generative logic."
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild className="h-14 px-8 rounded-full gradient-primary text-white font-headline text-lg shadow-xl hover:scale-105 transition-all">
                <Link href="/ai-stylist">Explore AI Insights <Sparkles className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>

          <Card className="glass-card border-none shadow-2xl p-8 overflow-hidden bg-white/40 backdrop-blur-md">
            <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-headline font-bold text-primary">Style Impact Index</CardTitle>
                <p className="text-xs text-muted-foreground font-body">Real-time wardrobe utilization metrics</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-headline font-bold text-accent">+24%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">MoM Growth</p>
              </div>
            </CardHeader>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="index" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  className="fill-primary"
                />
              </BarChart>
            </ChartContainer>
          </Card>
        </section>

        {/* 2. COGNITIVE STYLE METRICS (Replacement for Smart Greeting) */}
        <section className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Cpu className="h-32 w-32" />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-white shadow-2xl transform rotate-3">
                <Activity className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-headline font-bold text-primary">Cognitive Curation</h3>
                <p className="text-sm font-body italic text-muted-foreground">Advanced algorithmic optimization of your fashion ecosystem.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Decision Speed</p>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-2xl font-headline font-bold text-primary">-15m / day</span>
                </div>
              </div>
              <div className="w-px h-12 bg-slate-100 hidden md:block" />
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Inventory Health</p>
                <div className="flex items-center justify-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-headline font-bold text-primary">98.4%</span>
                </div>
              </div>
              <div className="w-px h-12 bg-slate-100 hidden md:block" />
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Style Entropy</p>
                <div className="flex items-center justify-center gap-2">
                  <MousePointer2 className="h-4 w-4 text-accent" />
                  <span className="text-2xl font-headline font-bold text-primary">Minimal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[
            { label: "Catalog", icon: Camera, desc: "Add new items", href: "/add-item", color: "from-primary/10 to-primary/5" },
            { label: "Shopping", icon: ShoppingBag, desc: "AI Suggestions", href: "/shopping", color: "from-accent/10 to-accent/5" },
            { label: "AI Stylist", icon: Brain, desc: "GenAI Advice", href: "/ai-stylist", color: "from-primary/10 to-accent/5" },
            { label: "Assembler", icon: Palette, desc: "Create looks", href: "/outfits", color: "from-accent/10 to-primary/5" },
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

        {/* 4. INTEL SUMMARY CARD instead of full suggestions */}
        <section className="animate-in slide-in-from-bottom-8 duration-1000">
           <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/3 relative aspect-square rounded-[2rem] overflow-hidden shadow-xl border-8 border-slate-50">
                 <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" alt="Shopping" fill className="object-cover" />
                 <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <ShoppingBag className="h-20 w-20 text-white opacity-40" />
                 </div>
              </div>
              <div className="md:w-2/3 space-y-6">
                 <Badge className="bg-primary/10 text-primary font-headline uppercase">Smart Acquisition Engine</Badge>
                 <h3 className="text-4xl font-headline font-bold text-primary italic">Refine your collection.</h3>
                 <p className="text-lg font-body text-slate-600 leading-relaxed italic">
                    "Our AI has analyzed your 18 items and identified 4 key pieces that would expand your styling combinations by 40%. View your personalized shopping strategy now."
                 </p>
                 <Button asChild className="h-14 px-8 rounded-full gradient-primary text-white font-headline text-lg shadow-xl hover:scale-105 transition-all">
                    <Link href="/shopping">View Smart Suggestions <ArrowRight className="ml-2 h-5 w-5" /></Link>
                 </Button>
              </div>
           </Card>
        </section>

        {/* 5. SIGNATURE LOOKBOOK */}
        <section className="py-20 px-10 rounded-[4rem] bg-white/40 border border-white/20 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2 space-y-8">
              <Badge className="bg-primary/10 text-primary font-headline uppercase px-6 py-1 tracking-widest border-none">
                Elite Signature
              </Badge>
              <h3 className="text-5xl md:text-7xl font-headline font-bold leading-[0.9] text-primary italic">
                Curation <span className="text-accent italic">Perfected.</span>
              </h3>
              <p className="text-xl text-muted-foreground font-body leading-relaxed max-w-2xl italic border-r-4 border-accent pr-6 text-right lg:text-left lg:border-r-0 lg:border-l-4 lg:pl-6">
                "We've redefined the professional wardrobe. StyleVault is a cognitive style engine merging vision with creative intelligence."
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <div className="space-y-3 group cursor-default">
                  <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
                    <Star className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline font-bold text-2xl text-primary">Mastery</h4>
                  <p className="text-sm text-muted-foreground font-body">Gemini-powered analysis of color theory and historical styling preference.</p>
                </div>
                <div className="space-y-3 group cursor-default">
                  <div className="h-12 w-12 rounded-xl bg-accent text-white flex items-center justify-center shadow-lg transition-transform group-hover:-rotate-6">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline font-bold text-2xl text-primary">Security</h4>
                  <p className="text-sm text-muted-foreground font-body">Your digital inventory is protected with professional-grade cloud security.</p>
                </div>
              </div>

              <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white font-headline h-14 px-8 mt-8 transition-all">
                 <Link href="/proposal">View Architecture <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
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
        </section>

        {/* 6. REAL-WORLD IMPACT SECTION */}
        <section className="py-24 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="bg-accent/10 text-accent font-headline uppercase px-6 py-1 tracking-widest border-none">
              Real-World Impact
            </Badge>
            <h3 className="text-5xl md:text-6xl font-headline font-bold text-primary italic">
              Style with Purpose. <span className="text-accent italic block">Impact with Every Choice.</span>
            </h3>
            <p className="text-lg text-muted-foreground font-body leading-relaxed italic">
              "We believe that a well-curated wardrobe is the foundation for both personal peak performance and global environmental responsibility."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Sustainable Curation",
                desc: "StyleVault reduces the environmental footprint of fashion by maximizing the utility of items you already own, actively discouraging the 'fast fashion' cycle through intelligent rotation and gap analysis.",
                icon: Globe,
                accent: "text-primary"
              },
              {
                title: "Cognitive Clarity",
                desc: "By offloading the daily 'what to wear' choice to our AI engine, users save an average of 15-20 minutes every morning, eliminating decision fatigue and freeing up mental space for high-impact creative work.",
                icon: ZapOff,
                accent: "text-accent"
              },
              {
                title: "Professional Evolution",
                desc: "Our color theory and fabric intelligence tools ensure your visual identity is consistently aligned with your professional goals, leveraging the psychology of style to build presence and authority.",
                icon: UserCheck,
                accent: "text-primary"
              }
            ].map((impact, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className={cn("h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", impact.accent)}>
                  <impact.icon className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-headline font-bold text-primary">{impact.title}</h4>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed border-l-2 border-slate-100 pl-4">
                    {impact.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="md:w-1/3 relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" alt="Sustainable" fill className="object-cover" />
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                <Globe className="h-20 w-20 text-white opacity-40" />
              </div>
            </div>
            <div className="md:w-2/3 space-y-6">
              <h4 className="text-3xl font-headline font-bold text-primary italic">The "StyleVault" Standard</h4>
              <p className="text-lg font-body text-slate-600 leading-relaxed italic">
                "Our technology isn't just about clothes; it's about the conscious curation of a life lived with intentionality. From the textiles we wear to the time we save, every algorithm is built to empower the modern professional while respecting the planet."
              </p>
              <div className="flex gap-4 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-headline font-bold text-primary">82%</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Waste Reduction</p>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="text-center">
                  <p className="text-3xl font-headline font-bold text-accent">120h</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Time Saved / Year</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Floating AI Chat Trigger */}
      <StyleVaultChat />
    </AppLayout>
  );
}
