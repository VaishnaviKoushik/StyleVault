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
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-foreground">Digital Closet</h2>
            <p className="text-muted-foreground font-body">Browse your collection of {items.length} items.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search collection..." 
                className="pl-10 h-12 rounded-full border-none bg-white shadow-sm w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button asChild className="h-12 rounded-full gradient-pill font-headline shadow-lg shadow-primary/20 text-white">
              <Link href="/add-item">
                <Plus className="mr-2 h-5 w-5" /> Add New Item
              </Link>
            </Button>
          </div>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 p-1 bg-white rounded-full border shadow-sm w-fit">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "capitalize font-headline h-10 px-6 rounded-full transition-all",
                activeCategory === cat ? "bg-primary text-white shadow-md" : "text-muted-foreground"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <Dialog key={item.id} onOpenChange={(open) => !open && setFabricAnalysis(null)}>
              <DialogTrigger asChild>
                <div className="glass-card rounded-[2rem] overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all">
                  <div className="relative aspect-[3/4]">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/80 backdrop-blur-md text-black border-none text-[10px] font-headline uppercase px-3 h-6">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5 space-y-1">
                    <h4 className="text-sm font-headline font-bold truncate group-hover:text-primary transition-colors">{item.name}</h4>
                    <p className="text-xs text-muted-foreground font-body italic">{item.brand}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl rounded-[3rem] p-0 overflow-hidden border-none bg-white">
                <div className="md:flex">
                  <div className="md:w-1/2 relative aspect-[3/4]">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="md:w-1/2 p-8 space-y-6 overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                      <div className="flex justify-between items-start">
                        <Badge className="bg-primary/10 text-primary font-headline uppercase">{item.category}</Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => setEditingItem(item)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <DialogTitle className="font-headline text-3xl font-bold">{item.name}</DialogTitle>
                    </DialogHeader>

                    {/* Fabric Intelligence Section */}
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-5 w-5 text-primary" />
                          <h5 className="font-headline font-bold text-lg">Fabric Intelligence</h5>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full font-headline text-xs border-primary/20"
                          onClick={() => handleFabricIntelligence(item)}
                          disabled={analyzingFabric}
                        >
                          {analyzingFabric ? "Analyzing..." : "Analyze Fabric"}
                        </Button>
                      </div>

                      {fabricAnalysis ? (
                        <div className="bg-primary/5 p-6 rounded-3xl space-y-4 animate-in slide-in-from-top-4 duration-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-primary" />
                              <span className="text-xs font-bold font-headline uppercase tracking-widest">Breathability</span>
                            </div>
                            <span className="font-headline font-bold text-primary">{fabricAnalysis.breathabilityScore}/10</span>
                          </div>
                          <Progress value={fabricAnalysis.breathabilityScore * 10} className="h-2" />
                          
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Seasonal Wisdom</p>
                            <p className="text-sm font-body leading-relaxed">{fabricAnalysis.explanation}</p>
                          </div>
                          <div className="p-3 bg-white/50 rounded-2xl border border-primary/10 italic text-xs font-body">
                            Pro Tip: {fabricAnalysis.careTip}
                          </div>
                        </div>
                      ) : analyzingFabric && (
                        <div className="space-y-4 py-8 text-center animate-pulse">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-sm font-headline italic">Scanning textile properties...</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Brand</p>
                        <p className="text-lg font-headline font-bold">{item.brand}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Color</p>
                        <p className="text-lg font-headline font-bold">{item.color}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stylist Notes</p>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed italic">
                        "{item.description}"
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 rounded-full gradient-pill font-headline h-14 text-white">
                        Add to Planner
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
          
          <Link href="/add-item" className="aspect-[3/4] rounded-[2rem] bg-primary/5 border-4 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary gap-4 hover:bg-primary/10 transition-all group">
            <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8" />
            </div>
            <span className="text-sm font-bold font-headline uppercase tracking-widest">Catalog Item</span>
          </Link>
        </div>

        {/* Replaced full shopping section with a CTA to the new page */}
        <section className="pt-20 border-t">
           <Card className="border-none shadow-xl bg-slate-50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                 <h3 className="text-3xl font-headline font-bold text-primary italic">Missing something?</h3>
                 <p className="text-muted-foreground font-body italic">Our AI identifies gaps in your collection to help you build a more versatile wardrobe.</p>
              </div>
              <Button asChild className="h-12 px-8 rounded-full gradient-primary text-white font-headline shadow-lg hover:scale-105 transition-all">
                 <Link href="/shopping">Explore Smart Suggestions <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
           </Card>
        </section>
      </div>
    </AppLayout>
  );
}
