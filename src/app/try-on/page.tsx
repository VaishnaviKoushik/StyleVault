'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Sparkles, Zap, ArrowLeftRight, RotateCcw, Share2, Save } from "lucide-react";
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
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-headline font-bold">AI Try-On</h2>
        <Badge variant="secondary" className="bg-[#00C9B7]/10 text-[#00C9B7] font-headline uppercase text-[10px]">PREVIEW</Badge>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!showResult ? (
          <div className="px-6 space-y-6 pt-2 pb-8">
            {/* Split View Setup */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8E8E93] uppercase px-1">Your Photo</label>
                <div 
                  className={cn(
                    "aspect-[3/4] rounded-2xl overflow-hidden relative border-2",
                    photoTaken ? "border-[#00C9B7]" : "border-dashed border-[#6E4AE0]/20 bg-[#6E4AE0]/5"
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
                      <div className="absolute top-2 right-2 bg-[#00C9B7] text-white p-1 rounded-full shadow-lg">
                        <Check className="h-3 w-3" />
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#6E4AE0] gap-2">
                      <Camera className="h-6 w-6" />
                      <span className="text-[10px] font-bold font-headline">TAKE PHOTO</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8E8E93] uppercase px-1">Selected Item</label>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative border-2 border-[#6E4AE0]">
                  <Image src={selectedItem.imageUrl} alt="Item" fill className="object-cover" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge className="w-full bg-white/80 backdrop-blur-md text-[#6E4AE0] border-none font-headline text-[10px] uppercase justify-center">
                      {selectedItem.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Carousel */}
            <section className="space-y-3">
              <h4 className="text-[10px] font-bold text-[#8E8E93] uppercase px-1">Choose from closet</h4>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
                {MOCK_WARDROBE.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "min-w-[80px] aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                      selectedItem.id === item.id ? "border-[#6E4AE0] shadow-lg scale-105" : "border-transparent opacity-60"
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
                    <p className="text-xs font-headline font-bold text-[#6E4AE0]">{genStep}</p>
                    <p className="text-[10px] font-bold text-[#8E8E93]">{Math.round(progress)}%</p>
                  </div>
                  <Progress value={progress} className="h-2 bg-[#6E4AE0]/10" />
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={cn("h-1 rounded-full", progress >= (i * 25) ? "bg-[#6E4AE0]" : "bg-[#6E4AE0]/10")} />
                    ))}
                  </div>
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
            <p className="text-center text-[10px] text-[#8E8E93] font-body uppercase tracking-[0.2em]">
              Powered by Gemini 2.5 Flash
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col p-6 space-y-8 animate-in zoom-in-95 duration-500">
            {/* Result Slider */}
            <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
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
                <Badge className="bg-[#00C9B7] text-white border-none font-headline">AFTER</Badge>
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
                  <ArrowLeftRight className="h-4 w-4 text-[#6E4AE0]" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="h-16 rounded-3xl flex flex-col gap-1 border-none bg-white shadow-sm" onClick={() => setShowResult(false)}>
                <RotateCcw className="h-5 w-5 text-[#8E8E93]" />
                <span className="text-[10px] font-bold font-headline text-[#8E8E93]">RETRY</span>
              </Button>
              <Button variant="outline" className="h-16 rounded-3xl flex flex-col gap-1 border-none bg-white shadow-sm">
                <Save className="h-5 w-5 text-[#8E8E93]" />
                <span className="text-[10px] font-bold font-headline text-[#8E8E93]">SAVE</span>
              </Button>
              <Button variant="outline" className="h-16 rounded-3xl flex flex-col gap-1 border-none bg-white shadow-sm">
                <Share2 className="h-5 w-5 text-[#8E8E93]" />
                <span className="text-[10px] font-bold font-headline text-[#8E8E93]">SHARE</span>
              </Button>
            </div>
            
            <Button className="w-full h-16 rounded-full gradient-pill font-headline text-lg border-glow">
              Add to Collection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}