'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Sparkles, TrendingUp, Zap, ArrowRight, Layers, Palette, Info, AlertTriangle, ArrowUpFromLine, ArrowDownToLine } from "lucide-react";
import { trendResearcher, type TrendResearcherOutput } from "@/ai/flows/trend-researcher";
import { seasonalTransitionAlert, type SeasonalTransitionOutput } from "@/ai/flows/seasonal-transition-alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";

const suggestedTopics = [
  "Quiet Luxury",
  "Cyber-Streetwear",
  "Coastal Grandma",
  "Y2K Revival",
  "Sustainable Minimalism"
];

export default function TrendResearcherPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TrendResearcherOutput | null>(null);
  const [transitionAlert, setTransitionAlert] = useState<SeasonalTransitionOutput | null>(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAlert() {
      setAlertLoading(true);
      const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
      try {
        const result = await seasonalTransitionAlert({ currentMonth });
        setTransitionAlert(result);
      } catch (error) {
        console.error("Failed to fetch transition alert:", error);
      } finally {
        setAlertLoading(false);
      }
    }
    fetchAlert();
  }, []);

  const handleResearch = async (searchTopic?: string) => {
    const finalTopic = searchTopic || topic;
    if (!finalTopic) {
      toast({ title: "Please enter a topic", variant: "destructive" });
      return;
    }

    setLoading(true);
    setReport(null);
    try {
      const result = await trendResearcher({ topic: finalTopic });
      setReport(result);
    } catch (error) {
      toast({ title: "Research failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-12 pt-8 animate-in fade-in duration-700">
        <header className="space-y-4">
          <Badge className="bg-primary/10 text-primary font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">
            Global Intelligence
          </Badge>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-5xl font-headline font-bold text-foreground leading-none tracking-tighter">
                Trend <span className="text-accent italic">Researcher.</span>
              </h2>
              <p className="text-muted-foreground font-body text-lg italic max-w-md">
                "Decode the future of fashion using real-time generative intelligence."
              </p>
            </div>
          </div>
        </header>

        {/* Seasonal Transition Alert - Moved here from Home but styled similarly */}
        {transitionAlert && (
          <section className="animate-in slide-in-from-right duration-700">
             <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem] p-8 flex flex-col md:flex-row items-center gap-8 border border-accent/10">
                <div className="md:w-1/4 relative aspect-square rounded-[2rem] overflow-hidden shadow-xl">
                   <Image src="https://images.unsplash.com/photo-1589400445193-c881a4b0b38a" alt="Seasonal Transition" fill className="object-cover" />
                   <div className="absolute inset-0 bg-primary/40 flex flex-col items-center justify-center p-4 text-center">
                      <AlertTriangle className="h-12 w-12 text-white opacity-40 mb-2" />
                      <Badge className="bg-accent text-primary border-none font-headline uppercase text-[8px] tracking-widest px-3">
                        Active Shift
                      </Badge>
                   </div>
                </div>
                <div className="md:w-3/4 space-y-4">
                   <div className="space-y-1">
                     <Badge className="bg-primary/5 text-primary font-headline uppercase text-[10px] tracking-widest">Seasonal Transition</Badge>
                     <h3 className="text-2xl font-headline font-bold text-primary italic">
                       {transitionAlert.title}
                     </h3>
                   </div>
                   <p className="text-sm font-body text-slate-600 italic">
                      "{transitionAlert.description}"
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                          <ArrowUpFromLine className="h-2 w-2" /> Bring In
                        </span>
                        <p className="text-[11px] font-headline font-bold text-primary">
                          {transitionAlert.rotateIn.slice(0, 3).join(', ')}
                        </p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <ArrowDownToLine className="h-2 w-2" /> Store Away
                        </span>
                        <p className="text-[11px] font-headline font-bold text-slate-400">
                          {transitionAlert.rotateOut.slice(0, 3).join(', ')}
                        </p>
                     </div>
                   </div>
                   
                   <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                      <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-[11px] font-body text-slate-500 leading-relaxed italic">
                        {transitionAlert.preparationTip}
                      </p>
                   </div>
                </div>
             </Card>
          </section>
        )}

        {/* Search Section */}
        <section className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex gap-3 p-2 bg-white rounded-[2rem] border shadow-xl">
              <Input 
                placeholder="What trend are we decoding today?" 
                className="flex-1 h-14 border-none bg-transparent font-headline text-xl px-6 focus-visible:ring-0"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              />
              <Button 
                className="h-14 px-8 rounded-full gradient-primary text-white font-headline text-lg shadow-lg"
                onClick={() => handleResearch()}
                disabled={loading}
              >
                {loading ? "Analyzing..." : <><Search className="mr-2 h-5 w-5" /> Research</>}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hot Topics:</span>
            {suggestedTopics.map(t => (
              <button 
                key={t}
                onClick={() => { setTopic(t); handleResearch(t); }}
                className="text-sm font-headline font-bold text-primary/60 hover:text-primary transition-colors hover:underline decoration-accent/30 decoration-2 underline-offset-4"
              >
                #{t}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-headline font-bold text-primary">Scanning Fashion Week...</h3>
              <p className="text-muted-foreground font-body italic">Aggregating visual data and sentiment analysis</p>
            </div>
          </div>
        )}

        {report && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            {/* Main Analysis */}
            <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-primary to-accent" />
              <CardContent className="p-10 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-primary/20 text-primary font-headline px-4 py-1 uppercase tracking-widest">Trend Report</Badge>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <span className="font-headline font-bold text-accent">Hot</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-headline font-bold text-primary">{report.title}</h3>
                  <p className="text-xl font-body leading-relaxed text-muted-foreground italic border-l-4 border-accent pl-6">
                    "{report.summary}"
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="font-headline font-bold text-2xl flex items-center gap-3">
                    <Layers className="h-6 w-6 text-primary" /> Key Essentials
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.keyPieces.map((piece, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 group hover:bg-primary hover:text-white transition-all cursor-default">
                        <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary font-headline font-bold group-hover:text-primary">
                          {i + 1}
                        </div>
                        <span className="font-headline font-bold">{piece}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-headline font-bold text-2xl flex items-center gap-3">
                    <Zap className="h-6 w-6 text-accent" /> Styling Strategy
                  </h4>
                  <p className="text-lg font-body leading-relaxed text-slate-700 bg-accent/5 p-8 rounded-3xl border border-accent/10 italic">
                    {report.stylingStrategy}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Metrics */}
            <div className="space-y-6">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-primary text-white overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="font-headline text-xl">Forecast Score</CardTitle>
                  <CardDescription className="text-white/60 font-body">Projected dominance for 2025</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-headline font-bold">{report.forecastScore}</span>
                    <span className="text-xl font-headline font-bold opacity-60 mb-2">/100</span>
                  </div>
                  <Progress value={report.forecastScore} className="h-3 bg-white/20" />
                  <p className="text-xs font-body italic opacity-80">
                    High forecast scores indicate low-risk, high-impact wardrobe investment.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 space-y-6">
                <h4 className="font-headline font-bold text-xl flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" /> Palette Harmony
                </h4>
                <div className="space-y-4">
                  {report.colorPalette.map(color => (
                    <div key={color.name} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl shadow-inner border border-black/5" style={{ backgroundColor: color.hex }} />
                      <div className="flex-1">
                        <p className="font-headline font-bold text-primary">{color.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Button asChild className="w-full h-16 rounded-full gradient-primary text-white font-headline text-xl shadow-xl hover:scale-[1.02] transition-all">
                <a href={`/wardrobe?q=${report.title}`}>Check my Closet <ArrowRight className="ml-2 h-6 w-6" /></a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
