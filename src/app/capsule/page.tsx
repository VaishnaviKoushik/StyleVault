'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, RefreshCw, Layers, Bookmark, CheckCircle2, ArrowRight } from "lucide-react";
import { generateCapsule, type CapsuleOutput } from "@/ai/flows/capsule-generator";
import { MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CapsuleWardrobePage() {
  const [loading, setLoading] = useState(false);
  const [capsule, setCapsule] = useState<CapsuleOutput | null>(null);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateCapsule({
        wardrobeItems: MOCK_WARDROBE.map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          color: i.color
        }))
      });
      setCapsule(result);
      toast({ title: "Capsule Generated", description: "10 core pieces and 20 outfits identified." });
    } catch (err) {
      toast({ title: "Generation failed", variant: "destructive" });
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
            <Badge className="bg-primary/10 text-primary font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">
              Minimalist Logic
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary italic leading-none">
              Capsule <span className="text-accent">Generator.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body italic max-w-xl border-l-4 border-accent pl-6">
              "Condensing your collection into its most potent 10-piece core for maximum utility."
            </p>
          </div>
          <Button 
            className="h-16 px-10 rounded-full gradient-primary text-white font-headline text-xl shadow-xl active:scale-95 transition-all"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <RefreshCw className="mr-2 h-6 w-6 animate-spin" /> : <Sparkles className="mr-2 h-6 w-6" />}
            {capsule ? "Regenerate Capsule" : "Generate Capsule"}
          </Button>
        </header>

        {!capsule && !loading ? (
          <div className="py-24 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-primary/10">
            <Layers className="h-16 w-16 text-primary/20 mx-auto mb-6" />
            <h3 className="text-2xl font-headline font-bold text-slate-400 italic">Ready to distill your style?</h3>
            <p className="text-muted-foreground font-body mt-2">Generate a minimalist core to eliminate daily decision fatigue.</p>
          </div>
        ) : capsule ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* CORE PIECES */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-headline text-3xl font-bold text-primary italic">The Core 10</CardTitle>
                      <CardDescription className="font-body italic mt-1">Versatile essentials selected for multi-season harmony.</CardDescription>
                    </div>
                    <Badge className="bg-accent text-primary font-headline px-6 py-2 uppercase tracking-widest border-none">Optimal Selection</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                    {capsule.selectedIds.map(id => {
                      const item = MOCK_WARDROBE.find(i => i.id === id);
                      return item ? (
                        <div key={id} className="space-y-2 group">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          </div>
                          <p className="text-[10px] font-headline font-bold text-center text-primary/60 uppercase truncate">{item.name}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-primary text-white rounded-[3rem] p-10">
                <div className="flex gap-6 items-start">
                  <Sparkles className="h-10 w-10 text-accent shrink-0" />
                  <div className="space-y-4">
                    <h4 className="font-headline font-bold text-2xl italic">Stylist's Logic</h4>
                    <p className="text-xl font-body italic leading-relaxed opacity-90">"{capsule.stylistNote}"</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* OUTFIT COMBINATIONS */}
            <div className="space-y-6">
              <h3 className="font-headline font-bold text-xl text-primary px-4 flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-accent" /> Generated Assemblies (20)
              </h3>
              <ScrollArea className="h-[700px] pr-4">
                <div className="grid gap-4">
                  {capsule.outfits.map((outfit, idx) => (
                    <Card key={idx} className="border-none shadow-md bg-white rounded-[2rem] p-6 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                          {outfit.itemIds.slice(0, 3).map(id => (
                            <div key={id} className="h-12 w-12 rounded-full border-2 border-white overflow-hidden shadow-sm">
                              <Image 
                                src={MOCK_WARDROBE.find(i => i.id === id)?.imageUrl || ""} 
                                alt="" width={48} height={48} className="object-cover" 
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline font-bold text-primary group-hover:text-accent transition-colors truncate">{outfit.name}</h4>
                          <p className="text-[10px] font-body uppercase tracking-widest text-slate-400">{outfit.itemIds.length} Pieces</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-slate-100 group-hover:text-accent transition-colors" />
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              <Button className="w-full h-16 rounded-full gradient-primary text-white font-headline text-xl shadow-xl" onClick={() => toast({ title: "Capsule Saved!" })}>
                Save Entire Capsule Lookbook
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center space-y-6">
            <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <h3 className="text-2xl font-headline font-bold text-primary italic">Distilling your wardrobe...</h3>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
