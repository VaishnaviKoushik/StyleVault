'use client';

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Layers,
  Check,
  X,
  Share2,
  ArrowLeftRight,
  LayoutGrid,
  MapPin
} from "lucide-react";
import { MOCK_OUTFITS, MOCK_WARDROBE, Outfit } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UnifiedPlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  
  // Planner State
  const [date, setDate] = useState<Date>(new Date());
  const [scheduledOutfits, setScheduledOutfits] = useState<any[]>([]);
  const [isSelectOutfitOpen, setIsSelectOutfitOpen] = useState(false);
  const [isViewItemsOpen, setIsViewItemsOpen] = useState(false);
  const [currentViewingOutfit, setCurrentViewingOutfit] = useState<any>(null);

  // Manual Event Entry State
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("12:00 PM");
  const [tempSelectedOutfitId, setTempSelectedOutfitId] = useState<string | null>(null);

  // Lookbook/Assembler State
  const [outfits, setOutfits] = useState<Outfit[]>(MOCK_OUTFITS);
  const [assemblerView, setAssemblerView] = useState<"list" | "create">("list");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [newOutfitName, setNewOutfitName] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
    setScheduledOutfits([
      { id: 's1', date: new Date(), outfitId: 'o1', time: '09:00 AM', location: 'Office' }
    ]);
  }, []);

  const weekDays = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [date]);

  // Planner Handlers
  const handleUnschedule = (id: string) => {
    setScheduledOutfits(prev => prev.filter(s => s.id !== id));
    toast({ title: "Outfit Unscheduled", variant: "destructive" });
  };

  const handleScheduleConfirm = () => {
    if (!tempSelectedOutfitId) {
      toast({ title: "Please select an outfit", variant: "destructive" });
      return;
    }
    
    const newSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      date: date,
      outfitId: tempSelectedOutfitId,
      time: eventTime || 'All Day',
      location: eventTitle || 'New Event'
    };

    setScheduledOutfits([...scheduledOutfits, newSchedule]);
    setIsSelectOutfitOpen(false);
    
    // Reset temporary states
    setEventTitle("");
    setEventTime("12:00 PM");
    setTempSelectedOutfitId(null);
    
    toast({ 
      title: "Event Scheduled", 
      description: `Planned for ${format(date, 'MMM do')}.` 
    });
  };

  const handleViewItems = (outfitId: string) => {
    const outfit = outfits.find(o => o.id === outfitId);
    if (outfit) {
      setCurrentViewingOutfit(outfit);
      setIsViewItemsOpen(true);
    }
  };

  // Assembler Handlers
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreateOutfit = () => {
    if (!newOutfitName || selectedItems.length === 0) {
      toast({ title: "Please name your outfit and select items", variant: "destructive" });
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
    setAssemblerView("list");
    setSelectedItems([]);
    setNewOutfitName("");
    toast({ title: "Outfit Assembled!", description: "Saved to your lookbook." });
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
    toast({ title: "Outfit Removed", variant: "destructive" });
  };

  const activeSchedules = scheduledOutfits.filter(s => isSameDay(new Date(s.date), date));

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-foreground tracking-tight">Style Hub</h2>
            <p className="text-muted-foreground font-body text-xs font-bold uppercase tracking-widest opacity-60">
              Manage looks & schedule
            </p>
          </div>
          <div className="flex gap-3">
             <Button 
              variant="outline" 
              className="h-12 px-6 rounded-full border-primary/20 text-primary font-headline"
              onClick={() => { setActiveTab("assembler"); setAssemblerView("create"); }}
            >
              <Plus className="mr-2 h-4 w-4" /> New Look
            </Button>
            <Button className="h-12 px-8 rounded-full gradient-primary text-white font-headline shadow-lg" onClick={() => setActiveTab("schedule")}>
              <CalendarIcon className="mr-2 h-4 w-4" /> View Schedule
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto bg-white shadow-sm border p-1 rounded-2xl mb-8">
            <TabsTrigger value="schedule" className="py-3 font-headline rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              Style Journal
            </TabsTrigger>
            <TabsTrigger value="lookbook" className="py-3 font-headline rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              My Lookbook
            </TabsTrigger>
            <TabsTrigger value="assembler" className="hidden lg:flex py-3 font-headline rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              Assembler
            </TabsTrigger>
          </TabsList>

          {/* SCHEDULE TAB */}
          <TabsContent value="schedule" className="space-y-8">
            <div className="bg-white rounded-[3rem] p-3 shadow-sm border border-slate-50 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-slate-400" onClick={() => setDate(addDays(date, -7))}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 flex justify-between px-2 overflow-x-auto scrollbar-hide">
                {weekDays.map((day, i) => {
                  const active = isSameDay(day, date);
                  return (
                    <button
                      key={i}
                      onClick={() => setDate(day)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 min-w-[70px] rounded-[1.5rem] transition-all",
                        active ? "bg-primary text-white shadow-xl scale-110" : "text-slate-400 hover:bg-slate-50"
                      )}
                    >
                      <span className={cn("text-[9px] font-bold uppercase mb-1", active ? "text-white/70" : "text-slate-300")}>
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-xl font-headline font-bold">{format(day, 'dd')}</span>
                    </button>
                  );
                })}
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-slate-400" onClick={() => setDate(addDays(date, 7))}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-2xl font-headline font-bold text-primary">Agenda for {format(date, 'MMMM do')}</h3>
                <Badge variant="outline" className="rounded-full border-primary/20 text-primary">{activeSchedules.length} Events</Badge>
              </div>

              {activeSchedules.length > 0 ? (
                <div className="grid gap-6">
                  {activeSchedules.map(schedule => {
                    const outfit = outfits.find(o => o.id === schedule.outfitId);
                    if (!outfit) return null;
                    return (
                      <Card key={schedule.id} className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group">
                        <div className="md:flex">
                          <div className="md:w-1/3 bg-slate-50/50 p-6 flex items-center justify-center">
                             <div className="flex -space-x-6">
                              {outfit.items.slice(0, 2).map((itemId, idx) => {
                                const item = MOCK_WARDROBE.find(i => i.id === itemId);
                                return (
                                  <div key={itemId} className={cn("relative h-32 w-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white", idx === 0 ? "rotate-[-5deg]" : "rotate-[5deg]")}>
                                    {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <div className="md:w-2/3 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{schedule.time} • {schedule.location}</p>
                                <h4 className="text-3xl font-headline font-bold text-primary">{outfit.name}</h4>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-destructive" onClick={() => handleUnschedule(schedule.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex gap-3 pt-6">
                              <Button variant="outline" className="flex-1 rounded-full font-headline h-12" onClick={() => handleViewItems(outfit.id)}>View Items</Button>
                              <Button className="flex-1 rounded-full bg-slate-100 text-slate-400 hover:bg-destructive hover:text-white font-headline h-12" onClick={() => handleUnschedule(schedule.id)}>Unschedule</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed flex flex-col items-center justify-center space-y-6">
                  <CalendarIcon className="h-12 w-12 text-slate-200" />
                  <p className="text-xl font-headline font-bold text-slate-300">Nothing planned for this day</p>
                  <Button className="rounded-full h-12 px-8 bg-primary text-white" onClick={() => setIsSelectOutfitOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Schedule Event
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* LOOKBOOK TAB */}
          <TabsContent value="lookbook" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {outfits.map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden border-none shadow-lg bg-white rounded-[2rem] flex flex-col">
                  <CardHeader className="p-6 border-b">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-headline font-bold text-primary">{outfit.name}</CardTitle>
                      <Badge variant="secondary" className="bg-primary/10 text-primary rounded-full px-3">{outfit.occasion}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-1">
                    <div className="grid grid-cols-4 gap-2">
                      {outfit.items.map((itemId) => {
                        const item = MOCK_WARDROBE.find(i => i.id === itemId);
                        return item ? (
                          <div key={itemId} className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                  <div className="p-4 bg-slate-50 flex justify-between gap-2 border-t">
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setDate(new Date()); setTempSelectedOutfitId(outfit.id); setIsSelectOutfitOpen(true); }}>
                      <CalendarIcon className="mr-2 h-4 w-4" /> Schedule
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-destructive" onClick={() => handleDeleteOutfit(outfit.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
              <button 
                className="aspect-square rounded-[2rem] border-4 border-dashed border-primary/10 flex flex-col items-center justify-center text-primary/40 hover:bg-primary/5 hover:text-primary transition-all group"
                onClick={() => { setAssemblerView("create"); setActiveTab("assembler"); }}
              >
                <Plus className="h-12 w-12 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-headline font-bold">Assemble New Look</p>
              </button>
            </div>
          </TabsContent>

          {/* ASSEMBLER TAB */}
          <TabsContent value="assembler" className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                <Card className="min-h-[500px] border-2 border-dashed rounded-[3rem] flex flex-col p-8 bg-white/40 backdrop-blur-sm relative">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {selectedItems.length === 0 ? (
                      <div className="text-center space-y-4">
                        <Layers className="h-16 w-16 text-primary opacity-20 mx-auto" />
                        <p className="font-headline text-2xl font-bold text-slate-800">Visual Workspace</p>
                        <p className="font-body italic text-slate-400">Select items from your collection to start building.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                        {selectedItems.map(id => {
                          const item = MOCK_WARDROBE.find(i => i.id === id);
                          return (
                            <div key={id} className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                              <Image src={item!.imageUrl} alt={item!.name} fill className="object-cover" />
                              <Button variant="destructive" size="icon" className="absolute top-3 right-3 h-8 w-8 rounded-full" onClick={() => toggleItemSelection(id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
                {selectedItems.length > 0 && (
                  <Card className="p-8 rounded-[3rem] shadow-xl bg-white flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-1 space-y-2 w-full">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Name this look</label>
                      <Input placeholder="e.g. Modern Professional" value={newOutfitName} onChange={e => setNewOutfitName(e.target.value)} className="h-14 rounded-2xl font-headline text-lg px-6 bg-slate-50 border-none" />
                    </div>
                    <Button className="h-16 px-10 rounded-full gradient-pill text-white font-headline text-xl shadow-xl" onClick={handleCreateOutfit} disabled={selectedItems.length === 0 || !newOutfitName}>
                      Save Outfit <Check className="ml-2 h-6 w-6" />
                    </Button>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-headline font-bold text-xl text-primary px-2">Your Collection</h3>
                <div className="grid grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {MOCK_WARDROBE.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <Card 
                        key={item.id} 
                        className={cn("group relative overflow-hidden aspect-[3/4] cursor-pointer transition-all border-none rounded-2xl shadow-md", isSelected ? "ring-4 ring-accent" : "hover:scale-[1.02]")}
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        <div className={cn("absolute inset-0 bg-primary/40 flex items-center justify-center transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                          {isSelected ? <Check className="text-white h-8 w-8" /> : <Plus className="text-white h-8 w-8" />}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Unified Schedule Event Dialog */}
      <Dialog open={isSelectOutfitOpen} onOpenChange={setIsSelectOutfitOpen}>
        <DialogContent className="sm:max-w-xl bg-white rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-slate-50 border-b">
            <DialogTitle className="font-headline text-2xl font-bold text-primary">Schedule Event</DialogTitle>
            <p className="text-sm text-muted-foreground font-body">Detail your event and select a look from your lookbook.</p>
          </DialogHeader>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Event / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    placeholder="e.g. Dinner at Savoy" 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-slate-50 border-none font-body"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    placeholder="e.g. 08:00 PM" 
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-slate-50 border-none font-body"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Select Lookbook Signature</label>
              <ScrollArea className="h-[280px] pr-4">
                <div className="grid gap-3">
                  {outfits.map(outfit => {
                    const isSelected = tempSelectedOutfitId === outfit.id;
                    return (
                      <button 
                        key={outfit.id} 
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                          isSelected ? "bg-primary border-primary text-white" : "bg-white border-slate-100 hover:border-primary/20"
                        )} 
                        onClick={() => setTempSelectedOutfitId(outfit.id)}
                      >
                        <div className="flex -space-x-4">
                          {outfit.items.slice(0, 3).map((itemId, idx) => (
                            <div key={idx} className="h-12 w-12 rounded-full border-2 border-white overflow-hidden shadow-sm relative shrink-0">
                              <Image src={MOCK_WARDROBE.find(i => i.id === itemId)?.imageUrl || ''} alt="" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("font-headline font-bold truncate", isSelected ? "text-white" : "text-primary")}>
                            {outfit.name}
                          </p>
                          <p className={cn("text-[10px] font-body uppercase tracking-wider", isSelected ? "text-white/60" : "text-slate-400")}>
                            {outfit.occasion}
                          </p>
                        </div>
                        {isSelected && <Check className="h-5 w-5 text-accent" />}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50 border-t flex gap-3">
            <Button variant="ghost" className="rounded-full font-headline" onClick={() => setIsSelectOutfitOpen(false)}>Cancel</Button>
            <Button 
              className="rounded-full gradient-primary text-white font-headline h-12 px-8 flex-1" 
              onClick={handleScheduleConfirm}
              disabled={!tempSelectedOutfitId}
            >
              Confirm Journal Entry <Check className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Items Dialog */}
      <Dialog open={isViewItemsOpen} onOpenChange={setIsViewItemsOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader><DialogTitle className="font-headline text-3xl font-bold text-primary">{currentViewingOutfit?.name}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6">
            {currentViewingOutfit?.items.map((itemId: string) => {
              const item = MOCK_WARDROBE.find(i => i.id === itemId);
              return item ? (
                <div key={itemId} className="space-y-2 text-center">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <p className="font-headline font-bold text-sm truncate">{item.name}</p>
                </div>
              ) : null;
            })}
          </div>
          <Button className="w-full h-12 rounded-full bg-primary text-white font-headline" onClick={() => setIsViewItemsOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
