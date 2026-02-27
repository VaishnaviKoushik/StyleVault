'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Tag, Palette, Briefcase, Camera, Sparkles } from "lucide-react";
import { MOCK_WARDROBE, WardrobeItem } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const categories = ["all", "top", "bottom", "shoes", "accessory", "outerwear"];

export default function WardrobePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = MOCK_WARDROBE.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-6 space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-headline font-bold text-[#1C1C1E]">My Closet</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-10 w-10">
            <Search className="h-5 w-5 text-[#8E8E93]" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-10 w-10">
            <Filter className="h-5 w-5 text-[#8E8E93]" />
          </Button>
        </div>
      </header>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "capitalize font-headline h-8 px-4 rounded-full transition-all",
              activeCategory === cat ? "bg-[#6E4AE0] text-white border-glow" : "bg-white text-[#8E8E93] border-none shadow-sm"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Masonry-like Grid */}
      <div className="grid grid-cols-2 gap-4 pb-8">
        {filteredItems.map((item) => (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <div className="glass-card rounded-[24px] overflow-hidden group active:scale-95 transition-transform">
                <div className="relative aspect-[3/4]">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/80 backdrop-blur-md text-black border-none text-[10px] font-headline uppercase px-2 h-5">
                      {item.category}
                    </Badge>
                  </div>
                  {item.id === '1' && (
                    <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-[#00C9B7] flex items-center justify-center text-white border-2 border-white">
                      <Sparkles className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-headline font-bold truncate">{item.name}</h4>
                  <p className="text-[10px] text-[#8E8E93] font-body italic">{item.brand}</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] rounded-[32px] p-6">
              <DialogHeader>
                <DialogTitle className="font-headline text-xl">{item.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#8E8E93] uppercase">Brand</p>
                      <p className="text-sm font-headline">{item.brand}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-[#8E8E93] uppercase">Color</p>
                      <p className="text-sm font-headline">{item.color}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#8E8E93] uppercase">Occasions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.occasion.map(occ => (
                        <Badge key={occ} variant="secondary" className="bg-[#6E4AE0]/10 text-[#6E4AE0] font-headline text-[10px] px-2 capitalize">
                          {occ}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full rounded-full gradient-pill font-headline h-12">Edit Details</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
        
        {/* Add Button */}
        <Link href="/add-item" className="aspect-[3/4] rounded-[24px] bg-[#6E4AE0]/5 border-2 border-dashed border-[#6E4AE0]/20 flex flex-col items-center justify-center text-[#6E4AE0] gap-2">
          <Plus className="h-8 w-8" />
          <span className="text-xs font-bold font-headline">ADD ITEM</span>
        </Link>
      </div>
    </div>
  );
}