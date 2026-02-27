'use client';

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { MOCK_OUTFITS, MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";

export default function PlannerPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [scheduledOutfits, setScheduledOutfits] = useState<any[]>([
    { id: 's1', date: new Date(), outfitId: 'o1', time: '09:00 AM', location: 'Office' }
  ]);
  const [isSelectOutfitOpen, setIsSelectOutfitOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isViewItemsOpen, setIsViewItemsOpen] = useState(false);
  const [currentEditingEvent, setCurrentEditingEvent] = useState<any>(null);
  const [currentViewingOutfit, setCurrentViewingOutfit] = useState<any>(null);
  const { toast } = useToast();

  // Generate the current week for the horizontal selector
  const weekDays = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [date]);

  const handleUnschedule = (id: string) => {
    setScheduledOutfits(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Outfit Unscheduled",
      description: "The event has been removed from your calendar.",
      variant: "destructive"
    });
  };

  const handleSchedule = (outfitId: string) => {
    const newSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      date: date,
      outfitId: outfitId,
      time: '12:00 PM',
      location: 'New Event'
    };
    setScheduledOutfits([...scheduledOutfits, newSchedule]);
    setIsSelectOutfitOpen(false);
    toast({
      title: "Outfit Scheduled",
      description: `Outfit planned for ${format(date, 'MMM do')}.`,
    });
  };

  const handleEditClick = (event: any) => {
    setCurrentEditingEvent({ ...event });
    setIsEditEventOpen(true);
  };

  const handleSaveEdit = () => {
    setScheduledOutfits(prev => prev.map(s => s.id === currentEditingEvent.id ? currentEditingEvent : s));
    setIsEditEventOpen(false);
    toast({
      title: "Event Updated",
      description: "Changes saved successfully.",
    });
  };

  const handleViewItems = (outfitId: string) => {
    const outfit = MOCK_OUTFITS.find(o => o.id === outfitId);
    if (outfit) {
      setCurrentViewingOutfit(outfit);
      setIsViewItemsOpen(true);
    }
  };

  const activeSchedules = scheduledOutfits.filter(s => 
    isSameDay(new Date(s.date), date)
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-bold text-foreground tracking-tight">Style Journal</h2>
            <p className="text-muted-foreground font-body text-lg italic uppercase tracking-widest">
              {format(date, 'MMMM yyyy')}
            </p>
          </div>
          <div className="flex gap-3">
             <Dialog open={isSelectOutfitOpen} onOpenChange={setIsSelectOutfitOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 px-8 rounded-full gradient-pill font-headline text-lg text-white shadow-xl border-glow">
                  <Plus className="mr-2 h-5 w-5" /> Plan New Look
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="font-headline text-3xl font-bold text-center">Curate for {format(date, 'MMM do')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-6">
                  <div className="grid gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {MOCK_OUTFITS.map(outfit => (
                      <button 
                        key={outfit.id} 
                        className="group flex items-center gap-6 p-4 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-primary hover:shadow-lg transition-all text-left"
                        onClick={() => handleSchedule(outfit.id)}
                      >
                        <div className="flex -space-x-4">
                          {outfit.items.slice(0, 3).map((itemId, idx) => {
                            const item = MOCK_WARDROBE.find(i => i.id === itemId);
                            return (
                              <div key={idx} className="h-14 w-14 rounded-full border-4 border-white overflow-hidden shadow-sm relative">
                                {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex-1">
                          <p className="font-headline font-bold text-lg group-hover:text-primary transition-colors">{outfit.name}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{outfit.occasion}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Horizontal Week Selector */}
        <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 border border-slate-100/50 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12" onClick={() => setDate(addDays(date, -7))}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1 flex justify-between px-2 overflow-x-auto scrollbar-hide">
            {weekDays.map((day, i) => {
              const active = isSameDay(day, date);
              return (
                <button
                  key={i}
                  onClick={() => setDate(day)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 min-w-[80px] rounded-[2rem] transition-all duration-300",
                    active 
                      ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110" 
                      : "hover:bg-slate-50 text-muted-foreground"
                  )}
                >
                  <span className={cn("text-[10px] font-bold uppercase tracking-tighter", active ? "opacity-80" : "opacity-60")}>
                    {format(day, 'EEE')}
                  </span>
                  <span className="text-2xl font-headline font-bold">
                    {format(day, 'dd')}
                  </span>
                  {active && <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
                </button>
              );
            })}
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12" onClick={() => setDate(addDays(date, 7))}>
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Calendar Widget Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="w-full flex justify-center font-body"
              />
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-primary/80 text-white rounded-[3rem] p-8 space-y-4">
              <Sparkles className="h-8 w-8 text-accent" />
              <h4 className="font-headline text-xl font-bold">Stylist Recommendation</h4>
              <p className="font-body text-sm italic opacity-90 leading-relaxed">
                "Based on your schedule, Thursday is a high-visibility day. Consider a bold accessory to break the neutral palette."
              </p>
            </Card>
          </div>

          {/* Schedule Detailed List */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-3xl font-headline font-bold flex items-center gap-3">
                <Clock className="h-8 w-8 text-accent" /> Agenda for {format(date, 'MMMM do')}
              </h3>
              <Badge variant="outline" className="rounded-full border-primary/20 text-primary px-4 py-1 font-headline">
                {activeSchedules.length} {activeSchedules.length === 1 ? 'Event' : 'Events'}
              </Badge>
            </div>

            {activeSchedules.length > 0 ? (
              <div className="grid gap-8">
                {activeSchedules.map(schedule => {
                  const outfit = MOCK_OUTFITS.find(o => o.id === schedule.outfitId);
                  if (!outfit) return null;
                  return (
                    <Card key={schedule.id} className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden group hover:shadow-primary/5 transition-all duration-500">
                      <div className="md:flex">
                        <div className="md:w-2/5 relative min-h-[300px] bg-slate-50 p-6 flex items-center justify-center">
                           <div className="grid grid-cols-2 gap-3 w-full">
                            {outfit.items.slice(0, 4).map((itemId, idx) => {
                              const item = MOCK_WARDROBE.find(i => i.id === itemId);
                              return (
                                <div key={itemId} className={cn(
                                  "relative aspect-square rounded-3xl overflow-hidden shadow-lg transition-transform hover:scale-105",
                                  idx === 0 ? "rotate-[-4deg]" : "rotate-[4deg]"
                                )}>
                                  {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="md:w-3/5 p-10 flex flex-col justify-between space-y-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <Badge className="bg-accent/10 text-accent border-none rounded-full px-4 py-1 uppercase tracking-tighter text-[10px] font-bold">
                                  {schedule.time} • {outfit.occasion}
                                </Badge>
                                <h4 className="text-4xl font-headline font-bold text-primary">{outfit.name}</h4>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 text-primary" onClick={() => handleEditClick(schedule)}>
                                  <Edit3 className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/5 text-destructive" onClick={() => handleUnschedule(schedule.id)}>
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 text-muted-foreground font-body">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary/40" /> {schedule.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-primary/40" /> Signature Collection
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4 border-t">
                            <Button variant="outline" className="flex-1 rounded-full font-headline h-14 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => handleViewItems(outfit.id)}>
                              View Garments
                            </Button>
                            <Button className="flex-1 rounded-full bg-slate-100 text-slate-600 hover:bg-destructive hover:text-white font-headline h-14 transition-all" onClick={() => handleUnschedule(schedule.id)}>
                              Unschedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                <button 
                  className="w-full py-12 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all group"
                  onClick={() => setIsSelectOutfitOpen(true)}
                >
                  <Plus className="h-12 w-12 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-headline font-bold text-xl">Plan Another Event</p>
                </button>
              </div>
            ) : (
              <div className="text-center py-24 bg-white/40 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-6">
                <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center">
                  <CalendarIcon className="h-10 w-10 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-headline font-bold text-slate-400">Empty Itinerary</p>
                  <p className="text-muted-foreground font-body italic">Your schedule is open. Perfect for an AI-suggested look.</p>
                </div>
                <Button className="rounded-full h-14 px-10 gradient-pill font-headline text-white border-glow shadow-xl" asChild>
                  <Link href="/ai-stylist">Generate Daily Look <Sparkles className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] border-none shadow-2xl p-10">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl font-bold text-center">Refine Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="font-headline text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Meeting Time</Label>
              <Input 
                id="time" 
                value={currentEditingEvent?.time || ''} 
                onChange={(e) => setCurrentEditingEvent({ ...currentEditingEvent, time: e.target.value })}
                placeholder="e.g. 09:00 AM"
                className="h-14 rounded-2xl bg-slate-50 border-none font-headline text-lg px-6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="font-headline text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Location / Context</Label>
              <Input 
                id="location" 
                value={currentEditingEvent?.location || ''} 
                onChange={(e) => setCurrentEditingEvent({ ...currentEditingEvent, location: e.target.value })}
                placeholder="e.g. Central Office"
                className="h-14 rounded-2xl bg-slate-50 border-none font-headline text-lg px-6"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3 sm:justify-center">
            <Button variant="outline" className="h-14 rounded-full font-headline px-8" onClick={() => setIsEditEventOpen(false)}>Cancel</Button>
            <Button className="h-14 rounded-full gradient-pill font-headline px-8 text-white shadow-lg" onClick={handleSaveEdit}>Save Edits</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Items Dialog */}
      <Dialog open={isViewItemsOpen} onOpenChange={setIsViewItemsOpen}>
        <DialogContent className="max-w-3xl bg-white rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="font-headline text-4xl font-bold text-primary">
                {currentViewingOutfit?.name}
              </DialogTitle>
              <p className="text-muted-foreground font-body italic">Assembled items for your upcoming event.</p>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {currentViewingOutfit?.items.map((itemId: string) => {
                const item = MOCK_WARDROBE.find(i => i.id === itemId);
                if (!item) return null;
                return (
                  <div key={itemId} className="space-y-3 group">
                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="px-2">
                      <p className="font-headline font-bold text-lg truncate group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full h-14 rounded-full gradient-pill font-headline text-white shadow-xl" onClick={() => setIsViewItemsOpen(false)}>
              Back to Agenda
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </AppLayout>
);
}
