"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  Heart,
  Music,
  Dumbbell,
  Plane,
  Umbrella,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  ArrowLeftRight,
  Plus,
  ChevronRight,
  Info,
  RefreshCw,
  Trophy,
  Trees,
  Sun,
  Presentation,
  Type
} from "lucide-react";
import { aiOutfitSuggester } from "@/ai/flows/ai-outfit-suggester";
import { MOCK_WARDROBE, MOCK_OUTFITS, Outfit } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const occasions = [
  { label: "Work", icon: Briefcase, value: "work" },
  { label: "Casual", icon: Users, value: "casual" },
  { label: "Formal", icon: Sparkles, value: "formal" },
  { label: "Date Night", icon: Heart, value: "night out" },
  { label: "Party", icon: Music, value: "party" },
  { label: "Sporty", icon: Dumbbell, value: "sporty" },
  { label: "Travel", icon: Plane, value: "travel" },
  { label: "Beach", icon: Umbrella, value: "beach" },
  { label: "Gala", icon: Trophy, value: "gala" },
  { label: "Outdoor", icon: Trees, value: "outdoor" },
  { label: "Holiday", icon: Sun, value: "holiday" },
  { label: "Meeting", icon: Presentation, value: "meeting" },
];

export default function AiStylistPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'stylist';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [customOccasion, setCustomOccasion] = useState("");
  const [suggestion, setSuggestion] = useState<{
    items: any[];
    reasoning: string;
    shoppingAdvised: boolean;
  } | null>(null);
  
  // Compare State
  const [selectedStyleA, setSelectedStyleA] = useState<Outfit | null>(null);
  const [selectedStyleB, setSelectedStyleB] = useState<Outfit | null>(null);
  const [activeBattles, setActiveBattles] = useState([
    {
      id: 'b1',
      styleA: MOCK_OUTFITS[0],
      styleB: MOCK_OUTFITS[1],
      votesA: 64,
      votesB: 36,
      timeLeft: '14h 22m',
      tags: ["Classic", "More Bold"],
      engagement: 92
    }
  ]);

  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = async () => {
    const finalOccasion = customOccasion.trim() || selectedOccasion;
    
    if (!finalOccasion) {
      toast({ title: "Selection Required", description: "Please select an occasion or enter a custom one." });
      return;
    }

    setLoading(true);
    try {
      const result = await aiOutfitSuggester({
        occasion: finalOccasion,
        wardrobeItems: MOCK_WARDROBE.map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          color: i.color,
          description: i.description
        }))
      });

      const suggestedItems = result.suggestedOutfit.map(id => MOCK_WARDROBE.find(i => i.id === id)).filter(Boolean);
      
      setSuggestion({
        items: suggestedItems,
        reasoning: result.stylistNote,
        shoppingAdvised: result.shoppingAdvised
      });
      toast({ title: "Outfit ready!", description: `Styling for "${finalOccasion}" complete.` });
    } catch (err) {
      toast({ title: "Failed to generate suggestion", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (battleId: string, option: 'A' | 'B') => {
    toast({
      title: "Vote Recorded!",
      description: `You chose Style ${option}.`,
    });
  };

  const handleCreateBattle = () => {
    if (!selectedStyleA || !selectedStyleB) return;
    const newBattle = {
      id: Math.random().toString(36).substr(2, 9),
      styleA: selectedStyleA,
      styleB: selectedStyleB,
      votesA: 0,
      votesB: 0,
      timeLeft: '24h 00m',
      tags: [],
      engagement: 0
    };
    setActiveBattles([newBattle, ...activeBattles]);
    setSelectedStyleA(null);
    setSelectedStyleB(null);
    toast({ title: "Battle Initiated!" });
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-headline font-bold text-foreground">Style Lab</h2>
            <p className="text-muted-foreground font-body">Combine AI insights with community feedback.</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-300 hover:text-primary transition-colors">
                <Info className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-white border-none rounded-xl p-4 max-w-[250px]">
              <p className="text-xs font-body leading-relaxed">
                The Style Lab is where our AI designs outfits based on your actual wardrobe. Use <strong>AI Stylist</strong> for quick looks or <strong>Style Compare</strong> to get community feedback.
              </p>
            </TooltipContent>
          </Tooltip>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto bg-white shadow-sm border p-1.5 rounded-2xl mb-8 max-w-md mx-auto">
            <TabsTrigger value="stylist" className="py-3 font-headline text-lg rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              AI Stylist
            </TabsTrigger>
            <TabsTrigger value="compare" className="py-3 font-headline text-lg rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              Style Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stylist" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <Card className="border-none shadow-lg bg-white rounded-[2rem]">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">The Occasion</CardTitle>
                    <CardDescription className="font-body italic">Select or describe where you're heading.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      {occasions.map((occ) => {
                        const Icon = occ.icon;
                        return (
                          <Button
                            key={occ.value}
                            variant={selectedOccasion === occ.value && !customOccasion ? "default" : "outline"}
                            className={cn(
                              "h-24 flex flex-col gap-2 font-headline rounded-2xl border-slate-100 transition-all active:scale-95",
                              selectedOccasion === occ.value && !customOccasion ? "bg-accent border-accent text-primary" : "bg-white text-slate-400 hover:text-primary hover:bg-slate-50"
                            )}
                            onClick={() => {
                              setSelectedOccasion(occ.value);
                              setCustomOccasion("");
                            }}
                          >
                            <Icon className="h-6 w-6" />
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-center px-1">{occ.label}</span>
                          </Button>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Describe Your Own</label>
                      <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <Input 
                          placeholder="e.g. 1920s Speakeasy Night" 
                          value={customOccasion}
                          onChange={(e) => {
                            setCustomOccasion(e.target.value);
                            if (e.target.value) setSelectedOccasion("");
                          }}
                          className="h-12 rounded-xl pl-11 bg-slate-50 border-none shadow-inner font-body"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full h-16 text-xl font-headline bg-primary hover:bg-primary/90 shadow-xl rounded-full active:scale-[0.98] transition-all"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <><RefreshCw className="mr-2 h-6 w-6 animate-spin" /> Consulting Stylist...</>
                  ) : (
                    <><Sparkles className="mr-2 h-6 w-6" /> Generate My Outfit</>
                  )}
                </Button>
              </div>

              <div className="lg:col-span-2">
                {!suggestion && !loading ? (
                  <div className="h-full flex flex-col items-center justify-center bg-white/40 border-4 border-dashed rounded-[3rem] p-10 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary/30" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-headline font-bold text-slate-800">Ready for a new look?</h3>
                      <p className="text-muted-foreground font-body max-w-sm mx-auto">Select an occasion on the left or describe a custom event and let our AI browse your digital wardrobe.</p>
                    </div>
                  </div>
                ) : suggestion ? (
                  <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3.5rem]">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b p-10">
                      <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-3xl font-bold italic text-primary">Curated Assembly</CardTitle>
                        <Badge variant="outline" className="border-accent text-primary font-headline uppercase px-6 py-1 tracking-widest bg-white/50 backdrop-blur-sm">
                          {customOccasion || selectedOccasion}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                      {suggestion.shoppingAdvised && (
                        <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-inner">
                          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <ShoppingBag className="h-10 w-10 text-primary" />
                          </div>
                          <div className="flex-1 space-y-3 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                              <AlertTriangle className="h-5 w-5 text-primary" />
                              <h4 className="font-headline font-bold text-primary text-2xl italic">Wardrobe Gap Detected</h4>
                            </div>
                            <p className="text-lg font-body text-slate-600 leading-relaxed italic">
                              "Our analysis indicates a high-value piece is missing to perfectly coordinate this look. Explore optimized additions."
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                              <Button className="rounded-full h-12 px-8 gradient-primary text-white font-headline" asChild>
                                <Link href="/shopping">Consult Shopping Engine <ArrowRight className="ml-2 h-4 w-4" /></Link>
                              </Button>
                              <div className="flex gap-2 items-center text-xs font-bold text-slate-400 uppercase tracking-widest px-4 border-l">
                                Direct to: <Badge variant="outline" className="border-slate-200">Amazon</Badge> <Badge variant="outline" className="border-slate-200">Myntra</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {suggestion.items.map((item: any) => (
                          <div key={item.id} className="space-y-3 group">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white transition-transform group-hover:scale-105 active:scale-95">
                              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            </div>
                            <p className="text-xs font-headline font-bold text-center truncate px-2 text-primary opacity-60 uppercase tracking-widest">{item.name}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-secondary/20 p-8 rounded-[2rem] border border-primary/5">
                        <p className="font-body text-foreground leading-relaxed italic text-xl">
                          "{suggestion.reasoning}"
                        </p>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-14 rounded-full font-headline text-lg bg-primary shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
                          <Link href="/wardrobe?tab=journal">Schedule this Look</Link>
                        </Button>
                        <Button variant="outline" className="flex-1 h-14 rounded-full font-headline text-lg border-accent text-primary hover:bg-accent hover:text-white transition-all shadow-md active:scale-95" onClick={() => setActiveTab('compare')}>
                          <ArrowLeftRight className="mr-2 h-5 w-5" /> Global Comparison
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-10 bg-white rounded-[3rem] shadow-inner space-y-6">
                    <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-headline font-bold text-primary italic">Styling your collection...</h3>
                      <p className="text-muted-foreground font-body italic">Aggregating visual harmony data</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-3xl font-headline font-bold text-primary italic">Active Comparisons</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-400 font-headline uppercase tracking-widest text-[10px]">Community Feed</Badge>
                </div>
                {activeBattles.map(battle => (
                  <Card key={battle.id} className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-8 border-b flex flex-row justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary opacity-40" />
                        <span className="font-headline font-bold text-primary">Global Comparison</span>
                      </div>
                      <Badge className="bg-accent text-primary font-headline uppercase px-4 py-1 tracking-widest">Ends in {battle.timeLeft}</Badge>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                      <div className="grid grid-cols-2 gap-12 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-accent text-primary flex items-center justify-center font-headline font-bold z-10 border-4 border-white shadow-2xl italic text-xl">VS</div>
                        
                        <div className="space-y-6">
                          <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer" onClick={() => handleVote(battle.id, 'A')}>
                            <Image src={MOCK_WARDROBE.find(i => i.id === battle.styleA.items[0])?.imageUrl || ''} alt="" fill className="object-cover" />
                            <div className="absolute bottom-6 left-6 right-6 flex justify-center text-white">
                              <span className="text-3xl font-headline font-bold italic drop-shadow-lg">{battle.votesA}%</span>
                            </div>
                          </div>
                          <Button className="w-full h-14 rounded-full font-headline text-lg shadow-lg active:scale-95 transition-all" onClick={() => handleVote(battle.id, 'A')}>Option A</Button>
                        </div>

                        <div className="space-y-6">
                          <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer" onClick={() => handleVote(battle.id, 'B')}>
                            <Image src={MOCK_WARDROBE.find(i => i.id === battle.styleB.items[0])?.imageUrl || ''} alt="" fill className="object-cover" />
                            <div className="absolute bottom-6 left-6 right-6 flex justify-center text-white">
                              <span className="text-3xl font-headline font-bold italic drop-shadow-lg">{battle.votesB}%</span>
                            </div>
                          </div>
                          <Button className="w-full h-14 rounded-full font-headline text-lg shadow-lg active:scale-95 transition-all" onClick={() => handleVote(battle.id, 'B')}>Option B</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-8">
                <Card className="border-none shadow-xl bg-white p-10 space-y-8 rounded-[3rem]">
                  <div className="space-y-2">
                    <h3 className="font-headline font-bold text-2xl text-primary italic leading-none">New Battle</h3>
                    <p className="text-sm text-muted-foreground font-body italic">Get feedback on two different assembly ideas.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn("aspect-[3/4] rounded-[2rem] border-4 border-dashed transition-all flex items-center justify-center cursor-pointer bg-slate-50 active:scale-95", selectedStyleA ? "border-accent bg-accent/5 ring-4 ring-accent/10" : "border-slate-100 hover:border-primary/20")} onClick={() => setSelectedStyleA(null)}>
                          {selectedStyleA ? <span className="text-xs font-bold text-primary text-center px-4 font-headline uppercase leading-relaxed">{selectedStyleA.name}</span> : <Plus className="h-8 w-8 text-slate-200" />}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Click an outfit from your list below to assign it to slot A.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <div className={cn("aspect-[3/4] rounded-[2rem] border-4 border-dashed transition-all flex items-center justify-center cursor-pointer bg-slate-50 active:scale-95", selectedStyleB ? "border-accent bg-accent/5 ring-4 ring-accent/10" : "border-slate-100 hover:border-primary/20")} onClick={() => setSelectedStyleB(null)}>
                      {selectedStyleB ? <span className="text-xs font-bold text-primary text-center px-4 font-headline uppercase leading-relaxed">{selectedStyleB.name}</span> : <Plus className="h-8 w-8 text-slate-200" />}
                    </div>
                  </div>
                  <Button className="w-full h-16 rounded-full font-headline text-xl gradient-primary text-white shadow-xl shadow-primary/20 active:scale-[0.98] transition-all" disabled={!selectedStyleA || !selectedStyleB} onClick={handleCreateBattle}>Initiate Style Battle</Button>
                </Card>

                <div className="space-y-6">
                  <h4 className="font-headline font-bold text-xs text-slate-400 uppercase tracking-[0.3em] px-4">Your Signature Outfits</h4>
                  <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                    {MOCK_OUTFITS.map(outfit => (
                      <button 
                        key={outfit.id} 
                        className="p-4 bg-white rounded-[2rem] border-2 border-slate-50 shadow-sm flex items-center gap-4 cursor-pointer hover:border-accent hover:shadow-md active:scale-[0.98] transition-all text-left group"
                        onClick={() => {
                          if (!selectedStyleA) setSelectedStyleA(outfit);
                          else if (!selectedStyleB) setSelectedStyleB(outfit);
                        }}
                      >
                        <div className="h-14 w-14 rounded-2xl overflow-hidden relative shadow-md">
                          <Image src={MOCK_WARDROBE.find(i => i.id === outfit.items[0])?.imageUrl || ''} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-bold font-headline block truncate text-primary group-hover:text-accent transition-colors">{outfit.name}</span>
                          <span className="text-[10px] font-body uppercase tracking-widest text-slate-300">{outfit.occasion}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-accent transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
