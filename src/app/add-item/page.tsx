'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Check, ChevronLeft, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const steps = ["Capture", "Details", "Confirm"];

export default function AddItemPage() {
  const [step, setStep] = useState(0);
  const [photoTaken, setPhotoTaken] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleComplete = () => {
    toast({ title: "Item added to closet!", description: "AI has tagged it automatically." });
    router.push('/wardrobe');
  };

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right duration-300">
      <header className="px-6 py-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => step > 0 ? setStep(step - 1) : router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-headline font-bold">Add New Item</h2>
        <div className="w-10" />
      </header>

      {/* Stepper */}
      <div className="px-8 flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors",
              step >= i ? "bg-[#6E4AE0] text-white shadow-lg" : "bg-[#8E8E93]/10 text-[#8E8E93]"
            )}>
              {step > i ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-[2px] w-12", step > i ? "bg-[#6E4AE0]" : "bg-[#8E8E93]/10")} />
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 px-6 space-y-6">
        {step === 0 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div 
              className="relative aspect-[3/4] rounded-[40px] border-4 border-dashed border-[#6E4AE0]/20 bg-[#6E4AE0]/5 flex flex-col items-center justify-center cursor-pointer group hover:bg-[#6E4AE0]/10 transition-all overflow-hidden"
              onClick={() => setPhotoTaken(true)}
            >
              {photoTaken ? (
                <>
                  <Image 
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                    alt="Captured" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#00C9B7]/20 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-[#00C9B7] text-white flex items-center justify-center shadow-2xl border-4 border-white">
                      <Check className="h-8 w-8" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center text-[#6E4AE0] group-hover:scale-110 transition-transform">
                    <Camera className="h-8 w-8" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-headline font-bold">Tap to capture</p>
                    <p className="text-[10px] text-[#8E8E93] font-body uppercase tracking-widest mt-1">or select from gallery</p>
                  </div>
                </>
              )}
            </div>
            <Button 
              className="w-full h-14 rounded-full gradient-pill font-headline text-lg"
              disabled={!photoTaken}
              onClick={() => setStep(1)}
            >
              Continue <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8E8E93] uppercase px-2">Item Name</label>
              <Input placeholder="e.g. White Linen Shirt" className="h-14 rounded-2xl bg-white border-none shadow-sm font-headline text-lg px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8E8E93] uppercase px-2">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {["Tops", "Bottoms", "Shoes", "Bags", "Dresses", "Outerwear"].map(c => (
                  <Button key={c} variant="outline" className="rounded-xl border-none bg-white shadow-sm h-12 font-headline text-xs hover:bg-[#6E4AE0] hover:text-white transition-all">
                    {c}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8E8E93] uppercase px-2">Main Color</label>
              <div className="flex justify-between px-2">
                {[
                  { name: 'Black', hex: '#000000' },
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Red', hex: '#EF4444' },
                  { name: 'Blue', hex: '#3B82F6' },
                  { name: 'Green', hex: '#10B981' },
                  { name: 'Beige', hex: '#F5F5DC' }
                ].map(color => (
                  <div 
                    key={color.name} 
                    className="h-10 w-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform" 
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
            <Button 
              className="w-full h-14 rounded-full gradient-pill font-headline text-lg mt-8"
              onClick={() => setStep(2)}
            >
              Review Item
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="glass-card rounded-[40px] overflow-hidden">
              <div className="relative aspect-[3/4]">
                <Image 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                  alt="Review" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                  <h3 className="text-2xl font-headline font-bold">White Linen Shirt</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-headline uppercase text-[10px]">Tops</Badge>
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-headline uppercase text-[10px]">White</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-14 rounded-full font-headline border-[#6E4AE0] text-[#6E4AE0]" onClick={() => setStep(1)}>
                Edit Details
              </Button>
              <Button className="flex-1 h-14 rounded-full gradient-pill font-headline text-white border-glow" onClick={handleComplete}>
                Save to Closet
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}