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
  MapPin,
  ClipboardList
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
    if (!eventTitle && !tempSelectedOutfitId) {
      toast({ title: "Please enter an event name or select an outfit", variant: "destructive" });
      return;
    }
    
    const newSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      date: date,
      outfitId: tempSelectedOutfitId,
      time: eventTime || 'All Day',
      location: eventTitle || (tempSelectedOutfitId ? outfits.find(o => o.id === tempSelectedOutfitId)?.name : 'New Event')
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

  const handleOpenManualEvent = () => {
    setTempSelectedOutfitId(null);
    setEventTitle("");
    setEventTime("12:00 PM");
    setIsSelectOutfitOpen(true);
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
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-1">
            <h2 className="text-5xl font-headline font-bold text-foreground tracking-tight italic">Style Journal</h2>
            <p className="text-muted-foreground font-body text-sm font-bold uppercase tracking-[0.3em] opacity-50">
              Personal Agenda & Lookbook
            </p>
          </div>
          <div className="flex gap-4">
             <Button 
              variant="outline" 
              className="h-14 px-8 rounded-full border-primary/20 text-primary font-headline text-lg hover:bg-primary/5 transition-all"
              onClick={() => { setActiveTab("assembler"); setAssemblerView("create"); }}
            >
              <Plus className="mr-2 h-5 w-5" /> Assemble Look
            </Button>
            <Button className="h-14 px-10 rounded-full gradient-primary text-white font-headline text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all" onClick={() => setActiveTab("schedule")}>
              <CalendarIcon className="mr-2 h-5 w-5" /> View Journal
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto bg-white/50 backdrop-blur-md shadow-sm border p-1.5 rounded-[2rem] mb-12 max-w-4xl mx-auto">
            <TabsTrigger value="schedule" className="py-4 font-headline text-lg rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
              Style Journal
            </TabsTrigger>
            <TabsTrigger value="lookbook" className="py-4 font-headline text-lg rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
              My Lookbook
            </TabsTrigger>
            <TabsTrigger value="assembler" className="hidden lg:flex py-4 font-headline text-lg rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
              Assembler
            </TabsTrigger>
          </TabsList>

          {/* SCHEDULE TAB */}
          <TabsContent value="schedule" className="space-y-12">
            <div className="bg-white rounded-[3rem] p-4 shadow-xl border border-slate-50 flex items-center gap-4 max-w-5xl mx-auto">
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-300 hover:text-primary transition-colors" onClick={() => setDate(addDays(date, -7))}>
                <ChevronLeft className="h-7 w-7" />
              </Button>
              <div className="flex-1 flex justify-between px-4 overflow-x-auto scrollbar-hide">
                {weekDays.map((day, i) => {
                  const active = isSameDay(day, date);
                  return (
                    <button
                      key={i}
                      onClick={() => setDate(day)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 min-w-[85px] rounded-[2rem] transition-all duration-300",
                        active ? "bg-primary text-white shadow-2xl scale-110" : "text-slate-400 hover:bg-slate-50 hover:text-primary"
                      )}
                    >
                      <span className={cn("text-[10px] font-bold uppercase mb-2 tracking-widest", active ? "text-white/70" : "text-slate-300")}>
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-2xl font-headline font-bold">{format(day, 'dd')}</span>
                    </button>
                  );
                })}
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-300 hover:text-primary transition-colors" onClick={() => setDate(addDays(date, 7))}>
                <ChevronRight className="h-7 w-7" />
              </Button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <h3 className="text-3xl font-headline font-bold text-primary">Agenda for {format(date, 'MMMM do')}</h3>
                <Badge variant="outline" className="rounded-full border-primary/20 text-primary px-6 py-1 h-8 text-sm font-headline">
                  {activeSchedules.length} Scheduled
                </Badge>
              </div>

              {activeSchedules.length > 0 ? (
                <div className="grid gap-8">
                  {activeSchedules.map(schedule => {
                    const outfit = outfits.find(o => o.id === schedule.outfitId);
                    return (
                      <Card key={schedule.id} className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden group hover:shadow-primary/5 transition-all duration-500">
                        <div className="md:flex h-full">
                          <div className="md:w-1/3 bg-slate-50/50 p-10 flex items-center justify-center min-h-[220px]">
                            {outfit ? (
                               <div className="flex -space-x-8">
                                {outfit.items.slice(0, 2).map((itemId, idx) => {
                                  const item = MOCK_WARDROBE.find(i => i.id === itemId);
                                  return (
                                    <div key={itemId} className={cn("relative h-44 w-32 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white transition-transform group-hover:scale-105 duration-500", idx === 0 ? "rotate-[-6deg]" : "rotate-[6deg]")}>
                                      {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-4 text-slate-200 opacity-50">
                                <ClipboardList className="h-16 w-16" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">No Outfit Linked</span>
                              </div>
                            )}
                          </div>
                          <div className="md:w-2/3 p-10 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3 text-accent font-headline font-bold uppercase text-xs tracking-widest">
                                  <Clock className="h-4 w-4" /> {schedule.time} <span className="text-slate-200">•</span> <MapPin className="h-4 w-4" /> {schedule.location}
                                </div>
                                <h4 className="text-4xl font-headline font-bold text-primary leading-tight">{outfit ? outfit.name : 'Personal Event'}</h4>
                              </div>
                              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-200 hover:text-destructive hover:bg-destructive/5 transition-all" onClick={() => handleUnschedule(schedule.id)}>
                                <Trash2 className="h-6 w-6" />
                              </Button>
                            </div>
                            <div className="flex gap-4 pt-10">
                              {outfit && <Button variant="outline" className="flex-1 rounded-full font-headline h-14 text-lg border-primary/20 text-primary hover:bg-primary/5 transition-all" onClick={() => handleViewItems(outfit.id)}>View Assembly</Button>}
                              <Button className="flex-1 rounded-full bg-slate-100 text-slate-400 hover:bg-destructive hover:text-white font-headline h-14 text-lg transition-all" onClick={() => handleUnschedule(schedule.id)}>Unschedule Entry</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-primary/5 flex flex-col items-center justify-center space-y-8 shadow-inner">
                  <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center">
                    <CalendarIcon className="h-12 w-12 text-primary opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-headline font-bold text-slate-800">Your Journal is Quiet</p>
                    <p className="text-muted-foreground font-body italic">Plan an event and curate your look to eliminate morning fatigue.</p>
                  </div>
                  <Button className="rounded-full h-16 px-12 bg-primary text-white font-headline text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all" onClick={() => setIsSelectOutfitOpen(true)}>
                    <Plus className="mr-3 h-5 w-5" /> New Journal Entry
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* LOOKBOOK TAB */}
          <TabsContent value="lookbook" className="space-y-10">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-3xl font-headline font-bold text-primary italic">Signature Collection</h3>
              <Button variant="outline" className="h-12 rounded-full font-headline border-accent text-primary px-8 hover:bg-accent hover:text-white transition-all shadow-md" onClick={handleOpenManualEvent}>
                <ClipboardList className="mr-3 h-5 w-5" /> Manual Entry
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {outfits.map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden border-none shadow-2xl bg-white rounded-[3rem] flex flex-col group hover:-translate-y-2 transition-all duration-500">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-headline font-bold text-primary leading-tight">{outfit.name}</CardTitle>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none rounded-full px-4 py-1 font-headline uppercase text-[10px] tracking-widest">{outfit.occasion}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 flex-1">
                    <div className="grid grid-cols-4 gap-3">
                      {outfit.items.map((itemId) => {
                        const item = MOCK_WARDROBE.find(i => i.id === itemId);
                        return item ? (
                          <div key={itemId} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 shadow-sm border-2 border-white">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                  <div className="p-6 bg-slate-50/50 flex justify-between gap-3 border-t border-slate-50">
                    <Button variant="ghost" size="sm" className="flex-1 h-12 rounded-full font-headline text-primary hover:bg-primary hover:text-white transition-all" onClick={() => { setDate(new Date()); setTempSelectedOutfitId(outfit.id); setIsSelectOutfitOpen(true); }}>
                      <CalendarIcon className="mr-2 h-4 w-4" /> Schedule
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-12 rounded-full font-headline text-destructive hover:bg-destructive/10 transition-all" onClick={() => handleDeleteOutfit(outfit.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
              <button 
                className="aspect-square rounded-[3rem] border-4 border-dashed border-primary/5 flex flex-col items-center justify-center text-primary gap-6 hover:bg-primary/5 hover:border-primary/20 transition-all group shadow-inner"
                onClick={() => { setAssemblerView("create"); setActiveTab("assembler"); }}
              >
                <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Plus className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-headline font-bold text-xl text-primary opacity-60">Assemble Look</p>
                  <p className="text-[10px] font-body uppercase tracking-widest text-slate-400">Create new combination</p>
                </div>
              </button>
            </div>
          </TabsContent>

          {/* ASSEMBLER TAB */}
          <TabsContent value="assembler" className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2 space-y-8">
                <Card className="min-h-[600px] border-4 border-dashed border-primary/5 rounded-[4rem] flex flex-col p-12 bg-white/40 backdrop-blur-md relative shadow-inner">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {selectedItems.length === 0 ? (
                      <div className="text-center space-y-6">
                        <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                          <Layers className="h-12 w-12 text-primary opacity-20" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-headline text-3xl font-bold text-slate-800">Visual Workspace</p>
                          <p className="font-body italic text-slate-400 text-lg">Select items from your collection to start building.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 w-full">
                        {selectedItems.map(id => {
                          const item = MOCK_WARDROBE.find(i => i.id === id);
                          return (
                            <div key={id} className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group hover:scale-105 transition-transform duration-500">
                              <Image src={item!.imageUrl} alt={item!.name} fill className="object-cover" />
                              <Button variant="destructive" size="icon" className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all" onClick={() => toggleItemSelection(id)}>
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
                {selectedItems.length > 0 && (
                  <Card className="p-10 rounded-[3.5rem] shadow-2xl bg-white flex flex-col md:flex-row items-end gap-8 border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/4 h-full bg-accent/5 pointer-events-none" />
                    <div className="flex-1 space-y-3 w-full relative z-10">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] px-3">Name this signature look</label>
                      <Input placeholder="e.g. Modern Professional" value={newOutfitName} onChange={e => setNewOutfitName(e.target.value)} className="h-16 rounded-2xl font-headline text-xl px-8 bg-slate-50 border-none shadow-inner" />
                    </div>
                    <Button className="h-16 px-12 rounded-full gradient-pill text-white font-headline text-xl shadow-xl hover:scale-105 transition-all shadow-primary/20" onClick={handleCreateOutfit} disabled={selectedItems.length === 0 || !newOutfitName}>
                      Save Assembly <Check className="ml-3 h-6 w-6" />
                    </Button>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <h3 className="font-headline font-bold text-2xl text-primary">Your Collection</h3>
                  <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary font-headline">{selectedItems.length} Selected</Badge>
                </div>
                <div className="grid grid-cols-2 gap-6 h-[700px] overflow-y-auto pr-4 scrollbar-hide p-2">
                  {MOCK_WARDROBE.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <Card 
                        key={item.id} 
                        className={cn("group relative overflow-hidden aspect-[3/4] cursor-pointer transition-all border-none rounded-[2rem] shadow-xl", isSelected ? "ring-8 ring-accent scale-[0.98]" : "hover:scale-[1.02]")}
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className={cn("absolute inset-0 bg-primary/40 flex items-center justify-center transition-opacity duration-300", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                          {isSelected ? (
                            <div className="h-14 w-14 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl">
                              <Check className="h-8 w-8" />
                            </div>
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl">
                              <Plus className="h-8 w-8" />
                            </div>
                          )}
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
        <DialogContent className="sm:max-w-xl bg-white rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-10 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="font-headline text-3xl font-bold text-primary italic">Schedule Journal Entry</DialogTitle>
            <p className="text-base text-muted-foreground font-body italic mt-2">Detail your event and link a look from your lookbook.</p>
          </DialogHeader>
          
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Event / Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    placeholder="e.g. Gala at The Met" 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-body text-lg shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    placeholder="e.g. 08:00 PM" 
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-body text-lg shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Linked Look (Optional)</label>
              <ScrollArea className="h-[320px] pr-4 rounded-3xl border border-slate-50 bg-slate-50/30 p-2">
                <div className="grid gap-3">
                  {outfits.map(outfit => {
                    const isSelected = tempSelectedOutfitId === outfit.id;
                    return (
                      <button 
                        key={outfit.id} 
                        className={cn(
                          "flex items-center gap-6 p-5 rounded-[2rem] border transition-all text-left group",
                          isSelected ? "bg-primary border-primary text-white shadow-xl scale-[0.98]" : "bg-white border-slate-100 hover:border-primary/20 shadow-sm"
                        )} 
                        onClick={() => setTempSelectedOutfitId(isSelected ? null : outfit.id)}
                      >
                        <div className="flex -space-x-5">
                          {outfit.items.slice(0, 3).map((itemId, idx) => (
                            <div key={idx} className="h-14 w-14 rounded-full border-4 border-white overflow-hidden shadow-lg relative shrink-0">
                              <Image src={MOCK_WARDROBE.find(i => i.id === itemId)?.imageUrl || ''} alt="" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("font-headline font-bold text-xl truncate", isSelected ? "text-white" : "text-primary")}>
                            {outfit.name}
                          </p>
                          <p className={cn("text-[10px] font-body uppercase tracking-[0.2em]", isSelected ? "text-white/60" : "text-slate-400")}>
                            {outfit.occasion}
                          </p>
                        </div>
                        {isSelected && <Check className="h-6 w-6 text-accent" />}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
            <Button variant="ghost" className="rounded-full font-headline text-lg px-8 h-14" onClick={() => setIsSelectOutfitOpen(false)}>Cancel</Button>
            <Button 
              className="rounded-full gradient-primary text-white font-headline h-14 px-10 flex-1 text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" 
              onClick={handleScheduleConfirm}
              disabled={!eventTitle && !tempSelectedOutfitId}
            >
              Confirm Journal Entry <Check className="ml-3 h-6 w-6" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Items Dialog */}
      <Dialog open={isViewItemsOpen} onOpenChange={setIsViewItemsOpen}>
        <DialogContent className="max-w-3xl bg-white rounded-[4rem] p-12 border-none shadow-2xl">
          <DialogHeader className="mb-8">
            <Badge className="bg-primary/5 text-primary font-headline uppercase px-4 py-1 border-none tracking-[0.2em] mb-4">Assembly Details</Badge>
            <DialogTitle className="font-headline text-5xl font-bold text-primary italic leading-none">{currentViewingOutfit?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-8 border-y border-slate-100">
            {currentViewingOutfit?.items.map((itemId: string) => {
              const item = MOCK_WARDROBE.find(i => i.id === itemId);
              return item ? (
                <div key={itemId} className="space-y-4 text-center group">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transition-transform group-hover:scale-105 duration-500">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-headline font-bold text-lg text-primary truncate px-2">{item.name}</p>
                    <p className="text-[10px] font-body uppercase tracking-widest text-slate-400">{item.brand}</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <div className="mt-10 flex justify-center">
            <Button className="h-14 px-16 rounded-full bg-primary text-white font-headline text-lg shadow-xl" onClick={() => setIsViewItemsOpen(false)}>Close View</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
