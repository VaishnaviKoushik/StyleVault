'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Sparkles, ArrowLeftRight, RotateCcw, Share2, Save, Check } from "lucide-react";
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
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps.length) {
        setGenStep(steps[currentStep - 1]);
        setProgress((currentStep / steps.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setShowResult(true);
        }, 500);
      }
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 bg-background">
      <header className="px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-headline font-bold">AI Try-On</h2>
        <Badge variant="secondary" className="bg-accent/10 text-accent font-headline uppercase text-[10px]">PREVIEW</Badge>
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
                    photoTaken ? "border-accent" : "border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
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
                      <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full shadow-lg">
                        <Check className="h-3 w-3" />
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-primary gap-2">
                      <Camera className="h-6 w-6" />
                      <span className="text-[10px] font-bold font-headline">TAKE PHOTO</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Selected Item</label>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative border-2 border-primary">
                  <Image src={selectedItem.imageUrl} alt="Item" fill className="object-cover" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge className="w-full bg-white/80 backdrop-blur-md text-primary border-none font-headline text-[10px] uppercase justify-center">
                      {selectedItem.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Carousel */}
            <section className="space-y-3">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase px-1">Choose from closet</h4>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {MOCK_WARDROBE.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "min-w-[100px] aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all shrink-0",
                      selectedItem.id === item.id ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60"
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
                <div className="space-y-4 text-center">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-headline font-bold text-primary">{genStep}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">{Math.round(progress)}%</p>
                  </div>
                  <Progress value={progress} className="h-2 bg-primary/10" />
                </div>
              ) : (
                <Button 
                  className="w-full h-16 rounded-full gradient-pill text-lg font-headline shadow-xl border-glow"
                  onClick={handleGenerate}
                >
                  {!photoTaken ? "Start with a Photo" : "Generate AR Try-On"}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col p-6 space-y-8 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            {/* Result Slider */}
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              {/* After Image */}
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
                className="absolute inset-0 overflow-hidden border-r-2 border-white/50"
                style={{ width: `${sliderValue}%` }}
              >
                <div className="w-[340px] h-full relative">
                   <Image 
                    src="https://images.unsplash.com/photo-1687825520757-93e18a996f8c" 
                    alt="Before" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/40 backdrop-blur-md text-white border-none font-headline">BEFORE</Badge>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent text-white border-none font-headline">AFTER</Badge>
              </div>

              {/* Slider Control */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-10"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                  <ArrowLeftRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="h-16 rounded-3xl flex flex-col gap-1 border-none bg-white shadow-sm" onClick={() => setShowResult(false)}>
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-bold font-headline text-muted-foreground uppercase">Retry</span>
              </Button>
              <Button variant="outline" className="h-16 rounded-3xl flex flex-col gap-1 border-none bg-white shadow-sm">
                <Save className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-bold font-headline text-muted-foreground uppercase">Save</span>
              </Button>
              <Button variant="outline" className="h-16 rounded-3xl flex flex-col gap-1 border-none bg-white shadow-sm">
                <Share2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-bold font-headline text-muted-foreground uppercase">Share</span>
              </Button>
            </div>
            
            <Button className="w-full h-16 rounded-full gradient-pill font-headline text-lg border-glow shadow-primary/20">
              Add to Collection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
