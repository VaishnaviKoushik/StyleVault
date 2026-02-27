'use client';

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Plus, Share2, Trash2, Check, X } from "lucide-react";
import { MOCK_OUTFITS, MOCK_WARDROBE, Outfit, WardrobeItem } from "@/lib/mock-data";
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
  const { toast } = useToast();

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground">Outfit Assembler</h2>
            <p className="text-muted-foreground font-body">Combine items to create your signature looks.</p>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/90 font-headline w-full md:w-auto text-accent-foreground"
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
              <Card key={outfit.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col">
                <CardHeader className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-headline font-bold">{outfit.name}</CardTitle>
                    <Badge variant="secondary" className="font-headline text-primary bg-primary/10 capitalize">
                      {outfit.occasion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <div className="grid grid-cols-4 gap-2">
                    {outfit.items.map((itemId) => {
                      const item = MOCK_WARDROBE.find(i => i.id === itemId);
                      if (!item) return null;
                      return (
                        <div key={itemId} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <div className="p-4 bg-secondary/30 flex justify-between gap-2">
                  <Button variant="ghost" size="sm" className="font-headline text-muted-foreground hover:text-primary" onClick={() => handleShare(outfit.name)}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="ghost" size="sm" className="font-headline text-muted-foreground hover:text-destructive" onClick={() => handleDelete(outfit.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right duration-300">
            <div className="lg:col-span-2 space-y-6">
              <Card className="min-h-[500px] border-2 border-dashed flex flex-col p-8 bg-white/40">
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  {selectedItems.length === 0 ? (
                    <>
                      <Layers className="h-16 w-16 opacity-20 mb-4" />
                      <p className="font-headline text-xl font-bold">Workspace</p>
                      <p className="font-body italic">Select items from your wardrobe to assemble a look.</p>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                      {selectedItems.map(id => {
                        const item = MOCK_WARDROBE.find(i => i.id === id);
                        return (
                          <div key={id} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group">
                            <Image src={item!.imageUrl} alt={item!.name} fill className="object-cover" />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => toggleItemSelection(id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Outfit Name</label>
                    <Input 
                      placeholder="e.g. Summer Brunch Look" 
                      value={newOutfitName}
                      onChange={e => setNewOutfitName(e.target.value)}
                      className="h-12 rounded-xl font-headline"
                    />
                  </div>
                  <Button className="w-full h-14 rounded-full gradient-pill text-white font-headline text-lg" onClick={handleCreateOutfit}>
                    Save Outfit to Collection <Check className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline font-bold text-lg">Your Wardrobe</h3>
                <Badge variant="outline">{selectedItems.length} selected</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_WARDROBE.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <Card 
                      key={item.id} 
                      className={cn(
                        "group relative overflow-hidden aspect-[3/4] cursor-pointer transition-all border-none",
                        isSelected && "ring-4 ring-primary"
                      )}
                      onClick={() => toggleItemSelection(item.id)}
                    >
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      <div className={cn(
                        "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}>
                        {isSelected ? <Check className="text-white h-10 w-10" /> : <Plus className="text-white h-8 w-8" />}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {outfits.length === 0 && view === "list" && (
          <div className="text-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-border">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-xl font-headline font-bold text-muted-foreground">No outfits saved yet</p>
            <p className="text-muted-foreground font-body">Create your first look now!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
