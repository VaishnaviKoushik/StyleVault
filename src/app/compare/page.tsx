'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Sparkles, Share2, Users, Trophy, TrendingUp, Palette, BarChart3, Plus, ChevronRight, Check } from "lucide-react";
import { MOCK_OUTFITS, MOCK_WARDROBE, Outfit } from "@/lib/mock-data";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const styleFeedbackTags = ["More Minimal", "More Bold", "Better Layering", "Classic", "Trendy", "Elegant"];

export default function ComparePage() {
  const [view, setView] = useState<"active" | "create">("active");
  const [selectedStyleA, setSelectedStyleA] = useState<Outfit | null>(null);
  const [selectedStyleB, setSelectedStyleB] = useState<Outfit | null>(null);
  const [votingWindow, setVotingWindow] = useState(24);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  // Mock Active Battles
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVote = (battleId: string, option: 'A' | 'B') => {
    toast({
      title: "Vote Recorded!",
      description: `You chose Style ${option}. Thanks for the feedback!`,
    });
  };

  const handleCreateBattle = () => {
    if (!selectedStyleA || !selectedStyleB) {
      toast({ title: "Please select two styles", variant: "destructive" });
      return;
    }
    const newBattle = {
      id: Math.random().toString(36).substr(2, 9),
      styleA: selectedStyleA,
      styleB: selectedStyleB,
      votesA: 0,
      votesB: 0,
      timeLeft: `${votingWindow}h 00m`,
      tags: [],
      engagement: 0
    };
    setActiveBattles([newBattle, ...activeBattles]);
    setView("active");
    setSelectedStyleA(null);
    setSelectedStyleB(null);
    toast({ title: "Battle Initiated!", description: "Your style brawl is now live." });
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pt-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge className="bg-accent/10 text-accent font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">
              Style Brawl Arena
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary italic leading-none">
              Friend <span className="text-accent">Compare.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body italic max-w-xl border-l-4 border-accent pl-6">
              "Pit your signature looks against each other and let the StyleVault community decide."
            </p>
          </div>
          <Button 
            onClick={() => setView(view === "active" ? "create" : "active")}
            className="rounded-full h-14 px-8 gradient-primary text-white font-headline text-lg shadow-xl hover:scale-105 transition-all"
          >
            {view === "active" ? <><Plus className="mr-2 h-5 w-5" /> New Style Battle</> : "View Active Battles"}
          </Button>
        </header>

        {view === "active" ? (
          <div className="space-y-12">
            {activeBattles.map((battle) => (
              <Card key={battle.id} className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-8 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary opacity-40" />
                      <span className="font-headline font-bold text-primary">Global Comparison</span>
                    </div>
                    <Badge variant="outline" className="rounded-full border-accent text-accent px-4 py-1">
                      Ends in {battle.timeLeft}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 md:p-12 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-accent text-primary flex items-center justify-center font-headline font-bold text-2xl z-20 shadow-2xl border-4 border-white">
                      VS
                    </div>

                    {/* Style A */}
                    <div className="space-y-6">
                      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-[1.02]">
                        <div className="grid grid-cols-2 h-full">
                          {battle.styleA.items.slice(0, 2).map((id, i) => (
                            <div key={i} className="relative h-full">
                              <Image 
                                src={MOCK_WARDROBE.find(item => item.id === id)?.imageUrl || ''} 
                                alt="Item" 
                                fill 
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                           <div>
                              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Style A</p>
                              <h4 className="text-white text-2xl font-headline font-bold">{battle.styleA.name}</h4>
                           </div>
                           <p className="text-accent text-4xl font-headline font-bold">{battle.votesA}%</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full h-14 rounded-full bg-primary text-white font-headline text-lg hover:bg-primary/90 shadow-lg"
                        onClick={() => handleVote(battle.id, 'A')}
                      >
                        Vote for Style A
                      </Button>
                    </div>

                    {/* Style B */}
                    <div className="space-y-6">
                      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-[1.02]">
                        <div className="grid grid-cols-2 h-full">
                          {battle.styleB.items.slice(0, 2).map((id, i) => (
                            <div key={i} className="relative h-full">
                              <Image 
                                src={MOCK_WARDROBE.find(item => item.id === id)?.imageUrl || ''} 
                                alt="Item" 
                                fill 
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                           <div>
                              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Style B</p>
                              <h4 className="text-white text-2xl font-headline font-bold">{battle.styleB.name}</h4>
                           </div>
                           <p className="text-accent text-4xl font-headline font-bold">{battle.votesB}%</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full h-14 rounded-full bg-primary text-white font-headline text-lg hover:bg-primary/90 shadow-lg"
                        onClick={() => handleVote(battle.id, 'B')}
                      >
                        Vote for Style B
                      </Button>
                    </div>
                  </div>

                  {/* Analytics Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold font-headline uppercase tracking-widest">Engagement Score</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-3xl font-headline font-bold text-primary">{battle.engagement}</span>
                          <span className="text-xs text-muted-foreground font-body">Elite Reach</span>
                        </div>
                        <Progress value={battle.engagement} className="h-2" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold font-headline uppercase tracking-widest">Style Lean</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                         <span className="text-xs font-headline font-bold opacity-40">CLASSIC</span>
                         <div className="flex-1 mx-4 h-1 bg-slate-100 rounded-full relative">
                            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 h-3 w-3 rounded-full bg-accent shadow-md" />
                         </div>
                         <span className="text-xs font-headline font-bold opacity-40">TRENDY</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold font-headline uppercase tracking-widest">Feedback Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {battle.tags.map(tag => (
                           <Badge key={tag} className="bg-primary/5 text-primary border-primary/10 rounded-full font-headline">{tag}</Badge>
                         ))}
                         <Badge variant="outline" className="rounded-full border-dashed border-primary/20 text-primary/40">+ Add Feedback</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-right duration-500">
            {/* Creation Workspace */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-10 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-headline font-bold text-primary">Select Styles to Battle</h3>
                  <p className="text-muted-foreground font-body italic">Pick two signature looks to find out which one reigns supreme.</p>
                </div>

                <div className="grid grid-cols-2 gap-12 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 font-headline font-bold z-10">
                      VS
                   </div>
                   
                   {/* Slot A */}
                   <div 
                     className={cn(
                       "aspect-[3/4] rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden",
                       selectedStyleA ? "border-primary bg-white shadow-2xl" : "border-slate-100 bg-slate-50/50 hover:bg-slate-100"
                     )}
                     onClick={() => { if(selectedStyleA) setSelectedStyleA(null) }}
                   >
                     {selectedStyleA ? (
                        <>
                          <Image 
                            src={MOCK_WARDROBE.find(i => i.id === selectedStyleA.items[0])?.imageUrl || ''} 
                            alt="Style A" 
                            fill 
                            className="object-cover opacity-60"
                          />
                          <div className="absolute inset-0 bg-primary/20 flex flex-col items-center justify-center text-white p-6 text-center">
                             <h4 className="font-headline font-bold text-xl">{selectedStyleA.name}</h4>
                             <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Click to Remove</p>
                          </div>
                        </>
                     ) : (
                       <div className="text-center space-y-4 text-slate-300">
                          <Plus className="h-12 w-12 mx-auto" />
                          <p className="font-headline font-bold">Pick Style A</p>
                       </div>
                     )}
                   </div>

                   {/* Slot B */}
                   <div 
                     className={cn(
                       "aspect-[3/4] rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden",
                       selectedStyleB ? "border-primary bg-white shadow-2xl" : "border-slate-100 bg-slate-50/50 hover:bg-slate-100"
                     )}
                     onClick={() => { if(selectedStyleB) setSelectedStyleB(null) }}
                   >
                     {selectedStyleB ? (
                        <>
                          <Image 
                            src={MOCK_WARDROBE.find(i => i.id === selectedStyleB.items[0])?.imageUrl || ''} 
                            alt="Style B" 
                            fill 
                            className="object-cover opacity-60"
                          />
                          <div className="absolute inset-0 bg-primary/20 flex flex-col items-center justify-center text-white p-6 text-center">
                             <h4 className="font-headline font-bold text-xl">{selectedStyleB.name}</h4>
                             <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Click to Remove</p>
                          </div>
                        </>
                     ) : (
                       <div className="text-center space-y-4 text-slate-300">
                          <Plus className="h-12 w-12 mx-auto" />
                          <p className="font-headline font-bold">Pick Style B</p>
                       </div>
                     )}
                   </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1 h-16 rounded-full gradient-pill text-white font-headline text-xl shadow-xl shadow-primary/20"
                    disabled={!selectedStyleA || !selectedStyleB}
                    onClick={handleCreateBattle}
                  >
                    Launch Style Battle <Sparkles className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Selection Sidebar */}
            <div className="space-y-6">
               <h3 className="font-headline font-bold text-2xl text-primary">Select Outfits</h3>
               <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {MOCK_OUTFITS.map(outfit => {
                    const isSelected = selectedStyleA?.id === outfit.id || selectedStyleB?.id === outfit.id;
                    return (
                      <Card 
                        key={outfit.id} 
                        className={cn(
                          "cursor-pointer transition-all border shadow-sm rounded-[1.5rem] overflow-hidden group",
                          isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/40"
                        )}
                        onClick={() => {
                          if (isSelected) return;
                          if (!selectedStyleA) setSelectedStyleA(outfit);
                          else if (!selectedStyleB) setSelectedStyleB(outfit);
                          else toast({ title: "Remove a selection first" });
                        }}
                      >
                         <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-xl overflow-hidden relative shadow-md">
                               <Image 
                                 src={MOCK_WARDROBE.find(i => i.id === outfit.items[0])?.imageUrl || ''} 
                                 alt={outfit.name} 
                                 fill 
                                 className="object-cover"
                               />
                            </div>
                            <div className="flex-1">
                               <h5 className="font-headline font-bold text-sm text-primary">{outfit.name}</h5>
                               <p className="text-[10px] font-body text-muted-foreground uppercase">{outfit.occasion}</p>
                            </div>
                            {isSelected ? (
                              <Check className="h-5 w-5 text-primary" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                            )}
                         </CardContent>
                      </Card>
                    );
                  })}
               </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
