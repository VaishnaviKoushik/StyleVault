'use client';

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Tag, Sparkles, Trash2, Edit3, Save } from "lucide-react";
import { MOCK_WARDROBE, WardrobeItem } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const categories = ["all", "top", "bottom", "dress", "shoes", "accessory", "outerwear"];

export default function WardrobePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<WardrobeItem[]>(MOCK_WARDROBE);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const { toast } = useToast();

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Item Deleted",
      description: "The item has been removed from your digital closet.",
      variant: "destructive"
    });
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
      toast({
        title: "Item Updated",
        description: "Your changes have been saved successfully.",
      });
    }
  };

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
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div className="glass-card rounded-[2rem] overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all">
                  <div className="relative aspect-[3/4]">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/80 backdrop-blur-md text-black border-none text-[10px] font-headline uppercase px-3 h-6">
                        {item.category}
                      </Badge>
                    </div>
                    {item.id === '1' && (
                      <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white border-2 border-white shadow-lg">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}
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
                    {editingItem?.id === item.id ? (
                      <div className="space-y-6">
                        <DialogHeader>
                          <DialogTitle className="font-headline text-2xl font-bold">Edit Item Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Item Name</label>
                            <Input 
                              value={editingItem.name} 
                              onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                              className="font-headline"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Brand</label>
                            <Input 
                              value={editingItem.brand} 
                              onChange={e => setEditingItem({...editingItem, brand: e.target.value})}
                              className="font-headline"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Color</label>
                            <Input 
                              value={editingItem.color} 
                              onChange={e => setEditingItem({...editingItem, color: e.target.value})}
                              className="font-headline"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Description</label>
                            <Textarea 
                              value={editingItem.description} 
                              onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                              className="font-body italic text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 rounded-full font-headline h-12" onClick={() => setEditingItem(null)}>Cancel</Button>
                          <Button className="flex-1 rounded-full gradient-pill font-headline h-12 text-white" onClick={handleSaveEdit}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
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

                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Occasions</p>
                          <div className="flex flex-wrap gap-2">
                            {item.occasion.map(occ => (
                              <Badge key={occ} variant="secondary" className="bg-primary/10 text-primary font-headline text-xs px-3 py-1 capitalize border-none">
                                {occ}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Stylist Notes</p>
                          <p className="text-sm text-muted-foreground font-body leading-relaxed italic">
                            "{item.description}"
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button className="flex-1 rounded-full gradient-pill font-headline h-14 text-white" onClick={() => setEditingItem(item)}>
                            Edit Details
                          </Button>
                          <Button variant="outline" className="h-14 w-14 rounded-full border-red-100 text-red-400 p-0 hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
          
          <Link href="/add-item" className="aspect-[3/4] rounded-[2rem] bg-primary/5 border-4 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary gap-4 hover:bg-primary/10 transition-all group">
            <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8" />
            </div>
            <span className="text-sm font-bold font-headline uppercase tracking-widest">Catalog New Item</span>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
