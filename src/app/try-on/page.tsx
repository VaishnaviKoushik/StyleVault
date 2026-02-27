'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Sparkles, ArrowLeftRight, RotateCcw, Share2, Save, Check, Upload, X, Palette, Droplets } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const COLOR_PALETTES = [
  { name: 'Royal Blue', hex: '#002366', season: 'Winter' },
  { name: 'Emerald', hex: '#50C878', season: 'Winter' },
  | { name: 'Burnt Orange', hex: '#CC5500', season: 'Autumn' },
  { name: 'Mustard', hex: '#FFDB58', season: 'Autumn' },
  { name: 'Sage Green', hex: '#B2AC88', season: 'Summer' },
  { name: 'Dusty Rose', hex: '#DCAE96', season: 'Summer' },
  { name: 'Coral', hex: '#FF7F50', season: 'Spring' },
  { name: 'Sky Blue', hex: '#87CEEB', season: 'Spring' },
  { name: 'Deep Teal', hex: '#003d3e', season: 'Universal' },
  { name: 'Warm Gold', hex: '#f0b429', season: 'Universal' },
];

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
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0]);
  
  // Camera & Upload State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Detecting skin undertones...",
    "Analyzing eye and hair contrast...",
    "Calibrating color harmony...",
    "Generating season profile ✨"
  ];

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
        description: 'Please enable camera permissions to use the live analysis feature.',
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
      toast({ title: "Photo Required", description: "Please upload or take a photo first." });
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

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 bg-background overflow-hidden">
      <header className="px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-headline font-bold text-primary leading-tight">Color Theory Lab</h2>
          <p className="text-[10px] text-muted-foreground font-body uppercase tracking-[0.2em]">Personal Harmony Analysis</p>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent font-headline uppercase text-[10px]">PREVIEW</Badge>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {!showResult ? (
          <div className="px-6 space-y-8 pt-6 pb-8 max-w-2xl mx-auto">
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>Please enable camera permissions in your browser settings.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div 
                className={cn(
                  "aspect-[4/5] rounded-[2.5rem] overflow-hidden relative border-4 transition-all group shadow-2xl bg-slate-50",
                  photoTaken ? "border-accent" : "border-dashed border-primary/20"
                )}
              >
                {isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                      <Button size="icon" className="h-14 w-14 rounded-full bg-white text-primary shadow-2xl hover:scale-110 transition-transform" onClick={capturePhoto}>
                        <Camera className="h-6 w-6" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-14 w-14 rounded-full shadow-2xl" onClick={stopCamera}>
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                ) : photoTaken ? (
                  <>
                    <Image src={capturedImage!} alt="Target" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/5" />
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => { setPhotoTaken(false); setCapturedImage(null); }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
                      <Palette className="h-10 w-10 text-primary opacity-20" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-headline font-bold text-xl">Analyze Your Complexion</h3>
                      <p className="text-sm text-muted-foreground font-body">Take a selfie in natural light to find your perfect color palette.</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <Button className="h-14 rounded-2xl flex items-center gap-3 gradient-primary text-white" onClick={startCamera}>
                        <Camera className="h-5 w-5" />
                        <span className="font-headline font-bold">Open Camera</span>
                      </Button>
                      <Button variant="outline" className="h-14 rounded-2xl flex items-center gap-3 border-primary/20" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-5 w-5 text-primary" />
                        <span className="font-headline font-bold">Upload Photo</span>
                      </Button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Test Color</h4>
                <Badge variant="outline" className="border-primary/20 text-primary font-headline">{selectedColor.season}</Badge>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {COLOR_PALETTES.map((color) => (
                  <button 
                    key={color.name}
                    className={cn(
                      "aspect-square rounded-2xl border-4 transition-all flex items-center justify-center relative",
                      selectedColor.name === color.name ? "border-primary scale-110 shadow-lg" : "border-white hover:border-primary/20"
                    )}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor.name === color.name && (
                      <Check className={cn("h-5 w-5", color.season === 'Spring' || color.season === 'Summer' ? 'text-black' : 'text-white')} />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <div className="pt-4">
              {isGenerating ? (
                <Card className="p-6 bg-white rounded-3xl shadow-xl border border-primary/10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-headline font-bold text-primary animate-pulse">{genStep}</p>
                      <p className="text-xs font-bold text-muted-foreground">{Math.round(progress)}%</p>
                    </div>
                    <Progress value={progress} className="h-3 bg-primary/10" />
                  </div>
                </Card>
              ) : (
                <Button 
                  className="w-full h-16 rounded-full gradient-pill text-lg font-headline shadow-xl text-white"
                  onClick={handleGenerate}
                  disabled={!photoTaken}
                >
                  Analyze Color Harmony
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col p-6 space-y-8 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
              {/* After View (Color Harmony Overlay) */}
              <div className="absolute inset-0">
                <Image src={capturedImage!} alt="Harmony" fill className="object-cover" />
                <div 
                  className="absolute inset-0 mix-blend-soft-light opacity-60"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                   <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white">
                      <p className="text-xs font-headline font-bold text-primary text-center">Season: {selectedColor.season}</p>
                      <p className="text-[10px] text-muted-foreground font-body text-center">Perfect Match: {selectedColor.name}</p>
                   </div>
                </div>
              </div>
              
              {/* Before View (Original) */}
              <div 
                className="absolute inset-0 overflow-hidden border-r-4 border-white shadow-2xl"
                style={{ width: `${sliderValue}%` }}
              >
                <div className="w-[100vw] h-full relative">
                  <Image src={capturedImage!} alt="Original" fill className="object-cover" />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-none font-headline uppercase px-4 py-1">ORIGINAL</Badge>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-6 right-6">
                <Badge className="bg-primary text-white border-none font-headline uppercase px-4 py-1 shadow-lg">HARMONY</Badge>
              </div>

              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
              
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] pointer-events-none z-20"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-primary/20">
                  <ArrowLeftRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg" onClick={handleReset}>
                <RotateCcw className="h-6 w-6 text-primary" />
                <span className="text-[10px] font-bold font-headline uppercase">New Photo</span>
              </Button>
              <Button variant="outline" className="h-24 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg" onClick={() => toast({ title: "Profile Saved!", description: "Season analysis added to your style vault." })}>
                <Save className="h-6 w-6 text-accent" />
                <span className="text-[10px] font-bold font-headline uppercase">Save Analysis</span>
              </Button>
              <Button variant="outline" className="h-24 rounded-3xl flex flex-col gap-2 border-none bg-white shadow-md hover:shadow-lg" onClick={() => toast({ title: "Sharing...", description: "Opening system share." })}>
                <Share2 className="h-6 w-6 text-primary" />
                <span className="text-[10px] font-bold font-headline uppercase">Share Profile</span>
              </Button>
            </div>
            
            <Button className="w-full h-16 rounded-full gradient-primary font-headline text-lg text-white shadow-xl">
              Get Personalized Palette
              <Droplets className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

