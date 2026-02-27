
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Plus, Share2, Trash2 } from "lucide-react";
import { MOCK_OUTFITS, MOCK_WARDROBE, Outfit, WardrobeItem } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function OutfitsPage() {
  const [view, setView] = useState<"list" | "create">("list");
  const [outfits, setOutfits] = useState<Outfit[]>(MOCK_OUTFITS);

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground">Outfit Assembler</h2>
            <p className="text-muted-foreground font-body">Combine items to create your signature looks.</p>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/90 font-headline w-full md:w-auto"
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
                  <Button variant="ghost" size="sm" className="font-headline text-muted-foreground hover:text-primary">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="ghost" size="sm" className="font-headline text-muted-foreground hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card className="min-h-[600px] border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-white/40">
                <Layers className="h-16 w-16 opacity-20 mb-4" />
                <p className="font-headline text-xl font-bold">Workspace</p>
                <p className="font-body italic">Drag and drop items here to assemble your outfit.</p>
              </Card>
            </div>
            <div className="space-y-4">
              <h3 className="font-headline font-bold text-lg">Your Wardrobe</h3>
              <div className="grid grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_WARDROBE.map((item) => (
                  <Card key={item.id} className="group relative overflow-hidden aspect-[3/4] cursor-pointer hover:ring-2 hover:ring-accent transition-all border-none">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="text-white h-8 w-8" />
                    </div>
                  </Card>
                ))}
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
