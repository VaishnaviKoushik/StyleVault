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
  Info,
  ChevronRight,
  Layers,
  Star,
  Shield,
  Smartphone,
  ShoppingBag,
  Heart,
  ArrowRight
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
import { smartShoppingSuggestions, type ShoppingSuggestionsOutput } from "@/ai/flows/smart-shopping-suggestions";
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
  const [shoppingLoading, setShoppingLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ShoppingSuggestionsOutput['suggestions'] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSuggestions() {
      setShoppingLoading(true);
      try {
        const result = await smartShoppingSuggestions({
          wardrobeItems: MOCK_WARDROBE.map(i => ({ name: i.name, category: i.category, color: i.color })),
          outfits: MOCK_OUTFITS.map(o => ({ 
            name: o.name, 
            itemNames: o.items.map(id => MOCK_WARDROBE.find(i => i.id === id)?.name || '') 
          })),
          stylePreference: "minimalist, professional"
        });
        setSuggestions(result.suggestions);
      } catch (error) {
        console.error("Failed to fetch shopping suggestions:", error);
      } finally {
        setShoppingLoading(false);
      }
    }
    fetchSuggestions();
  }, []);

  const handleAddToWishlist = (itemName: string) => {
    toast({
      title: "Added to Wishlist",
      description: `${itemName} has been saved to your shopping list.`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-12 animate-in fade-in duration-1000 pt-8">
        {/* 1. ELITE INTELLIGENCE HERO (TOP SECTION) */}
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

        {/* 2. SMART GREETING & STATUS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 p-8 rounded-[2rem] border border-white/20 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full p-1 bg-gradient-to-br from-primary to-accent shadow-xl">
              <Image 
                src="https://picsum.photos/seed/alex/400" 
                alt="Profile" 
                width={80} 
                height={80} 
                className="rounded-full object-cover border-4 border-white"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-headline font-bold text-foreground tracking-tight">Alex Chen</h2>
              <p className="text-muted-foreground font-body italic">Premium Fashion Curator — <span className="text-primary font-bold">StyleVault Member</span></p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 glass-card px-6 py-3 rounded-full shadow-sm bg-white/60">
              <Sun className="h-5 w-5 text-accent" />
              <span className="font-headline font-bold">72°F London</span>
            </div>
            <div className="flex items-center gap-3 glass-card px-6 py-3 rounded-full shadow-sm bg-white/60">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-headline font-bold text-primary">Score: 92</span>
            </div>
          </div>
        </div>

        {/* 3. HERO SECTION – TODAY’S AI OUTFIT */}
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
                <Badge className="bg-white/90 text-primary font-headline shadow-lg px-4 py-1">98% Match</Badge>
              </div>
            </div>
            <CardContent className="md:w-1/2 p-10 flex flex-col justify-center space-y-8 relative z-10 bg-white/40 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase px-3">Casual</Badge>
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase px-3">Mon-Fri</Badge>
                </div>
                <h3 className="text-4xl font-headline font-bold tracking-tight text-primary">The "Morning Meetings" Look</h3>
                <p className="text-muted-foreground font-body text-lg leading-relaxed italic">
                  "A crisp white linen shirt paired with relaxed denim ensures a polished yet effortless vibe for your current schedule."
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild className="flex-1 h-14 rounded-full gradient-primary font-headline text-lg text-white shadow-xl hover:scale-[1.02] transition-all">
                  <Link href="/planner">Schedule Outfit <Clock className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" className="h-14 w-14 rounded-full border-primary/20 text-primary hover:bg-primary/5 transition-all">
                  <Zap className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* 4. QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Catalog", icon: Camera, desc: "Add new items", href: "/add-item", color: "from-primary/10 to-primary/5" },
            { label: "Try-On", icon: Smartphone, desc: "AR Experience", href: "/try-on", color: "from-accent/10 to-accent/5" },
            { label: "AI Stylist", icon: Brain, desc: "GenAI Advice", href: "/ai-stylist", color: "from-primary/10 to-accent/5" },
            { label: "Assembler", icon: Palette, desc: "Create looks", href: "/outfits", color: "from-accent/10 to-primary/5" }
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

        {/* NEW FEATURE: SMART SHOPPING SUGGESTIONS (AI POWERED) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h3 className="text-3xl font-headline font-bold text-foreground">Smart Shopping Suggestions <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">AI POWERED</Badge></h3>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground font-body italic">Maximizing your wardrobe's ROI through data-driven additions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shoppingLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="glass-card border-none p-6 space-y-4 animate-pulse">
                  <div className="h-40 bg-slate-200 rounded-2xl w-full" />
                  <div className="h-6 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-200 rounded-full w-full" />
                </Card>
              ))
            ) : suggestions ? (
              suggestions.map((suggestion, idx) => (
                <Card key={idx} className="glass-card border-none overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white/60">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <Image 
                      src={suggestion.imageUrl} 
                      alt={suggestion.itemName} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-primary font-headline shadow-sm">
                        +{suggestion.matchCount} Matches
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xl font-headline font-bold text-primary truncate">{suggestion.itemName}</h4>
                      <p className="text-xs text-muted-foreground font-body uppercase tracking-widest">{suggestion.category}</p>
                    </div>
                    <p className="text-sm font-body text-slate-600 line-clamp-3 italic leading-relaxed">
                      "{suggestion.reason}"
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1 h-10 rounded-full gradient-primary text-white font-headline text-xs" variant="default">
                        <a href={suggestion.shopUrl} target="_blank" rel="noopener noreferrer">
                          Shop Now <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-10 w-10 rounded-full border-primary/20 text-primary hover:bg-primary/5"
                        onClick={() => handleAddToWishlist(suggestion.itemName)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-primary/10">
                <p className="font-headline font-bold text-slate-400">Unable to generate suggestions at this time.</p>
              </div>
            )}
          </div>
        </section>

        {/* 5. SIGNATURE LOOKBOOK & PORTFOLIO */}
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
      </div>

      {/* Floating AI Chat Trigger */}
      <StyleVaultChat />
    </AppLayout>
  );
}
