'use client';

import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Check, ChevronLeft, Sparkles, X, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const steps = ["Capture", "Details", "Confirm"];

export default function AddItemPage() {
  const [step, setStep] = useState(0);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (step === 0 && !photoTaken) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      };

      getCameraPermission();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [step, photoTaken, toast]);

  const handleCapture = () => {
    setPhotoTaken(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleComplete = () => {
    toast({ title: "Item added to closet!", description: "AI has tagged it automatically." });
    router.push('/wardrobe');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => step > 0 ? setStep(step - 1) : router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-0.5">
            <h2 className="text-3xl font-headline font-bold text-primary">Catalog New Item</h2>
            <p className="text-muted-foreground font-body">Digitize your wardrobe with AI assisted tagging.</p>
          </div>
        </header>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-12 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300",
                step >= i ? "bg-primary text-white shadow-xl scale-110" : "bg-slate-200 text-muted-foreground"
              )}>
                {step > i ? <Check className="h-6 w-6" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-headline font-bold uppercase tracking-widest",
                step >= i ? "text-primary" : "text-muted-foreground"
              )}>{s}</span>
            </div>
          ))}
        </div>

        <Card className="border-none shadow-2xl bg-white overflow-hidden">
          <CardContent className="p-8">
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div 
                    className="relative aspect-[3/4] rounded-3xl border-4 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center cursor-pointer group hover:bg-primary/10 transition-all overflow-hidden"
                  >
                    <video 
                      ref={videoRef} 
                      className={cn("w-full h-full object-cover", photoTaken && "hidden")} 
                      autoPlay 
                      muted 
                      playsInline
                    />
                    
                    {photoTaken && (
                      <div className="relative w-full h-full">
                        <Image 
                          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                          alt="Captured" 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                          <div className="h-20 w-20 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl border-4 border-white">
                            <Check className="h-10 w-10" />
                          </div>
                        </div>
                      </div>
                    )}

                    {!photoTaken && hasCameraPermission === null && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
                        <Camera className="h-10 w-10 animate-pulse" />
                        <p className="mt-2 font-headline font-bold">Initializing Camera...</p>
                      </div>
                    )}
                  </div>

                  {!photoTaken && hasCameraPermission === false && (
                    <Alert variant="destructive" className="rounded-2xl">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser settings to take photos of your garments.
                      </AlertDescription>
                    </Alert>
                  )}

                  {!photoTaken && hasCameraPermission && (
                    <Button 
                      className="w-full h-14 rounded-full gradient-pill font-headline text-lg"
                      onClick={handleCapture}
                    >
                      Capture Photo <Camera className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                  
                  {photoTaken && (
                    <Button 
                      variant="outline"
                      className="w-full h-14 rounded-full font-headline"
                      onClick={() => setPhotoTaken(false)}
                    >
                      Retake Photo
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-headline font-bold text-foreground">Image Guidelines</h3>
                  <ul className="space-y-4 text-muted-foreground font-body">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">1</div>
                      <span>Use a neutral background for best AI recognition.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">2</div>
                      <span>Ensure the item is well-lit and fully visible.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">3</div>
                      <span>Avoid shadows and busy patterns in the background.</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full h-14 rounded-full gradient-pill font-headline text-lg"
                    disabled={!photoTaken}
                    onClick={() => setStep(1)}
                  >
                    Continue to Details <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Item Name</label>
                  <Input placeholder="e.g. White Linen Shirt" className="h-14 rounded-2xl bg-slate-50 border-none shadow-sm font-headline text-xl px-6 focus-visible:ring-primary" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["Tops", "Bottoms", "Shoes", "Bags", "Dresses", "Outerwear"].map(c => (
                      <Button key={c} variant="outline" className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-headline hover:bg-primary hover:text-white transition-all shadow-sm">
                        {c}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Main Color</label>
                  <div className="flex flex-wrap gap-4 px-2">
                    {[
                      { name: 'Black', hex: '#000000' },
                      { name: 'White', hex: '#FFFFFF' },
                      { name: 'Beige', hex: '#F5F5DC' },
                      { name: 'Navy', hex: '#1E3A8A' },
                      { name: 'Sage', hex: '#94A3B8' },
                      { name: 'Burgundy', hex: '#7F1D1D' }
                    ].map(color => (
                      <div key={color.name} className="flex flex-col items-center gap-2">
                        <div 
                          className="h-12 w-12 rounded-full border-4 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform ring-1 ring-slate-100" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[10px] font-bold text-muted-foreground">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full h-16 rounded-full gradient-pill font-headline text-xl shadow-xl shadow-primary/20"
                  onClick={() => setStep(2)}
                >
                  Review AI Tagging
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                    alt="Review" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <h3 className="text-3xl font-headline font-bold">White Linen Shirt</h3>
                    <div className="flex gap-2">
                      <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-headline uppercase text-xs">Tops</Badge>
                      <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-headline uppercase text-xs">Summer</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-headline font-bold text-foreground">Final Review</h4>
                    <div className="grid grid-cols-2 gap-6 text-foreground">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Brand</p>
                        <p className="font-headline font-bold">Everlane</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Fabric</p>
                        <p className="font-headline font-bold">100% Linen</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Season</p>
                        <p className="font-headline font-bold">Spring / Summer</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Occasions</p>
                        <p className="font-headline font-bold">Casual, Work</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-16 rounded-full font-headline border-primary text-primary" onClick={() => setStep(1)}>
                      Edit Details
                    </Button>
                    <Button className="flex-1 h-16 rounded-full gradient-pill font-headline text-white border-glow" onClick={handleComplete}>
                      Save to Closet
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
