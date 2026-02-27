"use client";

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  Shirt,
  Sparkles,
  Layers,
  Calendar,
  CloudSun,
  Scissors,
  TrendingUp,
  UserCheck,
  Zap,
  Presentation,
  ShieldCheck,
  Database,
  Code2
} from "lucide-react";

export default function ProposalPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Presentation className="h-12 w-12 text-primary animate-bounce" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-foreground">Project Presentation</h1>
          <p className="text-muted-foreground font-body text-lg italic uppercase tracking-widest">AI-Powered Smart Wardrobe & Outfit Planner</p>
        </header>

        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-white shadow-sm border border-border p-1 rounded-xl">
            <TabsTrigger value="intro" className="py-3 font-headline data-[state=active]:bg-primary data-[state=active]:text-white">1. Introduction</TabsTrigger>
            <TabsTrigger value="problems" className="py-3 font-headline data-[state=active]:bg-primary data-[state=active]:text-white">2. Problem Statement</TabsTrigger>
            <TabsTrigger value="solution" className="py-3 font-headline data-[state=active]:bg-primary data-[state=active]:text-white">3. Proposed Solution</TabsTrigger>
            <TabsTrigger value="tech" className="py-3 font-headline data-[state=active]:bg-primary data-[state=active]:text-white">4. Technologies</TabsTrigger>
            <TabsTrigger value="tailors" className="py-3 font-headline data-[state=active]:bg-primary data-[state=active]:text-white">5. Tailor Utility</TabsTrigger>
          </TabsList>

          {/* PAGE 1 - INTRODUCTION */}
          <TabsContent value="intro">
            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-secondary/20 overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardHeader className="text-center py-12">
                <Badge className="w-fit mx-auto bg-accent mb-4 text-primary">The Future of Fashion</Badge>
                <CardTitle className="text-5xl font-headline font-bold text-foreground mb-4">StyleVault: Style Meets Intelligence</CardTitle>
                <CardDescription className="text-xl font-body max-w-3xl mx-auto leading-relaxed">
                  In an era where technology touches every facet of our lives, the way we manage our personal style remains largely manual. 
                  StyleVault bridges this gap by acting as a <strong>Personal Digital Stylist</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 px-12">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-headline font-bold text-lg">Digital Transformation</h4>
                  <p className="text-sm font-body text-muted-foreground">Converting physical inventory into a searchable, actionable digital database.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="font-headline font-bold text-lg">AI Integration</h4>
                  <p className="text-sm font-body text-muted-foreground">Leveraging Generative AI to eliminate the daily "what to wear" mental burden.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-headline font-bold text-lg">Smart Decision Making</h4>
                  <p className="text-sm font-body text-muted-foreground">Sophisticated algorithms that factor in weather, occasion, and user preference.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAGE 2 - PROBLEMS */}
          <TabsContent value="problems">
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <div className="h-2 bg-destructive w-full" />
              <CardHeader>
                <CardTitle className="text-3xl font-headline font-bold flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  The Wardrobe Crisis: Current Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                {[
                  { title: "Digital Amnesia", desc: "Forgetting owned items leading to redundant purchases and unworn clothes.", icon: Lightbulb },
                  { title: "Decision Fatigue", desc: "Wasting 15-20 minutes daily choosing outfits due to lack of visual overview.", icon: Zap },
                  { title: "Repetitive Usage", desc: "Wearing the same 20% of the wardrobe 80% of the time, ignoring hidden gems.", icon: TrendingUp },
                  { title: "Styling Knowledge Gap", desc: "Difficulty in matching colors, fabrics, and styles effectively for specific events.", icon: Shirt },
                  { title: "Lack of Planning", desc: "Poor preparation for upcoming trips or formal occasions resulting in stress.", icon: Calendar },
                  { title: "Weather Mismatch", desc: "Inappropriate choices for temperature shifts or unexpected rain.", icon: CloudSun },
                ].map((p, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl border border-destructive/10 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                    <p.icon className="h-6 w-6 text-destructive shrink-0" />
                    <div>
                      <h5 className="font-headline font-bold text-lg">{p.title}</h5>
                      <p className="text-sm font-body text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAGE 3 - PROPOSED SOLUTION */}
          <TabsContent value="solution">
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardHeader>
                <CardTitle className="text-3xl font-headline font-bold flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  StyleVault Ecosystem: The Smart Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                      <Shirt className="h-6 w-6 text-accent mb-2" />
                      <CardTitle className="text-lg font-headline">Wardrobe Catalog</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm font-body text-muted-foreground">
                      Upload photos to create a <strong>Digital Vault</strong>. AI-assisted tagging of brand, fabric, season, and occasion for effortless browsing.
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                      <Layers className="h-6 w-6 text-accent mb-2" />
                      <CardTitle className="text-lg font-headline">Outfit Assembler</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm font-body text-muted-foreground">
                      A visual workspace to <strong>mix and match</strong> items without the physical mess. Experiment with layers and accessories instantly.
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                      <Sparkles className="h-6 w-6 text-accent mb-2" />
                      <CardTitle className="text-lg font-headline">AI Recommender</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm font-body text-muted-foreground">
                      Generative AI suggestions tailored to <strong>user preference</strong> and history. Professional-grade styling at your fingertips.
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                      <Calendar className="h-6 w-6 text-accent mb-2" />
                      <CardTitle className="text-lg font-headline">Outfit Planner</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm font-body text-muted-foreground">
                      Calendar-based <strong>scheduling tool</strong>. Plan your entire week's looks in advance for ultimate morning productivity.
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm md:col-span-2 lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CloudSun className="h-6 w-6 text-accent mb-2" />
                      <CardTitle className="text-lg font-headline">Weather-Aware Intelligence</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm font-body text-muted-foreground">
                      Integration with <strong>Real-time Weather APIs</strong>. Recommends breathable linen for heatwaves and thermal layering for cold fronts, ensuring total comfort.
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAGE 4 - TECH STACK */}
          <TabsContent value="tech">
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <div className="h-2 bg-accent w-full" />
              <CardHeader>
                <CardTitle className="text-3xl font-headline font-bold flex items-center gap-3">
                  <Cpu className="h-8 w-8 text-accent" />
                  Technical Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-headline font-bold text-xl flex items-center gap-2 border-b pb-2">
                      <Code2 className="h-5 w-5 text-primary" /> Frontend & Backend
                    </h4>
                    <ul className="space-y-3 font-body">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">UI</Badge>
                        <span><strong>Next.js 15 (App Router)</strong> with React 19 for seamless, high-performance interactions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">Style</Badge>
                        <span><strong>Tailwind CSS & ShadCN UI</strong> for a modern, responsive design system.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">Cloud</Badge>
                        <span><strong>Firebase</strong> (Auth, Firestore, Storage) for real-time data and secure image hosting.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-headline font-bold text-xl flex items-center gap-2 border-b pb-2">
                      <Sparkles className="h-5 w-5 text-primary" /> AI & External APIs
                    </h4>
                    <ul className="space-y-3 font-body">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">Core AI</Badge>
                        <span><strong>Google Gemini 2.5 Flash</strong> via <strong>Genkit</strong> for complex outfit generation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">Vision</Badge>
                        <span><strong>Computer Vision</strong> models for automatic garment recognition and attribute tagging.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">Data</Badge>
                        <span><strong>OpenWeather API</strong> for real-time meteorological data integration.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAGE 5 - TAILORS */}
          <TabsContent value="tailors">
            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-primary/5 overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardHeader>
                <CardTitle className="text-3xl font-headline font-bold flex items-center gap-3">
                  <Scissors className="h-8 w-8 text-primary" />
                  Empowering Professionals: Why Tailors Should Use It
                </CardTitle>
                <CardDescription className="text-lg font-body italic">
                  Upgrading traditional craftsmanship with smart fashion consulting.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-headline font-bold text-lg">Digital Client Archives</h5>
                      <p className="text-sm font-body text-muted-foreground">Maintain a comprehensive digital record of every customer's wardrobe, making it easier to suggest matching alterations or new custom pieces.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-headline font-bold text-lg">Smart Fabric Recommendations</h5>
                      <p className="text-sm font-body text-muted-foreground">Suggest fabrics and weights based on the customer's location and seasonal needs using integrated weather data.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h5 className="font-headline font-bold text-lg">Trend Awareness</h5>
                      <p className="text-sm font-body text-muted-foreground">Analyze wardrobe gaps across multiple users to identify emerging trends, helping tailors prep appropriate stock and designs.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h5 className="font-headline font-bold text-lg">Modern Consulting Experience</h5>
                      <p className="text-sm font-body text-muted-foreground">Elevate customer service from "stitching" to "styling," increasing customer loyalty and premium service positioning.</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-primary text-white p-6 rounded-2xl flex items-center justify-between gap-6 shadow-lg">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-headline font-bold italic">"Innovation is the ultimate tool for traditional craft."</h4>
                    <p className="font-body opacity-90">StyleVault helps tailors evolve into high-tech fashion advisors.</p>
                  </div>
                  <Scissors className="h-20 w-20 opacity-20 hidden lg:block" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
