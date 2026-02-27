
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MOCK_OUTFITS, MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";

export default function PlannerPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter outfits for "today" (simulated)
  const todayOutfit = MOCK_OUTFITS[0];

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground">Outfit Planner</h2>
            <p className="text-muted-foreground font-body">Schedule your style and prepare for upcoming events.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 font-headline">
            <Plus className="mr-2 h-4 w-4" /> Schedule Outfit
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full flex justify-center p-4 font-body"
              />
            </Card>

            <Card className="border-none shadow-lg bg-primary text-white">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Planning Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-sm italic opacity-90 leading-relaxed">
                  "Planning your week on Sunday saves you 20 minutes every morning. Aim for versatile pieces that can layer if the weather shifts."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Detail Section */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-headline font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 text-accent" /> Schedule for {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>

            {todayOutfit ? (
              <div className="space-y-6">
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-muted p-4 grid grid-cols-2 gap-2">
                      {todayOutfit.items.slice(0, 4).map(itemId => {
                        const item = MOCK_WARDROBE.find(i => i.id === itemId);
                        return (
                          <div key={itemId} className="relative aspect-square rounded overflow-hidden shadow-sm">
                            {item && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                          </div>
                        )
                      })}
                    </div>
                    <div className="md:w-2/3 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="bg-accent mb-2 uppercase tracking-widest text-[10px] font-headline">Morning / Work</Badge>
                          <h4 className="text-2xl font-headline font-bold">{todayOutfit.name}</h4>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <Plus className="h-5 w-5 rotate-45" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-muted-foreground font-body">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> 09:00 AM
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> Office
                        </div>
                      </div>

                      <p className="font-body italic text-muted-foreground leading-relaxed">
                        A polished yet comfortable combination featuring your Everlane linen shirt and classic Dr. Martens.
                      </p>

                      <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="flex-1 font-headline border-primary text-primary hover:bg-primary/5">Edit Details</Button>
                        <Button className="flex-1 font-headline bg-primary hover:bg-primary/90">View All Items</Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Second potential event */}
                <Card className="border-none shadow-md bg-white/60 border-2 border-dashed flex flex-col items-center justify-center p-8 text-muted-foreground group cursor-pointer hover:bg-white hover:border-accent/40 transition-all">
                  <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-headline font-bold">Add Evening Event</p>
                </Card>
              </div>
            ) : (
              <div className="text-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-border">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-xl font-headline font-bold text-muted-foreground">No events planned</p>
                <p className="text-muted-foreground font-body">Your calendar is open. Perfect time to get an AI suggestion!</p>
                <Button variant="outline" className="mt-6 font-headline border-accent text-accent hover:bg-accent/5">
                  Check AI Stylist
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
