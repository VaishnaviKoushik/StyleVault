'use client';

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Sparkles, 
  Trash2, 
  Cpu, 
  RefreshCw, 
  Calendar as CalendarIcon, 
  Clock, 
  Layers, 
  Check, 
  X, 
  MapPin, 
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Bookmark,
  Palette,
  LayoutGrid,
  History,
  TrendingUp,
  Zap,
  Info
} from "lucide-react";
import { MOCK_WARDROBE, MOCK_OUTFITS, WardrobeItem, Outfit } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { analyzeFabric, type FabricIntelligenceOutput } from "@/ai/flows/fabric-intelligence";
import { outfitRater, type OutfitRaterOutput } from "@/ai/flows/outfit-rater";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const categories = ["all", "top", "bottom", "dress", "shoes", "accessory", "outerwear"];

export default function MasterVaultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = searchParams.get('tab') || 'closet';
  const initialSubTab = searchParams.get('sub') || 'creations';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  // --- CLOSET STATE ---
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<WardrobeItem[]>(MOCK_WARDROBE);
  const [fabricAnalysis, setFabricAnalysis] = useState<FabricIntelligenceOutput | null>(null);
  const [analyzingFabric, setAnalyzingFabric] = useState(false);

  // --- PLANNER/JOURNAL STATE ---
  const [date, setDate] = useState<Date>(new Date());
  const [scheduledOutfits, setScheduledOutfits] = useState<any[]>([]);
  const [isSelectOutfitOpen, setIsSelectOutfitOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("12:00 PM");
  const [tempSelectedOutfitId, setTempSelectedOutfitId] = useState<string | null>(null);

  // --- LOOKBOOK & ASSEMBLER STATE ---
  const [outfits, setOutfits] = useState<Outfit[]>(MOCK_OUTFITS);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [newOutfitName, setNewOutfitName] = useState("");
  
  // --- OUTFIT RATING STATE ---
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingResult, setRatingResult] = useState<OutfitRaterOutput | null>(null);

  useEffect(() => {
    setMounted(true);
    setScheduledOutfits([
      { id: 's1', date: new Date(), outfitId: 'o1', time: '09:00 AM', location: 'Office' }
    ]);
  }, []);

  // Trigger AI Rating when selection changes (minimum 2 items)
  useEffect(() => {
    if (selectedItems.length >= 2) {
      handleRateOutfit();
    } else {
      setRatingResult(null);
    }
  }, [selectedItems]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [date]);

  // --- HANDLERS ---
  const handleRateOutfit = async () => {
    if (selectedItems.length < 2) return;
    setRatingLoading(true);
    try {
      const selectedGarments = selectedItems.map(id => MOCK_WARDROBE.find(i => i.id === id)).filter(Boolean) as WardrobeItem[];
      const result = await outfitRater({
        items: selectedGarments.map(i => ({
          name: i.name,
          category: i.category,
          color: i.color,
          description: i.description
        }))
      });
      setRatingResult(result);
    } catch (error) {
      console.error("Rating failed:", error);
    } finally {
      setRatingLoading(false);
    }
  };

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
      toast({ title: "Analysis complete" });
    } catch (error) {
      toast({ title: "Analysis failed", variant: "destructive" });
    } finally {
      setAnalyzingFabric(false);
    }
  };

  const handleUnschedule = (id: string) => {
    setScheduledOutfits(prev => prev.filter(s => s.id !== id));
    toast({ title: "Entry Removed", variant: "destructive" });
  };

  const handleScheduleConfirm = () => {
    if (!eventTitle && !tempSelectedOutfitId) {
      toast({ title: "Please detail your entry", variant: "destructive" });
      return;
    }
    const newSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      date: date,
      outfitId: tempSelectedOutfitId,
      time: eventTime || 'All Day',
      location: eventTitle || 'Private Event'
    };
    setScheduledOutfits([...scheduledOutfits, newSchedule]);
    setIsSelectOutfitOpen(false);
    setEventTitle("");
    setTempSelectedOutfitId(null);
    toast({ title: "Journal Entry Saved" });
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreateOutfit = () => {
    if (!newOutfitName || selectedItems.length === 0) {
      toast({ title: "Incomplete configuration", variant: "destructive" });
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
    setActiveSubTab("gallery");
    setSelectedItems([]);
    setNewOutfitName("");
    toast({ title: "Outfit Assembled" });
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeSchedules = scheduledOutfits.filter(s => isSameDay(new Date(s.date), date));

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-bold text-primary tracking-tighter italic">Master Vault</h2>
            <p className="text-muted-foreground font-body text-sm font-bold uppercase tracking-[0.3em] opacity-60">Unified Inventory & Style Studio</p>
          </div>
          <div className="flex gap-4">
             <Button asChild variant="outline" className="h-14 px-8 rounded-full border-primary/20 text-primary font-headline text-lg hover:bg-primary/5">
                <Link href="/add-item"><Plus className="mr-2 h-5 w-5" /> New Garment</Link>
             </Button>
             <Button 
              className="h-14 px-10 rounded-full gradient-primary text-white font-headline text-lg shadow-xl shadow-primary/20" 
              onClick={() => {
                setActiveTab("studio");
                setActiveSubTab("creations");
              }}
             >
                <Sparkles className="mr-2 h-5 w-5" /> Open Studio
             </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto bg-white/50 backdrop-blur-md shadow-sm border p-1.5 rounded-[2.5rem] mb-12 max-w-2xl mx-auto">
            <TabsTrigger value="closet" className="py-4 font-headline text-lg rounded-[2rem] data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Shirt className="mr-2 h-5 w-5" /> The Closet
            </TabsTrigger>
            <TabsTrigger value="studio" className="py-4 font-headline text-lg rounded-[2rem] data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Palette className="mr-2 h-5 w-5" /> Style Studio
            </TabsTrigger>
          </TabsList>

          {/* --- CLOSET TAB --- */}
          <TabsContent value="closet" className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-2 p-1 bg-white/50 rounded-full border">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "capitalize font-headline h-10 px-6 rounded-full",
                      activeCategory === cat ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-primary/5"
                    )}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search garments..." 
                  className="pl-12 h-12 rounded-full border-none bg-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredItems.map((item) => (
                <Dialog key={item.id} onOpenChange={(open) => !open && setFabricAnalysis(null)}>
                  <DialogTrigger asChild>
                    <div className="glass-card rounded-[2rem] overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all shadow-lg">
                      <div className="relative aspect-[3/4]">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 text-primary border-none text-[10px] font-headline uppercase px-3 h-6 shadow-sm">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h4 className="font-headline font-bold truncate text-primary">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest">{item.brand}</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl rounded-[3rem] p-0 overflow-hidden border-none bg-white shadow-2xl">
                    <div className="md:flex">
                      <div className="md:w-1/2 relative aspect-[3/4] md:aspect-auto">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="md:w-1/2 p-10 space-y-8 overflow-y-auto max-h-[90vh]">
                        <div className="space-y-2">
                          <Badge className="bg-primary/5 text-primary font-headline uppercase px-4 py-1 tracking-widest border-none">{item.category}</Badge>
                          <h3 className="font-headline text-4xl font-bold text-primary leading-tight">{item.name}</h3>
                        </div>
                        
                        <div className="space-y-6 pt-6 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Cpu className="h-6 w-6 text-primary" />
                              <h5 className="font-headline font-bold text-xl">Fabric Intelligence</h5>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full font-headline px-6" onClick={() => handleFabricIntelligence(item)} disabled={analyzingFabric}>
                              {analyzingFabric ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Analyze"}
                            </Button>
                          </div>
                          {fabricAnalysis && (
                            <div className="bg-primary/5 p-6 rounded-[1.5rem] space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold font-headline uppercase text-primary/60">Breathability</span>
                                <span className="font-headline font-bold text-xl text-primary">{fabricAnalysis.breathabilityScore}/10</span>
                              </div>
                              <Progress value={fabricAnalysis.breathabilityScore * 10} className="h-1.5" />
                              <p className="text-sm font-body italic text-slate-600">"{fabricAnalysis.explanation}"</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stylist Note</p>
                          <p className="text-base text-slate-600 font-body leading-relaxed italic border-l-4 border-accent pl-6">"{item.description}"</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          {/* --- STYLE STUDIO TAB --- */}
          <TabsContent value="studio" className="space-y-8">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
              <div className="flex flex-col items-center gap-8">
                <TabsList className="h-14 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                  <TabsTrigger value="creations" className="h-full px-8 font-headline rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
                    <Layers className="mr-2 h-4 w-4" /> Outfit Creations
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="h-full px-8 font-headline rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
                    <LayoutGrid className="mr-2 h-4 w-4" /> Inspiration Gallery
                  </TabsTrigger>
                  <TabsTrigger value="journal" className="h-full px-8 font-headline rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
                    <History className="mr-2 h-4 w-4" /> Style Journal
                  </TabsTrigger>
                </TabsList>

                {/* Sub-Tab Contents */}
                <div className="w-full">
                  {/* 1. OUTFIT CREATIONS (ASSEMBLER) */}
                  <TabsContent value="creations" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                      <div className="lg:col-span-2 space-y-8">
                        <Card className="min-h-[550px] border-4 border-dashed border-primary/5 rounded-[3.5rem] flex flex-col p-10 bg-white/40 backdrop-blur-md relative shadow-inner">
                          <div className="flex-1 flex flex-col items-center justify-center">
                            {selectedItems.length === 0 ? (
                              <div className="text-center space-y-4">
                                <Layers className="h-16 w-16 text-primary opacity-10 mx-auto" />
                                <p className="font-headline text-2xl font-bold text-slate-400 italic">Select garments to assemble a look.</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
                                {selectedItems.map(id => {
                                  const item = MOCK_WARDROBE.find(i => i.id === id);
                                  return (
                                    <div key={id} className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group">
                                      <Image src={item!.imageUrl} alt={item!.name} fill className="object-cover" />
                                      <Button variant="destructive" size="icon" className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toggleItemSelection(id)}>
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </Card>
                        
                        {/* --- AI OUTFIT EVALUATION SECTION --- */}
                        {selectedItems.length >= 2 && (
                          <Card className="p-10 rounded-[3rem] shadow-2xl bg-white border-none animate-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-8">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-headline font-bold text-2xl text-primary italic leading-none">AI Outfit Evaluation</h4>
                                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest px-1">Professional Style Protocol</p>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300" onClick={handleRateOutfit} disabled={ratingLoading}>
                                      <RefreshCw className={cn("h-5 w-5", ratingLoading && "animate-spin")} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Recalculate Analysis</TooltipContent>
                                </Tooltip>
                              </div>

                              {ratingLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                  <div className="h-12 w-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                                  <p className="font-headline font-bold text-primary italic">Syncing Stylist Data...</p>
                                </div>
                              ) : ratingResult ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                  <div className="space-y-6">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-7xl font-headline font-bold text-primary italic leading-none">{ratingResult.score}</span>
                                      <span className="text-2xl font-headline font-bold text-accent leading-none">% Match</span>
                                    </div>
                                    <Progress value={ratingResult.score} className="h-4 bg-slate-100" />
                                    <p className="text-lg font-body text-slate-600 leading-relaxed italic border-l-4 border-accent pl-6 py-1">
                                      "{ratingResult.reasoning}"
                                    </p>
                                  </div>
                                  <div className="space-y-8">
                                    <div className="space-y-4">
                                      {[
                                        { label: "Color Harmony", value: ratingResult.breakdown.colorHarmony },
                                        { label: "Seasonal Match", value: ratingResult.breakdown.seasonalMatch },
                                        { label: "Style Consistency", value: ratingResult.breakdown.styleConsistency }
                                      ].map((metric) => (
                                        <div key={metric.label} className="space-y-2">
                                          <div className="flex justify-between text-[10px] font-bold font-headline uppercase tracking-widest">
                                            <span className="text-muted-foreground">{metric.label}</span>
                                            <span className="text-primary">{metric.value}%</span>
                                          </div>
                                          <Progress value={metric.value} className="h-1.5" />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="space-y-3">
                                      <h5 className="font-headline font-bold text-sm text-primary flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-accent" /> Styling Tips
                                      </h5>
                                      <ul className="space-y-2">
                                        {ratingResult.stylingTips.map((tip, idx) => (
                                          <li key={idx} className="flex gap-3 text-sm font-body text-slate-600 items-start">
                                            <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                            <span>{tip}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                              
                              <div className="pt-4 flex gap-4">
                                <Button className="flex-1 h-14 rounded-full font-headline text-lg border-primary text-primary hover:bg-primary/5 transition-all" variant="outline">
                                  Improve This Outfit
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )}

                        {selectedItems.length > 0 && (
                          <Card className="p-8 rounded-[3rem] shadow-2xl bg-white flex flex-col md:flex-row items-end gap-6 border-none">
                            <div className="flex-1 space-y-2 w-full">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Outfit Title</label>
                              <Input placeholder="e.g. Modern Professional" value={newOutfitName} onChange={e => setNewOutfitName(e.target.value)} className="h-14 rounded-2xl font-headline text-lg px-6 bg-slate-50 border-none" />
                            </div>
                            <Button className="h-16 px-12 rounded-full gradient-pill text-white font-headline text-xl" onClick={handleCreateOutfit}>
                              Save Outfit <Check className="ml-2 h-6 w-6" />
                            </Button>
                          </Card>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-center px-2">
                          <h3 className="font-headline font-bold text-xl text-primary">Your Collection</h3>
                          <Badge variant="outline" className="rounded-full px-4 border-primary/20 text-primary">{selectedItems.length} Selected</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 h-[650px] overflow-y-auto pr-2 scrollbar-hide">
                          {MOCK_WARDROBE.map((item) => {
                            const isSelected = selectedItems.includes(item.id);
                            return (
                              <Card 
                                key={item.id} 
                                className={cn("group relative overflow-hidden aspect-[3/4] cursor-pointer transition-all border-none rounded-[1.5rem] shadow-md", isSelected ? "ring-4 ring-accent" : "hover:scale-[1.02]")}
                                onClick={() => toggleItemSelection(item.id)}
                              >
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                <div className={cn("absolute inset-0 bg-primary/40 flex items-center justify-center transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                                  <div className="h-12 w-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg">
                                    {isSelected ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 2. INSPIRATION GALLERY (LOOKBOOK) */}
                  <TabsContent value="gallery" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {outfits.map((outfit) => (
                        <Card key={outfit.id} className="overflow-hidden border-none shadow-xl bg-white rounded-[2.5rem] flex flex-col group hover:-translate-y-2 transition-all">
                          <CardHeader className="p-8 border-b">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-2xl font-headline font-bold text-primary">{outfit.name}</CardTitle>
                              <Badge variant="secondary" className="bg-primary/5 text-primary border-none rounded-full px-4 py-1 font-headline uppercase text-[10px]">{outfit.occasion}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-8 flex-1">
                            <div className="grid grid-cols-4 gap-3">
                              {outfit.items.map((itemId) => {
                                const item = MOCK_WARDROBE.find(i => i.id === itemId);
                                return item ? (
                                  <div key={itemId} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-white">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </CardContent>
                          <div className="p-6 bg-slate-50 flex justify-between gap-3 border-t">
                            <Button variant="ghost" className="flex-1 rounded-full font-headline text-primary" onClick={() => { 
                              setDate(new Date()); 
                              setTempSelectedOutfitId(outfit.id); 
                              setActiveSubTab("journal");
                              setIsSelectOutfitOpen(true); 
                            }}>
                              <CalendarIcon className="mr-2 h-4 w-4" /> Schedule
                            </Button>
                            <Button variant="ghost" className="flex-1 rounded-full font-headline text-destructive hover:bg-destructive/10" onClick={() => setOutfits(prev => prev.filter(o => o.id !== outfit.id))}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 3. STYLE JOURNAL (JOURNAL) */}
                  <TabsContent value="journal" className="mt-0 space-y-12">
                    <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border flex items-center gap-4 max-w-4xl mx-auto">
                      <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-300" onClick={() => setDate(addDays(date, -7))}>
                        <ChevronLeft className="h-7 w-7" />
                      </Button>
                      <div className="flex-1 flex justify-between px-2 overflow-x-auto scrollbar-hide">
                        {weekDays.map((day, i) => {
                          const active = isSameDay(day, date);
                          return (
                            <button key={i} onClick={() => setDate(day)} className={cn("flex flex-col items-center justify-center p-4 min-w-[75px] rounded-[1.5rem] transition-all", active ? "bg-primary text-white shadow-xl scale-110" : "text-slate-400 hover:bg-slate-50")}>
                              <span className="text-[10px] font-bold uppercase mb-1">{format(day, 'EEE')}</span>
                              <span className="text-xl font-headline font-bold">{format(day, 'dd')}</span>
                            </button>
                          );
                        })}
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-300" onClick={() => setDate(addDays(date, 7))}>
                        <ChevronRight className="h-7 w-7" />
                      </Button>
                    </div>

                    <div className="space-y-8 max-w-5xl mx-auto">
                      <div className="flex items-center justify-between border-b pb-6">
                        <h3 className="text-3xl font-headline font-bold text-primary">Agenda for {format(date, 'MMMM do')}</h3>
                        <Button className="rounded-full h-12 px-8 bg-primary text-white font-headline" onClick={() => setIsSelectOutfitOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" /> New Entry
                        </Button>
                      </div>

                      {activeSchedules.length > 0 ? (
                        <div className="grid gap-8">
                          {activeSchedules.map(schedule => {
                            const outfit = outfits.find(o => o.id === schedule.outfitId);
                            return (
                              <Card key={schedule.id} className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden group">
                                <div className="md:flex">
                                  <div className="md:w-1/3 bg-slate-50 p-8 flex items-center justify-center min-h-[180px]">
                                    {outfit ? (
                                       <div className="flex -space-x-8">
                                        {outfit.items.slice(0, 2).map((itemId, idx) => {
                                          const item = MOCK_WARDROBE.find(i => i.id === itemId);
                                          return (
                                            <div key={itemId} className={cn("relative h-40 w-28 rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white transition-transform group-hover:scale-105", idx === 0 ? "rotate-[-4deg]" : "rotate-[4deg]")}>
                                              {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    ) : <ClipboardList className="h-12 w-12 opacity-10" />}
                                  </div>
                                  <div className="md:w-2/3 p-10 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-accent font-headline font-bold uppercase text-[10px] tracking-widest">
                                          <Clock className="h-3 w-3" /> {schedule.time} <span className="text-slate-200">|</span> <MapPin className="h-3 w-3" /> {schedule.location}
                                        </div>
                                        <h4 className="text-3xl font-headline font-bold text-primary">{outfit ? outfit.name : 'Unassigned Event'}</h4>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-200 hover:text-destructive" onClick={() => handleUnschedule(schedule.id)}>
                                        <Trash2 className="h-5 w-5" />
                                      </Button>
                                    </div>
                                    <div className="flex gap-4 pt-8">
                                       <Button variant="outline" className="flex-1 rounded-full font-headline h-12">View Details</Button>
                                       <Button variant="ghost" className="flex-1 rounded-full text-slate-400 hover:text-destructive" onClick={() => handleUnschedule(schedule.id)}>Remove Entry</Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-primary/5 flex flex-col items-center justify-center space-y-6">
                          <CalendarIcon className="h-16 w-16 text-primary opacity-10" />
                          <p className="text-xl font-headline font-bold text-slate-400 italic">No events planned for this date.</p>
                          <Button className="rounded-full h-14 px-10 gradient-primary text-white" onClick={() => setIsSelectOutfitOpen(true)}>Schedule Look</Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isSelectOutfitOpen} onOpenChange={setIsSelectOutfitOpen}>
        <DialogContent className="sm:max-w-xl bg-white rounded-[2.5rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-slate-50 border-b">
            <DialogTitle className="font-headline text-2xl font-bold text-primary italic">Journal Entry Details</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Location / Event</label>
                <Input placeholder="Where to?" value={eventTitle} onChange={e => setEventTitle(e.target.value)} className="h-12 rounded-xl bg-slate-50 border-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Time</label>
                <Input placeholder="8:00 PM" value={eventTime} onChange={e => setEventTime(e.target.value)} className="h-12 rounded-xl bg-slate-50 border-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Select Outfit</label>
              <ScrollArea className="h-64 pr-4 border rounded-2xl p-2 bg-slate-50/30">
                <div className="grid gap-2">
                  {outfits.map(outfit => (
                    <button key={outfit.id} className={cn("flex items-center gap-4 p-4 rounded-xl border transition-all text-left", tempSelectedOutfitId === outfit.id ? "bg-primary text-white border-primary" : "bg-white border-slate-100")} onClick={() => setTempSelectedOutfitId(tempSelectedOutfitId === outfit.id ? null : outfit.id)}>
                      <div className="h-10 w-10 rounded-full overflow-hidden relative border shadow-sm shrink-0">
                        <Image src={MOCK_WARDROBE.find(i => i.id === outfit.items[0])?.imageUrl || ''} alt="" fill className="object-cover" />
                      </div>
                      <span className="font-headline font-bold truncate flex-1">{outfit.name}</span>
                      {tempSelectedOutfitId === outfit.id && <Check className="h-5 w-5 text-accent" />}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t flex gap-3">
            <Button variant="ghost" className="rounded-full px-6" onClick={() => setIsSelectOutfitOpen(false)}>Cancel</Button>
            <Button className="rounded-full gradient-primary text-white px-10 flex-1" onClick={handleScheduleConfirm}>Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
