
"use client";

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  CloudSun, 
  Smartphone, 
  Database, 
  Sparkles,
  Layers,
  Shirt
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProposalPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12 pb-12">
        {/* Section 1: Introduction */}
        <section className="text-center space-y-4">
          <Badge variant="outline" className="border-primary text-primary px-4 py-1 font-headline uppercase tracking-widest">
            Project Overview
          </Badge>
          <h1 className="text-5xl font-headline font-bold text-foreground">ClosetMind</h1>
          <p className="text-2xl font-body italic text-muted-foreground">"Your AI-Powered Personal Stylist & Digital Wardrobe"</p>
          <div className="pt-6 max-w-2xl mx-auto">
            <p className="text-lg font-body leading-relaxed text-foreground/80">
              In today's fast-paced world, deciding what to wear is a daily mental hurdle. 
              ClosetMind leverages cutting-edge Generative AI to transform your messy physical closet 
              into a streamlined digital catalog, making high-fashion styling accessible, 
              weather-responsive, and effortlessly organized.
            </p>
          </div>
        </section>

        {/* Section 2: Problem Statement */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h2 className="text-3xl font-headline font-bold">Problem Statement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Digital Amnesia", desc: "Difficulty remembering all clothing items owned, leading to unworn pieces." },
              { title: "Decision Fatigue", desc: "Significant time wasted every morning choosing the 'perfect' outfit." },
              { title: "Styling Gaps", desc: "Lack of styling knowledge resulting in poor or repetitive combinations." },
              { title: "Weather Mismatch", desc: "Outfit choices that don't align with current or forecast conditions." },
              { title: "Poor Planning", desc: "Inability to visualize and schedule outfits for upcoming events." },
              { title: "The 'Nothing to Wear' Paradox", desc: "Feeling limited despite having a full wardrobe." },
            ].map((item, idx) => (
              <Card key={idx} className="bg-destructive/5 border-none shadow-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <span className="text-destructive font-bold">0{idx + 1}.</span> {item.title}
                  </CardTitle>
                  <CardDescription className="font-body text-sm">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 3: Proposed Solution */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-2">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-headline font-bold">Proposed Solution</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="catalog">
              <AccordionTrigger className="text-xl font-headline">
                <div className="flex items-center gap-3">
                  <Shirt className="h-5 w-5 text-accent" /> Wardrobe Catalog
                </div>
              </AccordionTrigger>
              <AccordionContent className="font-body text-lg leading-relaxed text-muted-foreground">
                A personalized digital vault where users upload photos. AI automatically tags items with 
                color, brand, fabric, and occasion, forming a rich, searchable inventory.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="assembler">
              <AccordionTrigger className="text-xl font-headline">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-accent" /> Outfit Assembler
                </div>
              </AccordionTrigger>
              <AccordionContent className="font-body text-lg leading-relaxed text-muted-foreground">
                A visual workspace for creative experimentation. Drag and drop items from your catalog 
                to see how they pair before you even touch your clothes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ai">
              <AccordionTrigger className="text-xl font-headline">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-accent" /> AI Outfit Recommender
                </div>
              </AccordionTrigger>
              <AccordionContent className="font-body text-lg leading-relaxed text-muted-foreground">
                Our Generative AI engine analyzes your entire wardrobe to suggest complete looks based on 
                your specific vibe, the occasion, and your styling history.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="planner">
              <AccordionTrigger className="text-xl font-headline">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent" /> Outfit Planner
                </div>
              </AccordionTrigger>
              <AccordionContent className="font-body text-lg leading-relaxed text-muted-foreground">
                A calendar-integrated scheduling tool. Map out your week's looks in advance, ensuring 
                you never repeat an outfit twice in a row (unless you want to!).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="weather">
              <AccordionTrigger className="text-xl font-headline">
                <div className="flex items-center gap-3">
                  <CloudSun className="h-5 w-5 text-accent" /> Weather-Aware Suggestions
                </div>
              </AccordionTrigger>
              <AccordionContent className="font-body text-lg leading-relaxed text-muted-foreground">
                Real-time integration with weather APIs ensures the AI suggests layering for cold mornings 
                or breathable fabrics for hot afternoons.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section 4: Techniques and Technologies */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-2">
            <Cpu className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-headline font-bold">Techniques & Technologies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <Smartphone className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-headline">Frontend</CardTitle>
              </CardHeader>
              <CardContent className="font-body text-sm space-y-2">
                <p>• Next.js 15 (App Router)</p>
                <p>• React 19 & TypeScript</p>
                <p>• Tailwind CSS & ShadCN UI</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <Database className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-headline">Backend & Data</CardTitle>
              </CardHeader>
              <CardContent className="font-body text-sm space-y-2">
                <p>• Firebase Firestore (Storage)</p>
                <p>• Firebase Auth (Security)</p>
                <p>• Google Cloud Platform</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-headline">AI Core</CardTitle>
              </CardHeader>
              <CardContent className="font-body text-sm space-y-2">
                <p>• Genkit (GenAI Orchestration)</p>
                <p>• Google Gemini 2.5 Flash</p>
                <p>• Vision-based Tagging</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Closing */}
        <Card className="bg-primary text-white border-none shadow-2xl p-8 text-center">
          <h3 className="text-3xl font-headline font-bold mb-4">Ready to Revolutionize Your Closet?</h3>
          <p className="font-body text-lg mb-6 opacity-90">
            ClosetMind isn't just an app; it's a productivity tool for the fashion-forward. 
            By bridging the gap between your physical inventory and AI intelligence, we unlock 
            the true potential of your personal style.
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-white text-primary hover:bg-white font-headline px-6 py-2">v1.0.0 Stable</Badge>
            <Badge className="bg-accent text-white font-headline px-6 py-2">Open for Beta</Badge>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
