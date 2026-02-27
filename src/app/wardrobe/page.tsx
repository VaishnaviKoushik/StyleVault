
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Tag, Palette, Briefcase } from "lucide-react";
import { MOCK_WARDROBE, WardrobeItem } from "@/lib/mock-data";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categories = ["all", "top", "bottom", "shoes", "accessory", "outerwear"];

export default function WardrobePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  const filteredItems = MOCK_WARDROBE.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground">Digital Wardrobe</h2>
            <p className="text-muted-foreground font-body">Manage and browse your clothing collection.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 font-headline w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </header>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items, brands, colors..." 
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "capitalize font-headline whitespace-nowrap",
                  activeCategory === cat ? "bg-primary text-white" : "bg-white border-border"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card 
                  className="overflow-hidden group cursor-pointer border-none shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-[3/4]">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/80 text-black border-none hover:bg-white backdrop-blur-sm font-headline capitalize">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 bg-white">
                    <h4 className="font-headline font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground font-body italic">{item.brand}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline font-bold">{item.name}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-sm font-headline uppercase tracking-wider text-muted-foreground mb-1">Description</h5>
                      <p className="font-body text-foreground leading-relaxed italic">{item.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-headline uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                          <Tag className="h-3 w-3" /> Category
                        </h5>
                        <p className="capitalize font-body">{item.category}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-headline uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                          <Palette className="h-3 w-3" /> Color
                        </h5>
                        <p className="font-body">{item.color}</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-headline uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Occasions
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {item.occasion.map((occ) => (
                          <Badge key={occ} variant="secondary" className="capitalize font-headline text-primary-foreground bg-primary/20">
                            {occ}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full font-headline bg-accent hover:bg-accent/90 mt-4">Edit Item Details</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-border">
            <Shirt className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-xl font-headline font-bold text-muted-foreground">No items found</p>
            <p className="text-muted-foreground font-body">Try adjusting your filters or add something new!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

import { cn } from "@/lib/utils";
