
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CloudSun, Calendar as CalendarIcon, ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { MOCK_WARDROBE } from "@/lib/mock-data";
import Image from "next/image";

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold text-foreground">Welcome back, Fashionista</h2>
            <p className="text-muted-foreground font-body text-lg italic">"Style is a way to say who you are without having to speak."</p>
          </div>
          <Link href="/proposal">
            <Button variant="ghost" className="font-headline text-accent flex items-center gap-2 hover:bg-accent/10">
              <Lightbulb className="h-4 w-4" /> View Project Vision
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats Card */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Your Closet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-4xl font-bold">{MOCK_WARDROBE.length}</p>
                  <p className="text-primary-foreground/80 font-headline text-sm uppercase tracking-wider">Total Items</p>
                </div>
                <Link href="/wardrobe">
                  <Button variant="secondary" size="sm" className="font-headline bg-white/20 hover:bg-white/30 border-none text-white">
                    View Catalog <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Today's Weather / Suggestion */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-headline">Today's Styling</CardTitle>
              <CloudSun className="text-accent h-6 w-6" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold">72°F & Sunny</p>
                <p className="text-sm text-muted-foreground font-body italic">Perfect weather for light layers.</p>
              </div>
              <Link href="/ai-stylist">
                <Button variant="outline" className="w-full font-headline border-primary text-primary hover:bg-primary/5">
                  Get Suggestion
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Event */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-headline">Planned Outfits</CardTitle>
              <CalendarIcon className="text-accent h-6 w-6" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xl font-bold">Gala Dinner</p>
                <p className="text-sm text-muted-foreground font-body">Friday, March 29</p>
              </div>
              <Link href="/planner">
                <Button className="w-full font-headline bg-accent hover:bg-accent/90">
                  Open Planner
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Wardrobe Items */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-headline font-bold">Recently Added</h3>
            <Link href="/wardrobe" className="text-primary font-headline flex items-center hover:underline">
              See all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {MOCK_WARDROBE.slice(0, 5).map((item) => (
              <Card key={item.id} className="overflow-hidden group border-none shadow-md hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[3/4]">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="font-headline font-semibold truncate text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground capitalize font-body">{item.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
