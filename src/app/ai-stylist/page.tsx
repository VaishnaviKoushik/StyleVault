"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sparkles, 
  CloudRain, 
  Zap, 
  Sun, 
  Thermometer, 
  Briefcase, 
  Users, 
  CalendarCheck,
  Music,
  Dumbbell,
  Plane,
  Umbrella,
  Heart,
  Trophy,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  ArrowLeftRight,
  Plus,
  Check,
  TrendingUp,
  Palette,
  ChevronRight
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
import { Progress } from "@/components/ui/progress";

const occasions = [
  { label: "Work", icon: Briefcase, value: "work" },
  { label: "Casual", icon: Users, value: "casual" },
  { label: "Formal", icon: Sparkles, value: "formal" },
  { label: "Date Night", icon: Heart, value: "night out" },
  { label: "Party", icon: Music, value: "party" },
  { label: "Sporty", icon: Dumbbell, value: "sporty" },
  { label: "Travel", icon: Plane, value: "travel" },
  { label: "Beach", icon: Umbrella, value: "beach" },
];

export default function AiStylistPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'stylist';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("");
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
    if (!selectedOccasion) {
      toast({ title: "Please select an occasion" });
      return;
    }

    setLoading(true);
    try {
      const result = await aiOutfitSuggester({
        occasion: selectedOccasion,
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
        <header>
          <h2 className="text-4xl font-headline font-bold text-foreground">Style Intelligence</h2>
          <p className="text-muted-foreground font-body">Combine AI insights with community feedback.</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto bg-white shadow-sm border p-1 rounded-2xl mb-8 max-w-md mx-auto">
            <TabsTrigger value="stylist" className="py-3 font-headline rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              AI Stylist
            </TabsTrigger>
            <TabsTrigger value="compare" className="py-3 font-headline rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              Style Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stylist" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <Card className="border-none shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">The Occasion</CardTitle>
                    <CardDescription className="font-body italic">Where are you heading today?</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {occasions.map((occ) => {
                      const Icon = occ.icon;
                      return (
                        <Button
                          key={occ.value}
                          variant={selectedOccasion === occ.value ? "default" : "outline"}
                          className={cn(
                            "h-20 flex flex-col gap-2 font-headline",
                            selectedOccasion === occ.value ? "bg-accent border-accent" : "bg-white"
                          )}
                          onClick={() => setSelectedOccasion(occ.value)}
                        >
                          <Icon className="h-5 w-5" />
                          {occ.label}
                        </Button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Button 
                  className="w-full h-14 text-lg font-headline bg-accent hover:bg-accent/90 shadow-lg"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <><Zap className="mr-2 h-5 w-5 animate-pulse" /> Consulting Stylist...</>
                  ) : (
                    <><Sparkles className="mr-2 h-5 w-5" /> Generate My Outfit</>
                  )}
                </Button>
              </div>

              <div className="lg:col-span-2">
                {!suggestion && !loading ? (
                  <div className="h-full flex flex-col items-center justify-center bg-white/40 border-2 border-dashed rounded-xl p-10 text-center">
                    <Sparkles className="h-16 w-16 text-primary/30 mb-6" />
                    <h3 className="text-2xl font-headline font-bold text-muted-foreground">Ready for a new look?</h3>
                    <p className="text-muted-foreground font-body mt-2">Select an occasion and let our AI browse your wardrobe.</p>
                  </div>
                ) : suggestion ? (
                  <Card className="border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
                      <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-2xl font-bold">Curated for You</CardTitle>
                        <Badge variant="outline" className="border-accent text-accent font-headline capitalize">
                          {selectedOccasion}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                      {suggestion.shoppingAdvised && (
                        <div className="bg-accent/5 border border-accent/20 p-4 rounded-2xl flex items-start gap-4">
                          <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-1" />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-headline font-bold text-primary">Wardrobe Gap Detected</h4>
                            <p className="text-sm font-body text-slate-600">Consider exploring suggestions to complete this look.</p>
                            <Button variant="link" asChild className="p-0 h-auto text-accent font-bold">
                              <Link href="/shopping">Consult Shopping Engine <ArrowRight className="ml-1 h-3 w-3" /></Link>
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {suggestion.items.map((item: any) => (
                          <div key={item.id} className="space-y-2">
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            </div>
                            <p className="text-xs font-headline font-bold text-center truncate">{item.name}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-secondary/20 p-6 rounded-xl border border-primary/10">
                        <p className="font-body text-foreground leading-relaxed italic text-lg">
                          "{suggestion.reasoning}"
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <Button className="flex-1 h-12 rounded-full font-headline bg-primary" asChild>
                          <Link href="/planner">Schedule Look</Link>
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 rounded-full font-headline border-accent text-accent" onClick={() => setActiveTab('compare')}>
                          <ArrowLeftRight className="mr-2 h-4 w-4" /> Compare Friends
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-10 bg-white rounded-xl">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                    <h3 className="text-xl font-headline font-bold">Styling your collection...</h3>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                {activeBattles.map(battle => (
                  <Card key={battle.id} className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-6 border-b flex flex-row justify-between items-center">
                      <span className="font-headline font-bold text-primary">Global Comparison</span>
                      <Badge className="bg-accent text-primary">Ends in {battle.timeLeft}</Badge>
                    </CardHeader>
                    <CardContent className="p-8 space-y-10">
                      <div className="grid grid-cols-2 gap-8 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-accent text-primary flex items-center justify-center font-headline font-bold z-10 border-2 border-white shadow-lg">VS</div>
                        
                        <div className="space-y-4">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                            <Image src={MOCK_WARDROBE.find(i => i.id === battle.styleA.items[0])?.imageUrl || ''} alt="" fill className="object-cover" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                              <span className="text-lg font-headline font-bold">{battle.votesA}%</span>
                            </div>
                          </div>
                          <Button className="w-full rounded-full" onClick={() => handleVote(battle.id, 'A')}>Style A</Button>
                        </div>

                        <div className="space-y-4">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                            <Image src={MOCK_WARDROBE.find(i => i.id === battle.styleB.items[0])?.imageUrl || ''} alt="" fill className="object-cover" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                              <span className="text-lg font-headline font-bold">{battle.votesB}%</span>
                            </div>
                          </div>
                          <Button className="w-full rounded-full" onClick={() => handleVote(battle.id, 'B')}>Style B</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-lg bg-white p-6 space-y-6">
                  <h3 className="font-headline font-bold text-xl">Create New Battle</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={cn("aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer", selectedStyleA && "border-primary")} onClick={() => setSelectedStyleA(null)}>
                      {selectedStyleA ? <span className="text-xs font-bold text-primary text-center px-2">{selectedStyleA.name}</span> : <Plus className="text-slate-300" />}
                    </div>
                    <div className={cn("aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer", selectedStyleB && "border-primary")} onClick={() => setSelectedStyleB(null)}>
                      {selectedStyleB ? <span className="text-xs font-bold text-primary text-center px-2">{selectedStyleB.name}</span> : <Plus className="text-slate-300" />}
                    </div>
                  </div>
                  <Button className="w-full rounded-full" disabled={!selectedStyleA || !selectedStyleB} onClick={handleCreateBattle}>Launch Battle</Button>
                </Card>

                <div className="space-y-4">
                  <h4 className="font-headline font-bold text-sm text-muted-foreground uppercase tracking-widest px-2">Your Outfits</h4>
                  <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {MOCK_OUTFITS.map(outfit => (
                      <div 
                        key={outfit.id} 
                        className="p-3 bg-white rounded-xl border shadow-sm flex items-center gap-3 cursor-pointer hover:border-primary transition-all"
                        onClick={() => {
                          if (!selectedStyleA) setSelectedStyleA(outfit);
                          else if (!selectedStyleB) setSelectedStyleB(outfit);
                        }}
                      >
                        <div className="h-10 w-10 rounded-lg overflow-hidden relative">
                          <Image src={MOCK_WARDROBE.find(i => i.id === outfit.items[0])?.imageUrl || ''} alt="" fill className="object-cover" />
                        </div>
                        <span className="text-xs font-bold font-headline">{outfit.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
                      </div>
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
