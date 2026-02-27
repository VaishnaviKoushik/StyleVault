'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Sparkles, ArrowLeftRight, RotateCcw, Share2, Save, Check, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { MOCK_WARDROBE } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function TryOnScreen() {
  const router = useRouter();
  const { toast } = useToast();
  
  // UI State
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [genStep, setGenStep] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedItem, setSelectedItem] = useState(MOCK_WARDROBE[0]);
  
  // Camera & Upload State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock carousel options (First 4 items)
  const carouselItems = MOCK_WARDROBE.slice(0, 4);

  const steps = [
    "Analyzing body shape...",
    "Matching fabric texture...",
    "Adjusting lighting...",
    "Rendering final look ✨"
  ];

  // Camera initialization
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setHasCameraPermission(true);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to take a selfie.',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        setPhotoTaken(true);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setPhotoTaken(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!photoTaken) {
      toast({
        title: "Photo Required",
        description: "Please take a selfie or upload a photo first.",
      });
      return;
    }
    
    setIsGenerating(true);
    let stepIndex = 0;
    
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setGenStep(steps[stepIndex]);
        setProgress(((stepIndex + 1) / steps.length) * 100);
        stepIndex++;
      } else {
        clearInterval(interval);
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
    setCapturedImage(null);
    setProgress(0);
    setGenStep("");
    stopCamera();
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Hardcoded Prototype Images
  const mockBeforeImage = capturedImage || "https://images.unsplash.com/photo-1687825520757-93e18a996f8c";
  const mockAfterImage = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab";

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 bg-background overflow-hidden">
      <header className="px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-headline font-bold text-primary">AI Try-On Prototype</h2>
        <Badge variant="secondary" className="bg-accent/10 text-accent font-headline uppercase text-[10px]">PREVIEW MODE</Badge>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {!showResult ? (
          <div className="px-6 space-y-6 pt-6 pb-8 max-w-2xl mx-auto">
            {/* Camera Permission Alert if Denied */}
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser settings to use the selfie feature.
                </AlertDescription>
              </Alert>
            )}

            {/* Split View Setup */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase px-1 flex justify-between">
                  Your Photo
                  {photoTaken && (
                    <button onClick={() => { setPhotoTaken(false); setCapturedImage(null); }} className="text-destructive hover:underline">
                      Remove
                    </button>
                  )}
                </label>
                
                <div 
                  className={cn(
                    "aspect-[3/4] rounded-3xl overflow-hidden relative border-2 transition-all group",
                    photoTaken ? "border-accent shadow-lg" : "border-dashed border-primary/20 bg-primary/5"
                  )}
                >
                  {isCameraActive ? (
                    <div className="relative w-full h-full">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        <Button size="icon" className="h-12 w-12 rounded-full bg-white text-primary shadow-xl" onClick={capturePhoto}>
                          <Camera className="h-6 w-6" />
                        </Button>
                        <Button size="icon" variant="destructive" className="h-12 w-12 rounded-full shadow-xl" onClick={stopCamera}>
                          <X className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  ) : photoTaken ? (
                    <>
                      <Image 
                        src={capturedImage || mockBeforeImage} 
                        alt="Selfie" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-accent/10 pointer-events-none" />
                      <div className="absolute top-3 right-3 bg-accent text-white p-1 rounded-full shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                      <div className="flex flex-col gap-3 w-full">
                        <Button variant="outline" className="h-16 rounded-2xl flex flex-col gap-1 border-primary/20 hover:bg-primary/5" onClick={startCamera}>
                          <Camera className="h-5 w-5 text-primary" />
                          <span className="text-[10px] font-bold font-headline uppercase">Take Selfie</span>
                        </Button>
                        <Button variant="outline" className="h-16 rounded-2xl flex flex-col gap-1 border-primary/20 hover:bg-primary/5" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-5 w-5 text-primary" />
                          <span className="text-[10px] font-bold font-headline uppercase">Upload Photo</span>
                        </Button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
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
                      "min-w-[120px] aspect-square rounded-2xl overflow-hidden border-4 cursor-pointer transition-all shrink-0 relative",
                      selectedItem.id === item.id ? "border-primary shadow-xl scale-105" : "border-transparent opacity-60"
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
                  disabled={!photoTaken}
                >
                  {photoTaken ? "Generate AI Try-On" : "Capture Photo First"}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground font-body italic">
              * This is a high-fidelity interface prototype demonstrating the AI workflow.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col p-6 space-y-8 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            {/* Comparison Slider */}
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
              {/* After Image (Styled Outfit) */}
              <div className="absolute inset-0">
                <Image 
                  src={mockAfterImage} 
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
                    src={capturedImage || mockBeforeImage} 
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
              <Button variant="outline" className="h-20 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg transition-all" onClick={() => toast({ title: "Saved!", description: "Look added to your history." })}>
                <Save className="h-6 w-6 text-accent" />
                <span className="text-[10px] font-bold font-headline text-muted-foreground uppercase">Save Result</span>
              </Button>
              <Button variant="outline" className="h-20 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg transition-all" onClick={() => toast({ title: "Sharing...", description: "Opening system share." })}>
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
