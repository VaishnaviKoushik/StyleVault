'use client';

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, Sparkles, Upload, FolderOpen, X, RefreshCw, Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = ["Upload", "Details", "Confirm"];

const categories = [
  { label: "Tops", value: "top" },
  { label: "Bottoms", value: "bottom" },
  { label: "Shoes", value: "shoes" },
  { label: "Bags", value: "accessory" },
  { label: "Dresses", value: "dress" },
  { label: "Outerwear", value: "outerwear" }
];

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Sage', hex: '#94A3B8' },
  { name: 'Burgundy', hex: '#7F1D1D' }
];

export default function AddItemPage() {
  const [step, setStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [itemName, setItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => stopCamera();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsCameraActive(false);
      toast({ title: "Image Loaded", description: "Ready for digital analysis." });
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
        description: 'Please enable camera permissions in your browser settings to use the live analysis feature.',
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
        setPreviewUrl(dataUrl);
        stopCamera();
        toast({ title: "Photo Captured", description: "Ready for digital analysis." });
      }
    }
  };

  const handleComplete = () => {
    setSaving(true);
    // Simulate AI processing and saving
    setTimeout(() => {
      toast({ 
        title: "Item added to closet!", 
        description: `${itemName || 'New item'} has been tagged and saved.` 
      });
      router.push('/wardrobe');
    }, 1500);
  };

  if (!mounted) return null;

  const currentCategoryLabel = categories.find(c => c.value === selectedCategory)?.label || "Not selected";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full active:scale-90" onClick={() => {
            if (isCameraActive) stopCamera();
            else if (step > 0) setStep(step - 1);
            else router.back();
          }}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-0.5">
            <h2 className="text-3xl font-headline font-bold text-primary">Catalog New Item</h2>
            <p className="text-muted-foreground font-body">Upload or snap a photo to digitize your wardrobe.</p>
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
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  
                  <div 
                    className={cn(
                      "relative aspect-[3/4] rounded-3xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all overflow-hidden active:scale-[0.98]",
                      previewUrl || isCameraActive
                        ? "border-primary/40 bg-white" 
                        : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                    )}
                  >
                    {isCameraActive ? (
                      <div className="relative w-full h-full">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                          <Button size="icon" className="h-14 w-14 rounded-full bg-white text-primary shadow-2xl hover:scale-110 transition-transform" onClick={capturePhoto}>
                            <Camera className="h-6 w-6" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-14 w-14 rounded-full shadow-2xl" onClick={stopCamera}>
                            <X className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    ) : previewUrl ? (
                      <div className="relative w-full h-full" onClick={triggerUpload}>
                        <Image 
                          src={previewUrl} 
                          alt="Uploaded" 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <FolderOpen className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-primary space-y-4 p-8 text-center" onClick={triggerUpload}>
                        <FolderOpen className="h-16 w-16 opacity-40" />
                        <div className="space-y-1">
                          <p className="font-headline font-bold text-lg">Browse Files</p>
                          <p className="text-xs font-body text-muted-foreground">Choose a high-quality photo from your device storage</p>
                        </div>
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 h-14 rounded-full gradient-pill font-headline text-white active:scale-95 transition-all"
                      onClick={triggerUpload}
                    >
                      {previewUrl ? "Change File" : "Browse Files"} <Upload className="ml-2 h-4 w-4" />
                    </Button>
                    {!isCameraActive && (
                      <Button 
                        variant="outline"
                        className="flex-1 h-14 rounded-full border-primary/20 text-primary font-headline active:scale-95 transition-all"
                        onClick={startCamera}
                      >
                        Open Camera <Camera className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-headline font-bold text-foreground">File Upload Tips</h3>
                  <ul className="space-y-4 text-muted-foreground font-body">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">1</div>
                      <span>Ensure the item is fully visible and not obstructed.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">2</div>
                      <span>Plain backgrounds help the AI identify garment edges.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">3</div>
                      <span>Upload JPG, PNG, or WEBP images up to 10MB.</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full h-14 rounded-full gradient-pill font-headline text-lg text-white active:scale-95 transition-all disabled:opacity-50"
                    disabled={!previewUrl || isCameraActive}
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
                  <Input 
                    placeholder="e.g. White Linen Shirt" 
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="h-14 rounded-2xl bg-slate-50 border-none shadow-sm font-headline text-xl px-6 focus-visible:ring-primary" 
                  />
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map(c => (
                      <Button 
                        key={c.value} 
                        type="button"
                        variant={selectedCategory === c.value ? "default" : "outline"}
                        onClick={() => setSelectedCategory(c.value)}
                        className={cn(
                          "rounded-2xl h-14 font-headline transition-all shadow-sm active:scale-95",
                          selectedCategory === c.value ? "bg-primary text-white" : "border-slate-100 bg-slate-50 hover:bg-primary/10"
                        )}
                      >
                        {c.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Main Color</label>
                  <div className="flex flex-wrap gap-4 px-2">
                    {colors.map(color => (
                      <button 
                        key={color.name} 
                        type="button"
                        className="flex flex-col items-center gap-2 cursor-pointer group outline-none active:scale-90 transition-transform"
                        onClick={() => setSelectedColor(color.name)}
                      >
                        <div 
                          className={cn(
                            "h-12 w-12 rounded-full border-4 shadow-lg transition-all ring-1 ring-slate-100 flex items-center justify-center",
                            selectedColor === color.name ? "border-primary scale-110" : "border-white"
                          )} 
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor === color.name && (
                            <Check className={cn("h-6 w-6", color.name === 'White' || color.name === 'Beige' ? 'text-black' : 'text-white')} />
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold transition-colors",
                          selectedColor === color.name ? "text-primary" : "text-muted-foreground"
                        )}>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full h-16 rounded-full gradient-pill font-headline text-xl text-white shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                  disabled={!itemName || !selectedCategory || !selectedColor}
                  onClick={() => setStep(2)}
                >
                  Review AI Tagging
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                  {previewUrl && (
                    <Image 
                      src={previewUrl} 
                      alt="Review" 
                      fill 
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <h3 className="text-3xl font-headline font-bold">{itemName || "New Wardrobe Item"}</h3>
                    <div className="flex gap-2">
                      <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-headline uppercase text-xs">
                        {currentCategoryLabel}
                      </Badge>
                      <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-headline uppercase text-xs">
                        {selectedColor || "No Color"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-headline font-bold text-foreground">Final Review</h4>
                    <p className="text-muted-foreground">The AI has analyzed your image and confirmed the attributes below. You can save this to your closet now.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Category</p>
                        <p className="font-headline font-bold">{currentCategoryLabel}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Color</p>
                        <p className="font-headline font-bold">{selectedColor}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-16 rounded-full font-headline border-primary text-primary active:scale-95 transition-all" onClick={() => setStep(1)}>
                      Edit Details
                    </Button>
                    <Button 
                      className="flex-1 h-16 rounded-full gradient-pill font-headline text-white border-glow active:scale-95 transition-all disabled:opacity-50" 
                      onClick={handleComplete}
                      disabled={saving}
                    >
                      {saving ? <RefreshCw className="h-6 w-6 animate-spin" /> : "Save to Closet"}
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
