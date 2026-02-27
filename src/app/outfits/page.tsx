'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Plus, Share2, Trash2, Check, X } from "lucide-react";
import { MOCK_OUTFITS, MOCK_WARDROBE, Outfit } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function OutfitsPage() {
  const [view, setView] = useState<"list" | "create">("list");
  const [outfits, setOutfits] = useState<Outfit[]>(MOCK_OUTFITS);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [newOutfitName, setNewOutfitName] = useState("");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = (name: string) => {
    toast({
      title: "Shared!",
      description: `Outfit "${name}" link copied to clipboard.`,
    });
  };

  const handleDelete = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
    toast({
      title: "Outfit Removed",
      description: "The look has been deleted from your collection.",
      variant: "destructive"
    });
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreateOutfit = () => {
    if (!newOutfitName) {
      toast({ title: "Please name your outfit", variant: "destructive" });
      return;
    }
    if (selectedItems.length === 0) {
      toast({ title: "Please select at least one item", variant: "destructive" });
      return;
    }

    const newOutfit: Outfit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newOutfitName,
      items: selectedItems,
      occasion: 'casual',
      createdAt: new Date().toISOString()
    };

    setOutfits([newOutfit, ...outfits]);
    setView("list");
    setSelectedItems([]);
    setNewOutfitName("");
    toast({
      title: "Outfit Assembled!",
      description: "Your new look has been saved to your collection.",
    });
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground">Outfit Assembler</h2>
            <p className="text-muted-foreground font-body">Combine items to create your signature looks.</p>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/90 font-headline w-full md:w-auto text-accent-foreground rounded-full h-12 px-8"
            onClick={() => setView(view === "list" ? "create" : "list")}
          >
            {view === "list" ? (
              <><Plus className="mr-2 h-4 w-4" /> Assemble New Outfit</>
            ) : (
              "Cancel Assembler"
            )}
          </Button>
        </header>

        {view === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {outfits.map((outfit) => (
              <Card key={outfit.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col rounded-[2rem]">
                <CardHeader className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-headline font-bold text-primary">{outfit.name}</CardTitle>
                    <Badge variant="secondary" className="font-headline text-primary bg-primary/10 capitalize rounded-full px-3">
                      {outfit.occasion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1">
                  <div className="grid grid-cols-4 gap-2">
                    {outfit.items.map((itemId) => {
                      const item = MOCK_WARDROBE.find(i => i.id === itemId);
                      if (!item) return null;
                      return (
                        <div key={itemId} className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <div className="p-4 bg-slate-50 flex justify-between gap-2 border-t">
                  <Button variant="ghost" size="sm" className="font-headline text-muted-foreground hover:text-primary flex-1" onClick={() => handleShare(outfit.name)}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="ghost" size="sm" className="font-headline text-muted-foreground hover:text-destructive flex-1" onClick={() => handleDelete(outfit.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-8 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Workspace */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="min-h-[500px] border-2 border-dashed rounded-[3rem] flex flex-col p-8 bg-white/40 backdrop-blur-sm relative">
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    {selectedItems.length === 0 ? (
                      <div className="text-center space-y-4">
                        <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                          <Layers className="h-12 w-12 text-primary opacity-20" />
                        </div>
                        <div>
                          <p className="font-headline text-2xl font-bold text-slate-800">Visual Workspace</p>
                          <p className="font-body italic text-slate-400">Select garments from your collection on the right to start building a look.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                        {selectedItems.map(id => {
                          const item = MOCK_WARDROBE.find(i => i.id === id);
                          return (
                            <div key={id} className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl group border-4 border-white transition-transform hover:scale-105">
                              <Image src={item!.imageUrl} alt={item!.name} fill className="object-cover" />
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                onClick={() => toggleItemSelection(id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] text-white font-headline font-bold text-center uppercase tracking-widest">{item!.name}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              
              {/* Wardrobe Browser */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-headline font-bold text-xl text-primary">Your Collection</h3>
                  <Badge variant="outline" className="rounded-full px-4 border-primary/20 text-primary">{selectedItems.length} Selected</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 h-[550px] overflow-y-auto pr-2 custom-scrollbar p-2">
                  {MOCK_WARDROBE.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <Card 
                        key={item.id} 
                        className={cn(
                          "group relative overflow-hidden aspect-[3/4] cursor-pointer transition-all border-none rounded-2xl shadow-md",
                          isSelected ? "ring-4 ring-accent scale-[0.98]" : "hover:scale-[1.02]"
                        )}
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        <div className={cn(
                          "absolute inset-0 bg-primary/40 flex items-center justify-center transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                          {isSelected ? (
                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
                              <Check className="text-white h-6 w-6" />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                              <Plus className="text-primary h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Config & Action Bar - Positioned at Bottom */}
            <Card className="p-8 rounded-[3rem] shadow-2xl bg-white border-none flex flex-col md:flex-row items-end gap-6 border-t mt-8">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Name your signature look</label>
                <Input 
                  placeholder="e.g. Minimalist Business Casual" 
                  value={newOutfitName}
                  onChange={e => setNewOutfitName(e.target.value)}
                  className="h-14 rounded-2xl font-headline text-lg px-6 bg-slate-50 border-none shadow-inner"
                />
              </div>
              <Button 
                className="h-16 px-10 rounded-full gradient-pill text-white font-headline text-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full md:w-auto flex items-center gap-3" 
                onClick={handleCreateOutfit}
                disabled={selectedItems.length === 0 || !newOutfitName}
              >
                Save Outfit to Collection <Check className="h-6 w-6" />
              </Button>
            </Card>
          </div>
        )}

        {outfits.length === 0 && view === "list" && (
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-primary/10">
            <Layers className="mx-auto h-16 w-16 text-primary opacity-10 mb-6" />
            <p className="text-2xl font-headline font-bold text-slate-400 tracking-tight">Your Lookbook is Empty</p>
            <p className="text-muted-foreground font-body mt-2">Start assembling items to build your signature collection.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
