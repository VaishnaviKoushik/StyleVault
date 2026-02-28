'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Heart, Sparkles, Filter, RefreshCw, ExternalLink } from "lucide-react";
import { MOCK_WARDROBE, MOCK_OUTFITS } from "@/lib/mock-data";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { smartShoppingSuggestions, type ShoppingSuggestionsOutput } from "@/ai/flows/smart-shopping-suggestions";
import { cn } from "@/lib/utils";

export default function ShoppingPage() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ShoppingSuggestionsOutput['suggestions'] | null>(null);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
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
      toast({ title: "Analysis complete", description: "Smart suggestions updated based on closet gaps." });
    } catch (error) {
      console.error("Failed to fetch shopping suggestions:", error);
      toast({
        title: "Intelligence Gap",
        description: "Unable to refresh suggestions right now. Using curated essentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = (itemName: string) => {
    toast({
      title: "Added to Wishlist",
      description: `${itemName} has been saved to your personal shopping list.`,
    });
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="space-y-10 animate-in fade-in duration-700 pt-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge className="bg-accent/10 text-accent font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">
              Smart Acquisition
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary italic leading-none">
              Gap <span className="text-accent">Analysis.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body italic max-w-xl border-l-4 border-accent pl-6">
              "Our AI identifies missing essentials in your wardrobe to maximize the utility of every signature look."
            </p>
          </div>
          <Button 
            onClick={fetchSuggestions} 
            disabled={loading}
            variant="outline"
            className="rounded-full h-12 px-6 border-primary/20 text-primary hover:bg-primary hover:text-white active:scale-95 transition-all font-headline font-bold"
          >
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh Intelligence
          </Button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="glass-card border-none p-6 space-y-4 animate-pulse bg-white/40">
                <div className="h-48 bg-slate-200 rounded-3xl w-full" />
                <div className="h-6 bg-slate-200 rounded-full w-3/4" />
                <div className="h-4 bg-slate-200 rounded-full w-full" />
                <div className="h-10 bg-slate-200 rounded-full w-full" />
              </Card>
            ))
          ) : suggestions ? (
            suggestions.map((suggestion, idx) => (
              <Card key={idx} className="glass-card border-none overflow-hidden group hover:shadow-2xl active:scale-[0.98] transition-all duration-500 bg-white/60 flex flex-col rounded-[2.5rem]">
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <Image 
                    src={suggestion.imageUrl} 
                    alt={suggestion.itemName} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-white/90 backdrop-blur-md text-primary font-headline shadow-sm border-none">
                      +{suggestion.matchCount} Matches
                    </Badge>
                    <Badge className="bg-primary text-white font-headline shadow-sm border-none uppercase text-[8px] tracking-widest">
                      {suggestion.platform}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-headline font-bold text-primary line-clamp-1">{suggestion.itemName}</h4>
                      <p className="text-xs text-muted-foreground font-body uppercase tracking-widest font-bold opacity-60">{suggestion.category}</p>
                    </div>
                    <p className="text-sm font-body text-slate-600 italic leading-relaxed">
                      "{suggestion.reason}"
                    </p>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button asChild className="flex-1 h-12 rounded-full gradient-primary text-white font-headline text-sm shadow-lg hover:shadow-primary/20 active:scale-95 transition-all" variant="default">
                      <a href={suggestion.shopUrl} target="_blank" rel="noopener noreferrer">
                        Shop on {suggestion.platform} <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-12 w-12 rounded-full border-primary/20 text-primary hover:bg-primary/5 active:scale-90 transition-all shrink-0"
                      onClick={() => handleAddToWishlist(suggestion.itemName)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-primary/10">
              <ShoppingBag className="h-16 w-16 text-primary/20 mx-auto mb-6" />
              <h3 className="text-2xl font-headline font-bold text-slate-400">Analysis Pending</h3>
              <p className="text-muted-foreground font-body mt-2">Our AI is currently optimizing your wardrobe strategy. Check back shortly.</p>
            </div>
          )}
        </section>

        {/* Footer info */}
        <footer className="py-12 border-t border-slate-100 flex flex-col items-center text-center space-y-4">
          <Sparkles className="h-8 w-8 text-accent opacity-40" />
          <div className="max-w-2xl">
            <h4 className="text-2xl font-headline font-bold text-primary">Intelligent Curation</h4>
            <p className="text-sm text-muted-foreground font-body italic mt-2">
              "StyleVault analyzes the geometric and color profiles of your existing 18+ items to ensure every new acquisition acts as a force multiplier for your signature looks."
            </p>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}
