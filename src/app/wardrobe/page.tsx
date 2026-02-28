'use client';

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Tag, Sparkles, Trash2, Edit3, Save, ShoppingBag, ArrowRight, Heart, Cpu, Thermometer, Wind } from "lucide-react";
import { MOCK_WARDROBE, MOCK_OUTFITS, WardrobeItem } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { analyzeFabric, type FabricIntelligenceOutput } from "@/ai/flows/fabric-intelligence";
import { Progress } from "@/components/ui/progress";

const categories = ["all", "top", "bottom", "dress", "shoes", "accessory", "outerwear"];

export default function WardrobePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<WardrobeItem[]>(MOCK_WARDROBE);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [fabricAnalysis, setFabricAnalysis] = useState<FabricIntelligenceOutput | null>(null);
  const [analyzingFabric, setAnalyzingFabric] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFabricIntelligence = async (item: WardrobeItem) => {
    setAnalyzingFabric(true);
    setFabricAnalysis(null);
    try {
      const result = await analyzeFabric({
        itemName: item.name,
        fabricType: item.brand || "Natural Fibers",
        description: item.description
      });
      setFabricAnalysis(result);
    } catch (error) {
      toast({ title: "Analysis failed", variant: "destructive" });
    } finally {
      setAnalyzingFabric(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Item Deleted",
      description: "Removed from your digital closet.",
      variant: "destructive"
    });
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
      toast({ title: "Item Updated" });
    }
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="space-y-12 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-foreground tracking-tight">Digital Closet</h2>
            <p className="text-muted-foreground font-body italic">Browse your collection of {items.length} items.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search collection..." 
                className="pl-10 h-12 rounded-full border-none bg-white shadow-sm w-full md:w-64 font-body"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button asChild className="h-12 px-8 rounded-full gradient-pill font-headline text-lg shadow-xl shadow-primary/20 text-white">
              <Link href="/add-item">
                <Plus className="mr-2 h-5 w-5" /> Add New Item
              </Link>
            </Button>
          </div>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/50 backdrop-blur-sm rounded-full border shadow-sm w-fit">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "capitalize font-headline h-10 px-8 rounded-full transition-all text-sm",
                activeCategory === cat ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filteredItems.map((item) => (
            <Dialog key={item.id} onOpenChange={(open) => !open && setFabricAnalysis(null)}>
              <DialogTrigger asChild>
                <div className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-lg border-white">
                  <div className="relative aspect-[3/4]">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md text-primary border-none text-[10px] font-headline uppercase px-4 h-7 flex items-center shadow-sm">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 space-y-1 bg-white">
                    <h4 className="text-lg font-headline font-bold truncate group-hover:text-primary transition-colors">{item.name}</h4>
                    <p className="text-xs text-muted-foreground font-body italic uppercase tracking-widest">{item.brand}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl rounded-[3rem] p-0 overflow-hidden border-none bg-white shadow-2xl">
                <div className="md:flex h-full">
                  <div className="md:w-1/2 relative aspect-[3/4] md:aspect-auto">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="md:w-1/2 p-10 space-y-8 overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-primary/10 text-primary font-headline uppercase px-4 py-1 tracking-widest border-none">{item.category}</Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary hover:bg-primary/5" onClick={() => setEditingItem(item)}>
                            <Edit3 className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-destructive hover:bg-destructive/5" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <DialogTitle className="font-headline text-4xl font-bold text-primary leading-tight">{item.name}</DialogTitle>
                    </DialogHeader>

                    {/* Fabric Intelligence Section */}
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Cpu className="h-6 w-6 text-primary" />
                          <h5 className="font-headline font-bold text-xl">Fabric Intelligence</h5>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full font-headline text-xs border-primary/20 px-6 h-9"
                          onClick={() => handleFabricIntelligence(item)}
                          disabled={analyzingFabric}
                        >
                          {analyzingFabric ? "Analyzing..." : "Analyze Fabric"}
                        </Button>
                      </div>

                      {fabricAnalysis ? (
                        <div className="bg-primary/5 p-8 rounded-[2rem] space-y-6 animate-in slide-in-from-top-4 duration-500 border border-primary/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wind className="h-5 w-5 text-primary opacity-60" />
                              <span className="text-[10px] font-bold font-headline uppercase tracking-widest text-primary/60">Breathability Score</span>
                            </div>
                            <span className="font-headline font-bold text-2xl text-primary">{fabricAnalysis.breathabilityScore}<span className="text-sm opacity-40">/10</span></span>
                          </div>
                          <Progress value={fabricAnalysis.breathabilityScore * 10} className="h-2 bg-primary/10" />
                          
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Seasonal Wisdom</p>
                            <p className="text-sm font-body leading-relaxed text-slate-700 italic">"{fabricAnalysis.explanation}"</p>
                          </div>
                          <div className="p-4 bg-white/80 rounded-2xl border border-primary/10 italic text-xs font-body text-primary shadow-sm">
                            <span className="font-bold uppercase tracking-widest mr-2 opacity-60">Pro Tip:</span>
                            {fabricAnalysis.careTip}
                          </div>
                        </div>
                      ) : analyzingFabric && (
                        <div className="space-y-4 py-12 text-center">
                          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-lg font-headline italic text-primary animate-pulse">Scanning textile structure...</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Manufacturer</p>
                        <p className="text-xl font-headline font-bold text-primary">{item.brand}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Signature Color</p>
                        <p className="text-xl font-headline font-bold text-primary">{item.color}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Stylist Intelligence</p>
                      <p className="text-base text-slate-600 font-body leading-relaxed italic border-l-4 border-accent pl-6">
                        "{item.description}"
                      </p>
                    </div>

                    <div className="pt-6">
                      <Button className="w-full rounded-full gradient-primary font-headline h-16 text-white text-lg shadow-xl shadow-primary/20">
                        Add to Style Journal
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
          
          <Link href="/add-item" className="aspect-[3/4] rounded-[2.5rem] bg-primary/5 border-4 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary gap-6 hover:bg-primary/10 transition-all group shadow-inner">
            <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-slate-50">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <span className="text-xs font-bold font-headline uppercase tracking-[0.2em] opacity-60">Digitize New Item</span>
          </Link>
        </div>

        {/* Smart Acquisition CTA */}
        <section className="pt-20 border-t border-slate-100">
           <Card className="border-none shadow-2xl bg-white rounded-[4rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
              <div className="space-y-4 relative z-10 flex-1">
                 <Badge className="bg-accent/10 text-accent font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">Strategy</Badge>
                 <h3 className="text-4xl font-headline font-bold text-primary italic leading-tight">Missing something?</h3>
                 <p className="text-lg text-muted-foreground font-body italic max-w-xl">Our AI identifies high-impact gaps in your collection to maximize your styling combinations.</p>
              </div>
              <Button asChild className="h-16 px-12 rounded-full gradient-primary text-white font-headline text-xl shadow-xl hover:scale-105 transition-all group-hover:shadow-primary/30">
                 <Link href="/shopping">Explore Recommendations <ArrowRight className="ml-3 h-6 w-6" /></Link>
              </Button>
           </Card>
        </section>
      </div>
    </AppLayout>
  );
}
