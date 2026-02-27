
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, CloudRain, Zap, Sun, Thermometer, Briefcase, PartyPopper, Users } from "lucide-react";
import { aiOutfitSuggester } from "@/ai/flows/ai-outfit-suggester";
import { MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const occasions = [
  { label: "Work", icon: Briefcase, value: "work" },
  { label: "Casual", icon: Users, value: "casual" },
  { label: "Formal", icon: Sparkles, value: "formal" },
  { label: "Date Night", icon: PartyPopper, value: "night out" },
];

export default function AiStylistPage() {
  const [loading, setLoading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [suggestion, setSuggestion] = useState<any>(null);
  const { toast } = useToast();

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
        reasoning: `Based on the ${selectedOccasion} occasion, I've curated this look from your collection. It balances style and appropriate etiquette.`
      });
    } catch (err) {
      toast({ title: "Failed to generate suggestion", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-headline font-bold text-foreground">AI Personal Stylist</h2>
          <p className="text-muted-foreground font-body">Leverage GenAI to find the perfect look for any occasion.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="font-headline text-xl">The Occasion</CardTitle>
                <CardDescription className="font-body italic">Where are you heading today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {occasions.map((occ) => {
                    const Icon = occ.icon;
                    return (
                      <Button
                        key={occ.value}
                        variant={selectedOccasion === occ.value ? "default" : "outline"}
                        className={cn(
                          "h-24 flex flex-col gap-2 font-headline",
                          selectedOccasion === occ.value ? "bg-accent border-accent" : "bg-white"
                        )}
                        onClick={() => setSelectedOccasion(occ.value)}
                      >
                        <Icon className="h-6 w-6" />
                        {occ.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-primary/10">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-primary" /> Weather Awareness
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-body font-semibold">Current Temp</span>
                  </div>
                  <span className="font-headline text-lg">68°F</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <span className="font-body font-semibold">Conditions</span>
                  </div>
                  <span className="font-headline">Partly Cloudy</span>
                </div>
                <p className="text-xs text-muted-foreground font-body italic text-center">AI automatically factors weather into suggestions.</p>
              </CardContent>
            </Card>

            <Button 
              className="w-full h-14 text-lg font-headline bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
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
                <p className="text-muted-foreground font-body mt-2">Select an occasion and let our AI browse your wardrobe to find a stunning combination.</p>
              </div>
            ) : suggestion ? (
              <Card className="border-none shadow-xl bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/10 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-headline text-2xl font-bold">Curated for You</CardTitle>
                    <Badge variant="outline" className="border-accent text-accent font-headline capitalize">
                      {selectedOccasion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {suggestion.items.map((item: any) => (
                      <div key={item.id} className="space-y-2">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <p className="text-xs font-headline font-bold text-center truncate">{item.name}</p>
                        <Badge variant="secondary" className="w-full justify-center text-[10px] uppercase font-headline">
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="bg-secondary/20 p-6 rounded-xl border border-primary/10">
                    <h4 className="font-headline font-bold text-primary mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Stylist's Note
                    </h4>
                    <p className="font-body text-foreground leading-relaxed italic text-lg">
                      "{suggestion.reasoning}"
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 font-headline bg-primary hover:bg-primary/90 h-12">
                      Save to Planner
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 font-headline border-accent text-accent hover:bg-accent/5 h-12"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      {loading ? "Re-generating..." : "Try Another Combination"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg border border-border">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-headline font-bold">Styling your collection...</h3>
                <p className="text-muted-foreground font-body mt-2">Our AI is analyzing {MOCK_WARDROBE.length} items to find the best match.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
