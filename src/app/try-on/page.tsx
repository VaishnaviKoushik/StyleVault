'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Sparkles, ArrowLeftRight, RotateCcw, Share2, Save, Check, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { MOCK_WARDROBE } from "@/lib/mock-data";

export default function TryOnScreen() {
  const router = useRouter();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [genStep, setGenStep] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedItem, setSelectedItem] = useState(MOCK_WARDROBE[0]);

  // Mock carousel options (First 4 items)
  const carouselItems = MOCK_WARDROBE.slice(0, 4);

  const steps = [
    "Analyzing body shape...",
    "Matching fabric texture...",
    "Adjusting lighting...",
    "Rendering final look ✨"
  ];

  const handleGenerate = () => {
    if (!photoTaken) {
      setPhotoTaken(true);
      return;
    }
    
    setIsGenerating(true);
    let stepIndex = 0;
    
    // Cycle through 4 steps at 600ms intervals
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setGenStep(steps[stepIndex]);
        setProgress(((stepIndex + 1) / steps.length) * 100);
        stepIndex++;
      } else {
        clearInterval(interval);
        // 500ms post-interval delay before showing result
        setTimeout(() => {
          setIsGenerating(false);
          setShowResult(true);
        }, 500);
      }
    }, 600);
  };

  const handleReset = () => {
    setShowResult(false);
    setPhotoTaken(false);
    setProgress(0);
    setGenStep("");
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 bg-background">
      <header className="px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-headline font-bold text-primary">AI Try-On Prototype</h2>
        <Badge variant="secondary" className="bg-accent/10 text-accent font-headline uppercase text-[10px]">PREVIEW MODE</Badge>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!showResult ? (
          <div className="px-6 space-y-6 pt-6 pb-8 max-w-2xl mx-auto">
            {/* Split View Setup */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Your Photo</label>
                <div 
                  className={cn(
                    "aspect-[3/4] rounded-3xl overflow-hidden relative border-2 transition-all cursor-pointer",
                    photoTaken ? "border-accent shadow-lg" : "border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
                  )}
                  onClick={() => setPhotoTaken(true)}
                >
                  {photoTaken ? (
                    <>
                      <Image 
                        src="https://images.unsplash.com/photo-1687825520757-93e18a996f8c" 
                        alt="Selfie" 
                        fill 
                        className="object-cover"
                        data-ai-hint="person selfie"
                      />
                      <div className="absolute inset-0 bg-accent/10 pointer-events-none" />
                      <div className="absolute top-3 right-3 bg-accent text-white p-1 rounded-full shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-primary gap-2">
                      <ImageIcon className="h-8 w-8 opacity-40" />
                      <span className="text-[10px] font-bold font-headline uppercase tracking-widest">Select Photo</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Selected Item</label>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative border-2 border-primary shadow-lg">
                  <Image src={selectedItem.imageUrl} alt="Item" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <Badge className="w-full bg-white/20 backdrop-blur-md text-white border-none font-headline text-[10px] uppercase justify-center">
                      {selectedItem.name}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Carousel */}
            <section className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Garment Selection</h4>
                <span className="text-[10px] font-bold text-primary">4 Options Available</span>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-1">
                {carouselItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "min-w-[120px] aspect-square rounded-2xl overflow-hidden border-4 cursor-pointer transition-all shrink-0",
                      selectedItem.id === item.id ? "border-primary shadow-xl scale-105" : "border-transparent opacity-60 grayscale-[0.5]"
                    )}
                    onClick={() => setSelectedItem(item)}
                  >
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>

            {/* Generate Button */}
            <div className="pt-4">
              {isGenerating ? (
                <div className="space-y-4 p-6 bg-white rounded-3xl shadow-xl border border-primary/10">
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-headline font-bold text-primary animate-pulse">{genStep}</p>
                    <p className="text-xs font-bold text-muted-foreground">{Math.round(progress)}%</p>
                  </div>
                  <Progress value={progress} className="h-3 bg-primary/10" />
                </div>
              ) : (
                <Button 
                  className="w-full h-16 rounded-full gradient-pill text-lg font-headline shadow-xl border-glow text-white"
                  onClick={handleGenerate}
                >
                  {!photoTaken ? "Choose Your Photo First" : "Generate AI Try-On"}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground font-body italic">
              * This is a high-fidelity interface prototype demonstrating the AR workflow.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col p-6 space-y-8 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            {/* Comparison Slider */}
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
              {/* After Image (Styled Outfit) */}
              <div className="absolute inset-0">
                <Image 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                  alt="Result" 
                  fill 
                  className="object-cover"
                />
              </div>
              
              {/* Before Image (Revealed by Slider) */}
              <div 
                className="absolute inset-0 overflow-hidden border-r-4 border-white shadow-2xl"
                style={{ width: `${sliderValue}%` }}
              >
                <div className="w-[100vw] h-full relative">
                   <Image 
                    src="https://images.unsplash.com/photo-1687825520757-93e18a996f8c" 
                    alt="Before" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-none font-headline uppercase px-4 py-1">BEFORE</Badge>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-6 right-6">
                <Badge className="bg-accent text-white border-none font-headline uppercase px-4 py-1 shadow-lg">AFTER</Badge>
              </div>

              {/* Range Input Overlay */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
              
              {/* Visual Slider Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] pointer-events-none z-20"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-primary/20">
                  <ArrowLeftRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg transition-all" onClick={handleReset}>
                <RotateCcw className="h-6 w-6 text-primary" />
                <span className="text-[10px] font-bold font-headline text-muted-foreground uppercase">New Session</span>
              </Button>
              <Button variant="outline" className="h-20 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg transition-all">
                <Save className="h-6 w-6 text-accent" />
                <span className="text-[10px] font-bold font-headline text-muted-foreground uppercase">Save Result</span>
              </Button>
              <Button variant="outline" className="h-20 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg transition-all">
                <Share2 className="h-6 w-6 text-primary" />
                <span className="text-[10px] font-bold font-headline text-muted-foreground uppercase">Share Look</span>
              </Button>
            </div>
            
            <Button className="w-full h-16 rounded-full gradient-pill font-headline text-lg border-glow text-white shadow-xl">
              Create Instagram Post
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}