'use client';

import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
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
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-foreground tracking-tight">Style Journal</h2>
            <p className="text-muted-foreground font-body text-sm font-bold uppercase tracking-widest opacity-60">
              {format(date, 'MMMM yyyy')}
            </p>
          </div>
          
          <Dialog open={isSelectOutfitOpen} onOpenChange={setIsSelectOutfitOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 font-headline text-white shadow-lg">
                <Plus className="mr-2 h-5 w-5" /> Plan New Look
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white rounded-[2rem] border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl font-bold text-center">Curate for {format(date, 'MMM do')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {MOCK_OUTFITS.map(outfit => (
                    <button 
                      key={outfit.id} 
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-primary transition-all text-left"
                      onClick={() => handleSchedule(outfit.id)}
                    >
                      <div className="flex -space-x-3">
                        {outfit.items.slice(0, 3).map((itemId, idx) => {
                          const item = MOCK_WARDROBE.find(i => i.id === itemId);
                          return (
                            <div key={idx} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden shadow-sm relative">
                              {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex-1">
                        <p className="font-headline font-bold text-base group-hover:text-primary">{outfit.name}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Pill-Shaped Week Selector */}
        <div className="bg-white rounded-[3rem] p-3 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex items-center gap-2">
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
                    "flex flex-col items-center justify-center p-3 min-w-[70px] rounded-[1.5rem] transition-all duration-300",
                    active 
                      ? "bg-primary text-white shadow-xl scale-110 -translate-y-1" 
                      : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <span className={cn("text-[9px] font-bold uppercase tracking-tight mb-1", active ? "text-white/70" : "text-slate-300")}>
                    {format(day, 'EEE')}
                  </span>
                  <span className="text-xl font-headline font-bold">
                    {format(day, 'dd')}
                  </span>
                </button>
              );
            })}
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-slate-400" onClick={() => setDate(addDays(date, 7))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1 hidden lg:block space-y-8">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className="w-full flex justify-center font-body"
              />
            </Card>
          </div>

          {/* Agenda List */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary/40" />
                <h3 className="text-2xl font-headline font-bold text-foreground">
                  Agenda for {format(date, 'MMMM do')}
                </h3>
              </div>
              <Badge variant="outline" className="rounded-full border-primary/20 text-primary px-3 py-0.5 font-headline">
                {activeSchedules.length} {activeSchedules.length === 1 ? 'Event' : 'Events'}
              </Badge>
            </div>

            {activeSchedules.length > 0 ? (
              <div className="grid gap-6">
                {activeSchedules.map(schedule => {
                  const outfit = MOCK_OUTFITS.find(o => o.id === schedule.outfitId);
                  if (!outfit) return null;
                  return (
                    <Card key={schedule.id} className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group border border-slate-50">
                      <div className="md:flex">
                        <div className="md:w-1/3 bg-slate-50/50 p-6 flex items-center justify-center">
                           <div className="flex -space-x-6">
                            {outfit.items.slice(0, 2).map((itemId, idx) => {
                              const item = MOCK_WARDROBE.find(i => i.id === itemId);
                              return (
                                <div key={itemId} className={cn(
                                  "relative h-32 w-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white",
                                  idx === 0 ? "rotate-[-5deg]" : "rotate-[5deg]"
                                )}>
                                  {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="md:w-2/3 p-8 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{schedule.time} • {schedule.location}</p>
                                <h4 className="text-3xl font-headline font-bold text-primary">{outfit.name}</h4>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary" onClick={() => handleEditClick(schedule)}>
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-destructive" onClick={() => handleUnschedule(schedule.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-6">
                            <Button variant="outline" className="flex-1 rounded-full font-headline border-slate-200 text-slate-600 hover:text-primary h-12" onClick={() => handleViewItems(outfit.id)}>
                              View Items
                            </Button>
                            <Button className="flex-1 rounded-full bg-slate-100 text-slate-400 hover:bg-destructive hover:text-white font-headline h-12 transition-all" onClick={() => handleUnschedule(schedule.id)}>
                              Unschedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                <button 
                  className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group"
                  onClick={() => setIsSelectOutfitOpen(true)}
                >
                  <Plus className="h-10 w-10 mb-2 group-hover:scale-110" />
                  <p className="font-headline font-bold text-lg">Plan Another Event</p>
                </button>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-50 flex flex-col items-center justify-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                  <CalendarIcon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-headline font-bold text-slate-300">Nothing planned yet</p>
                  <p className="text-slate-400 font-body text-sm italic">Get a suggestion from your stylist!</p>
                </div>
                <Button className="rounded-full h-12 px-8 bg-primary text-white font-headline" asChild>
                  <Link href="/ai-stylist">Check AI Stylist <Sparkles className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Items Dialog */}
      <Dialog open={isViewItemsOpen} onOpenChange={setIsViewItemsOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl font-bold text-primary">
              {currentViewingOutfit?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6">
            {currentViewingOutfit?.items.map((itemId: string) => {
              const item = MOCK_WARDROBE.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <div key={itemId} className="space-y-2 text-center">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <p className="font-headline font-bold text-sm truncate">{item.name}</p>
                </div>
              );
            })}
          </div>
          <Button className="w-full h-12 rounded-full bg-primary text-white font-headline" onClick={() => setIsViewItemsOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
