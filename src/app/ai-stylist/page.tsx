
"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  Heart,
  Music,
  Dumbbell,
  Plane,
  Umbrella,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Plus,
  ChevronRight,
  Info,
  RefreshCw,
  Trophy,
  Trees,
  Sun,
  Presentation,
  Type,
  Layers,
  Bookmark,
  CheckCircle2,
  Send,
  MessageCircle,
  Share2,
  Clock,
  X,
  Upload
} from "lucide-react";
import { aiOutfitSuggester } from "@/ai/flows/ai-outfit-suggester";
import { generateCapsule, type CapsuleOutput } from "@/ai/flows/capsule-generator";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_WARDROBE, MOCK_OUTFITS } from "@/lib/mock-data";

const occasions = [
  { label: "Work", icon: Briefcase, value: "work" },
  { label: "Casual", icon: Users, value: "casual" },
  { label: "Formal", icon: Sparkles, value: "formal" },
  { label: "Date Night", icon: Heart, value: "night out" },
  { label: "Party", icon: Music, value: "party" },
  { label: "Sporty", icon: Dumbbell, value: "sporty" },
  { label: "Travel", icon: Plane, value: "travel" },
  { label: "Beach", icon: Umbrella, value: "beach" },
  { label: "Gala", icon: Trophy, value: "gala" },
  { label: "Outdoor", icon: Trees, value: "outdoor" },
  { label: "Holiday", icon: Sun, value: "holiday" },
  { label: "Meeting", icon: Presentation, value: "meeting" },
];

export default function AiStylistPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="h-full flex items-center justify-center p-20">
          <RefreshCw className="h-10 w-10 animate-spin text-primary/20" />
        </div>
      </AppLayout>
    }>
      <AiStylistContent />
    </Suspense>
  );
}

function AiStylistContent() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  const initialTab = searchParams.get('tab') || 'stylist';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [customOccasion, setCustomOccasion] = useState("");
  const [suggestion, setSuggestion] = useState<{
    items: any[];
    reasoning: string;
    shoppingAdvised: boolean;
  } | null>(null);
  
  // Capsule State
  const [capsuleLoading, setCapsuleLoading] = useState(false);
  const [capsule, setCapsule] = useState<CapsuleOutput | null>(null);

  // Firestore Data
  const { data: wardrobeItemsRaw, loading: firestoreLoading } = useCollection(db ? query(collection(db, 'wardrobe')) : null);
  const { data: savedOutfitsRaw } = useCollection(db ? query(collection(db, 'outfits')) : null);
  
  // Logic: Use Firestore items if they exist, otherwise fallback to MOCK data for a better UX
  const wardrobeItems = useMemo(() => {
    const items = wardrobeItemsRaw || [];
    return items.length > 0 ? items : MOCK_WARDROBE;
  }, [wardrobeItemsRaw]);

  const savedOutfits = useMemo(() => {
    const outfits = savedOutfitsRaw || [];
    return outfits.length > 0 ? outfits : MOCK_OUTFITS;
  }, [savedOutfitsRaw]);

  // Feed State
  const [postCaption, setPostCaption] = useState("");
  const [selectedOutfitForPost, setSelectedOutfitForPost] = useState<any | null>(null);
  const [customUploadedImage, setCustomUploadedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mockFeed, setMockFeed] = useState([
    {
      id: 'f1',
      userName: "Alex Rivers",
      userAvatar: "https://picsum.photos/seed/user1/100",
      caption: "Channeling minimalist energy for the weekend. The linen blend is everything.",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1080",
      likes: 24,
      comments: 3,
      time: '2h ago'
    },
    {
      id: 'f2',
      userName: "Sasha Blue",
      userAvatar: "https://picsum.photos/seed/user2/100",
      caption: "Finally digitized the vintage vault! This silk scarf ensemble is a mood.",
      image: "https://images.unsplash.com/photo-1677478863154-55ecce8c7536?q=80&w=1080",
      likes: 42,
      comments: 8,
      time: '5h ago'
    }
  ]);

  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = async () => {
    const finalOccasion = customOccasion.trim() || selectedOccasion;
    
    if (!finalOccasion) {
      toast({ title: "Selection Required", description: "Please select an occasion or enter a custom one." });
      return;
    }

    if (wardrobeItems.length === 0) {
      toast({ title: "Empty Vault", description: "Please add some items to your closet first." });
      return;
    }

    setLoading(true);
    try {
      const result = await aiOutfitSuggester({
        occasion: finalOccasion,
        wardrobeItems: wardrobeItems.map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          color: i.color,
          description: i.description || "A versatile garment from the collection."
        }))
      });

      const suggestedItems = result.suggestedOutfit.map(id => wardrobeItems.find(i => i.id === id)).filter(Boolean);
      
      setSuggestion({
        items: suggestedItems,
        reasoning: result.stylistNote,
        shoppingAdvised: result.shoppingAdvised
      });
      toast({ title: "Outfit ready!", description: `Styling for "${finalOccasion}" complete.` });
    } catch (err) {
      console.error("Styling error:", err);
      toast({ title: "Failed to generate suggestion", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCapsule = async () => {
    if (wardrobeItems.length < 10) {
      toast({ title: "Insufficient Items", description: "You need at least 10 items in your vault to generate a capsule." });
      return;
    }

    setCapsuleLoading(true);
    try {
      const result = await generateCapsule({
        wardrobeItems: wardrobeItems.map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          color: i.color
        }))
      });
      setCapsule(result);
      toast({ title: "Capsule Generated", description: "10 core pieces and 20 outfits identified." });
    } catch (err) {
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setCapsuleLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomUploadedImage(reader.result as string);
        setSelectedOutfitForPost(null);
        toast({ title: "Image Loaded", description: "Ready to share with the vault community." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!selectedOutfitForPost && !customUploadedImage) {
      toast({ title: "Select Content", description: "Choose a signature look or upload a photo to share." });
      return;
    }

    setIsPosting(true);
    // Simulate API delay
    setTimeout(() => {
      let imageUrl = "https://picsum.photos/seed/post/800";
      if (customUploadedImage) {
        imageUrl = customUploadedImage;
      } else if (selectedOutfitForPost) {
        const firstItemId = selectedOutfitForPost.items[0];
        const firstItem = wardrobeItems.find(i => i.id === firstItemId);
        imageUrl = firstItem?.imageUrl || imageUrl;
      }

      const newPost = {
        id: Math.random().toString(36).substr(2, 9),
        userName: "You",
        userAvatar: "https://picsum.photos/seed/you/100",
        caption: postCaption || (selectedOutfitForPost ? `Featured Look: ${selectedOutfitForPost.name}` : "My latest style assembly."),
        image: imageUrl,
        likes: 0,
        comments: 0,
        time: 'Just now'
      };

      setMockFeed([newPost, ...mockFeed]);
      setSelectedOutfitForPost(null);
      setCustomUploadedImage(null);
      setPostCaption("");
      setIsPosting(false);
      toast({ title: "Post Published!", description: "Your style is now live in the global feed." });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-headline font-bold text-foreground tracking-tighter">Style Lab</h2>
            <p className="text-muted-foreground font-body">Combine AI insights with community feedback.</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-300 hover:text-primary transition-colors">
                <Info className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-white border-none rounded-xl p-4 max-w-[250px]">
              <p className="text-xs font-body leading-relaxed">
                The Style Lab is where our AI designs outfits based on your actual wardrobe. Use <strong>AI Stylist</strong> for quick looks, <strong>Capsule</strong> for a minimalist core, or <strong>Style Feed</strong> to share your vibe.
              </p>
            </TooltipContent>
          </Tooltip>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-white shadow-sm border p-1.5 rounded-2xl mb-8 max-w-2xl mx-auto">
            <TabsTrigger value="stylist" className="py-3 font-headline text-sm md:text-lg rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              AI Stylist
            </TabsTrigger>
            <TabsTrigger value="capsule" className="py-3 font-headline text-sm md:text-lg rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              Capsule
            </TabsTrigger>
            <TabsTrigger value="feed" className="py-3 font-headline text-sm md:text-lg rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              Style Feed
            </TabsTrigger>
          </TabsList>

          {/* AI STYLIST CONTENT */}
          <TabsContent value="stylist" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <Card className="border-none shadow-lg bg-white rounded-[2rem]">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">The Occasion</CardTitle>
                    <CardDescription className="font-body italic">Select or describe where you're heading.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      {occasions.map((occ) => {
                        const Icon = occ.icon;
                        return (
                          <Button
                            key={occ.value}
                            variant={selectedOccasion === occ.value && !customOccasion ? "default" : "outline"}
                            className={cn(
                              "h-24 flex flex-col gap-2 font-headline rounded-2xl border-slate-100 transition-all active:scale-95",
                              selectedOccasion === occ.value && !customOccasion ? "bg-accent border-accent text-primary" : "bg-white text-slate-400 hover:text-primary hover:bg-slate-50"
                            )}
                            onClick={() => {
                              setSelectedOccasion(occ.value);
                              setCustomOccasion("");
                            }}
                          >
                            <Icon className="h-6 w-6" />
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-center px-1">{occ.label}</span>
                          </Button>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Describe Your Own</label>
                      <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <Input 
                          placeholder="e.g. 1920s Speakeasy Night" 
                          value={customOccasion}
                          onChange={(e) => {
                            setCustomOccasion(e.target.value);
                            if (e.target.value) setSelectedOccasion("");
                          }}
                          className="h-12 rounded-xl pl-11 bg-slate-50 border-none shadow-inner font-body"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full h-16 text-xl font-headline bg-primary hover:bg-primary/90 shadow-xl rounded-full active:scale-[0.98] transition-all"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <><RefreshCw className="mr-2 h-6 w-6 animate-spin" /> Consulting Stylist...</>
                  ) : (
                    <><Sparkles className="mr-2 h-6 w-6" /> Generate My Outfit</>
                  )}
                </Button>
              </div>

              <div className="lg:col-span-2">
                {!suggestion && !loading ? (
                  <div className="h-full flex flex-col items-center justify-center bg-white/40 border-4 border-dashed rounded-[3rem] p-10 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary/30" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-headline font-bold text-slate-800">Ready for a new look?</h3>
                      <p className="text-muted-foreground font-body max-w-sm mx-auto">Select an occasion on the left or describe a custom event and let our AI browse your digital wardrobe.</p>
                    </div>
                  </div>
                ) : suggestion ? (
                  <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3.5rem]">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b p-10">
                      <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-3xl font-bold italic text-primary">Curated Assembly</CardTitle>
                        <Badge variant="outline" className="border-accent text-primary font-headline uppercase px-6 py-1 tracking-widest bg-white/50 backdrop-blur-sm">
                          {customOccasion || selectedOccasion}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                      {suggestion.shoppingAdvised && (
                        <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-inner">
                          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <ShoppingBag className="h-10 w-10 text-primary" />
                          </div>
                          <div className="flex-1 space-y-3 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                              <AlertTriangle className="h-5 w-5 text-primary" />
                              <h4 className="font-headline font-bold text-primary text-2xl italic">Wardrobe Gap Detected</h4>
                            </div>
                            <p className="text-lg font-body text-slate-600 leading-relaxed italic">
                              "Our analysis indicates a high-value piece is missing to perfectly coordinate this look. Explore optimized additions."
                            </p>
                            <Button className="rounded-full h-12 px-8 gradient-primary text-white font-headline" asChild>
                              <Link href="/shopping">Consult Shopping Engine <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {suggestion.items.map((item: any) => (
                          <div key={item.id} className="space-y-3 group">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white transition-transform group-hover:scale-105 active:scale-95">
                              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            </div>
                            <p className="text-xs font-headline font-bold text-center truncate px-2 text-primary opacity-60 uppercase tracking-widest">{item.name}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-secondary/20 p-8 rounded-[2rem] border border-primary/5">
                        <p className="font-body text-foreground leading-relaxed italic text-xl">
                          "{suggestion.reasoning}"
                        </p>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button 
                          variant="outline"
                          className="flex-1 h-14 rounded-full font-headline text-lg border-primary text-primary hover:bg-primary/5 active:scale-95 transition-all"
                          onClick={handleGenerate}
                          disabled={loading}
                        >
                          <RefreshCw className={cn("mr-2 h-5 w-5", loading && "animate-spin")} />
                          Regenerate
                        </Button>
                        <Button className="flex-1 h-14 rounded-full font-headline text-lg bg-primary shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
                          <Link href="/wardrobe?tab=studio&sub=journal">Schedule this Look</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-10 bg-white rounded-[3rem] shadow-inner space-y-6">
                    <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-headline font-bold text-primary italic">Stylist your collection...</h3>
                      <p className="text-muted-foreground font-body italic">Aggregating visual harmony data</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* CAPSULE CONTENT */}
          <TabsContent value="capsule" className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary font-headline uppercase px-4 py-1 border-none tracking-[0.2em]">
                  Minimalist Logic
                </Badge>
                <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary italic leading-none">
                  Capsule <span className="text-accent">Generator.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-body italic max-w-xl border-l-4 border-accent pl-6">
                  "Condensing your collection into its most potent 10-piece core for maximum utility."
                </p>
              </div>
              <Button 
                className="h-16 px-10 rounded-full gradient-primary text-white font-headline text-xl shadow-xl active:scale-95 transition-all"
                onClick={handleGenerateCapsule}
                disabled={capsuleLoading}
              >
                {capsuleLoading ? <RefreshCw className="mr-2 h-6 w-6 animate-spin" /> : <Sparkles className="mr-2 h-6 w-6" />}
                {capsule ? "Regenerate Capsule" : "Generate Capsule"}
              </Button>
            </header>

            {!capsule && !capsuleLoading ? (
              <div className="py-24 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-primary/10">
                <Layers className="h-16 w-16 text-primary/20 mx-auto mb-6" />
                <h3 className="text-2xl font-headline font-bold text-slate-400 italic">Ready to distill your style?</h3>
                <p className="text-muted-foreground font-body mt-2">Generate a minimalist core to eliminate daily decision fatigue.</p>
              </div>
            ) : capsule ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="font-headline text-3xl font-bold text-primary italic">The Core 10</CardTitle>
                          <CardDescription className="font-body italic mt-1">Versatile essentials selected for multi-season harmony.</CardDescription>
                        </div>
                        <Badge className="bg-accent text-primary font-headline px-6 py-2 uppercase tracking-widest border-none">Optimal Selection</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-10">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                        {capsule.selectedIds.map(id => {
                          const item = wardrobeItems.find(i => i.id === id);
                          return item ? (
                            <div key={id} className="space-y-2 group">
                              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                              </div>
                              <p className="text-[10px] font-headline font-bold text-center text-primary/60 uppercase truncate">{item.name}</p>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl bg-primary text-white rounded-[3rem] p-10">
                    <div className="flex gap-6 items-start">
                      <Sparkles className="h-10 w-10 text-accent shrink-0" />
                      <div className="space-y-4">
                        <h4 className="font-headline font-bold text-2xl italic">Stylist's Logic</h4>
                        <p className="text-xl font-body italic leading-relaxed opacity-90">"{capsule.stylistNote}"</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <h3 className="font-headline font-bold text-xl text-primary px-4 flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-accent" /> Generated Assemblies (20)
                  </h3>
                  <ScrollArea className="h-[700px] pr-4">
                    <div className="grid gap-4">
                      {capsule.outfits.map((outfit, idx) => (
                        <Card key={idx} className="border-none shadow-md bg-white rounded-[2rem] p-6 hover:shadow-lg transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                              {outfit.itemIds.slice(0, 3).map(id => (
                                <div key={id} className="h-12 w-12 rounded-full border-2 border-white overflow-hidden shadow-sm relative">
                                  <Image 
                                    src={wardrobeItems.find(i => i.id === id)?.imageUrl || "https://picsum.photos/seed/1/400"} 
                                    alt="" fill className="object-cover rounded-full" 
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-headline font-bold text-primary group-hover:text-accent transition-colors truncate">{outfit.name}</h4>
                              <p className="text-[10px] font-body uppercase tracking-widest text-slate-400">{outfit.itemIds.length} Pieces</p>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-slate-100 group-hover:text-accent transition-colors" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center space-y-6">
                <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <h3 className="text-2xl font-headline font-bold text-primary italic">Distilling your wardrobe...</h3>
              </div>
            )}
          </TabsContent>

          {/* STYLE FEED CONTENT */}
          <TabsContent value="feed" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-3xl font-headline font-bold text-primary italic">Community Highlights</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-400 font-headline uppercase tracking-widest text-[10px]">Live Inspiration</Badge>
                </div>
                
                <div className="grid gap-8">
                  {mockFeed.map(post => (
                    <Card key={post.id} className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden group">
                      <div className="p-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full overflow-hidden relative border-2 border-slate-50">
                            <Image src={post.userAvatar} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-headline font-bold text-primary leading-none">{post.userName}</h4>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Verified Curator</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{post.time}</span>
                        </div>
                      </div>
                      
                      <div className="relative aspect-video mx-8 rounded-[2rem] overflow-hidden shadow-xl">
                        <Image src={post.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                      </div>

                      <CardContent className="p-10 space-y-6">
                        <p className="text-xl font-body italic text-slate-600 leading-relaxed">
                          "{post.caption}"
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-accent transition-colors">
                              <Heart className="h-5 w-5" />
                              <span className="text-xs font-bold font-headline">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                              <MessageCircle className="h-5 w-5" />
                              <span className="text-xs font-bold font-headline">{post.comments}</span>
                            </button>
                          </div>
                          <button className="text-slate-300 hover:text-primary transition-colors">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <Card className="border-none shadow-xl bg-white p-10 space-y-8 rounded-[3rem] sticky top-32">
                  <div className="space-y-2">
                    <h3 className="font-headline font-bold text-2xl text-primary italic leading-none">Share Your Look</h3>
                    <p className="text-sm text-muted-foreground font-body italic">Post your favorite signatures or upload a new vibe.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Content Preview</label>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                      <div 
                        className={cn(
                          "aspect-video rounded-[2rem] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer bg-slate-50 active:scale-95 overflow-hidden group relative",
                          (selectedOutfitForPost || customUploadedImage) ? "border-accent bg-accent/5" : "border-slate-100 hover:border-primary/20"
                        )}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {customUploadedImage ? (
                          <div className="relative w-full h-full">
                            <Image src={customUploadedImage} alt="Custom upload" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
                              <RefreshCw className="h-10 w-10 text-white" />
                            </div>
                            <Button 
                              size="icon" 
                              variant="destructive" 
                              className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                              onClick={(e) => { e.stopPropagation(); setCustomUploadedImage(null); }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : selectedOutfitForPost ? (
                          <div className="relative w-full h-full">
                            <Image 
                              src={wardrobeItems.find(i => i.id === selectedOutfitForPost.items[0])?.imageUrl || "https://picsum.photos/seed/post/400"} 
                              alt="" fill className="object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
                              <RefreshCw className="h-10 w-10 text-white" />
                            </div>
                            <Button 
                              size="icon" 
                              variant="destructive" 
                              className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                              onClick={(e) => { e.stopPropagation(); setSelectedOutfitForPost(null); }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <Upload className="h-8 w-8 text-slate-200 mb-2" />
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Choose Outfit or Upload</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Style Note</label>
                      <Textarea 
                        placeholder="What's the vibe of this assembly?" 
                        value={postCaption}
                        onChange={(e) => setPostCaption(e.target.value)}
                        className="rounded-2xl bg-slate-50 border-none min-h-[120px] font-body text-sm p-4 italic"
                      />
                    </div>

                    <Button 
                      className="w-full h-16 rounded-full font-headline text-xl gradient-primary text-white shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                      disabled={(!selectedOutfitForPost && !customUploadedImage) || isPosting}
                      onClick={handleCreatePost}
                    >
                      {isPosting ? <RefreshCw className="h-6 w-6 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                      Publish Look
                    </Button>
                  </div>
                </Card>

                <div className="space-y-6">
                  <h4 className="font-headline font-bold text-xs text-slate-400 uppercase tracking-[0.3em] px-4">Your Signature Outfits</h4>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid gap-3">
                      {savedOutfits.length > 0 ? (
                        savedOutfits.map(outfit => (
                          <button 
                            key={outfit.id} 
                            className={cn(
                              "p-4 bg-white rounded-[2rem] border-2 shadow-sm flex items-center gap-4 cursor-pointer hover:border-accent hover:shadow-md active:scale-[0.98] transition-all text-left group",
                              selectedOutfitForPost?.id === outfit.id ? "border-accent ring-4 ring-accent/10" : "border-slate-50"
                            )}
                            onClick={() => {
                              setSelectedOutfitForPost(outfit);
                              setCustomUploadedImage(null);
                            }}
                          >
                            <div className="h-14 w-14 rounded-2xl overflow-hidden relative shadow-md">
                              <Image src={wardrobeItems.find(i => i.id === outfit.items[0])?.imageUrl || 'https://picsum.photos/seed/1/400'} alt="" fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-bold font-headline block truncate text-primary group-hover:text-accent transition-colors">{outfit.name}</span>
                              <span className="text-[10px] font-body uppercase tracking-widest text-slate-300">{outfit.occasion}</span>
                            </div>
                            <ChevronRight className={cn("h-5 w-5 text-slate-200 group-hover:text-accent transition-all", selectedOutfitForPost?.id === outfit.id && "rotate-90 text-accent")} />
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-slate-100">
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No signature looks yet</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
