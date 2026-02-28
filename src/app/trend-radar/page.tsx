'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Zap, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Palette, Scissors, Info } from "lucide-react";
import { analyzeTrendRadar, type TrendRadarOutput } from "@/ai/flows/trend-radar";
import { MOCK_WARDROBE } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TrendRadarPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrendRadarOutput | null>(null);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    handleAnalyze();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeTrendRadar({
        wardrobeItems: MOCK_WARDROBE.map(i => ({
          category: i.category,
          color: i.color,
          description: i.description
        }))
      });
      setData(result);
      toast({ title: "Radar Synced", description: "Global trends compared with your vault metadata." });
    } catch (err) {
      toast({ title: "Analysis failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-12 pt-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge className="bg-accent/10 text-accent font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">
              Real-time Analysis
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary italic leading-none">
              Trend <span className="text-accent">Radar.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body italic max-w-xl border-l-4 border-accent pl-6">
              "Mapping global fashion data against your inventory to quantify your stylistic relevance."
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full h-14 px-8 border-primary/20 text-primary font-headline text-lg hover:bg-primary/5 active:scale-95 transition-all"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <Zap className="mr-2 h-5 w-5 animate-pulse" /> : <Zap className="mr-2 h-5 w-5" />}
            Sync Trend Data
          </Button>
        </header>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-6">
            <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="font-headline font-bold text-primary italic">Scanning Global Runway Data...</p>
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SCORE CARD */}
            <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col">
              <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardHeader className="p-10 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline text-4xl font-bold text-primary italic">Alignment Score</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-headline font-bold text-primary leading-none">{data.alignmentScore}</span>
                    <span className="text-2xl font-headline font-bold text-primary/40 leading-none">%</span>
                  </div>
                </div>
                <Progress value={data.alignmentScore} className="h-4 bg-slate-100" />
              </CardHeader>
              <CardContent className="p-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 border-t">
                <div className="space-y-6">
                  <h4 className="font-headline font-bold text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" /> Trending Now
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: "Colors", items: data.trendingNow.colors, icon: Palette },
                      { label: "Silhouettes", items: data.trendingNow.fits, icon: Scissors },
                      { label: "Footwear", items: data.trendingNow.footwear, icon: ShoppingBag }
                    ].map(trend => (
                      <div key={trend.label} className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{trend.label}</span>
                        <div className="flex flex-wrap gap-2">
                          {trend.items.map(i => <Badge key={i} variant="secondary" className="bg-slate-50 text-primary font-headline rounded-full px-4">{i}</Badge>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-headline font-bold text-xl flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Relevance Breakdown
                  </h4>
                  <div className="space-y-6">
                    {[
                      { label: "Color Harmony", value: data.breakdown.colorMatch },
                      { label: "Fit & Silhouette", value: data.breakdown.fitMatch },
                      { label: "Fabric Intelligence", value: data.breakdown.fabricMatch }
                    ].map(metric => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold font-headline uppercase">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="text-primary">{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* INSIGHTS SIDEBAR */}
            <div className="space-y-6">
              <Card className="border-none shadow-xl bg-primary text-white rounded-[3rem] p-10">
                <div className="space-y-6">
                  <Sparkles className="h-10 w-10 text-accent" />
                  <div className="space-y-2">
                    <h4 className="font-headline font-bold text-2xl italic">Stylist Insight</h4>
                    <p className="text-lg font-body italic opacity-80 leading-relaxed">
                      "{data.stylistInsights}"
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-xl bg-white rounded-[3rem] p-10 space-y-8">
                <div className="space-y-2">
                  <h4 className="font-headline font-bold text-xl text-primary flex items-center gap-2 leading-none">
                    Trend Gap
                  </h4>
                  <p className="text-sm text-muted-foreground font-body italic">The key piece missing for perfect alignment.</p>
                </div>
                <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10 text-center space-y-4">
                  <p className="text-2xl font-headline font-bold text-primary italic leading-tight">"{data.missingTrend}"</p>
                  <Button asChild className="w-full h-14 rounded-full gradient-primary text-white font-headline" size="lg">
                    <Link href="/shopping">Shop Missing Essential <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : null}

        <footer className="py-12 border-t text-center space-y-4">
          <Info className="h-8 w-8 text-slate-200 mx-auto" />
          <p className="text-xs text-slate-400 font-body uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed">
            Data synthesized from 2025 global fashion week cycles and current e-commerce movement sentiment.
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}
