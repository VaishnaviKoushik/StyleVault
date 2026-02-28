'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Camera, Brain, Calendar, ChevronRight } from 'lucide-react';

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('stylevault-onboarding-seen');
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('stylevault-onboarding-seen', 'true');
    setOpen(false);
  };

  const steps = [
    {
      title: "Welcome to StyleVault",
      description: "Your digital wardrobe is about to get a major upgrade. Let's show you how to master your personal style using AI.",
      icon: Sparkles
    },
    {
      title: "1. Digitize Your Closet",
      description: "Snap a photo of your clothes. Our AI vision automatically identifies the fabric, brand, and color so you never lose track of a piece again.",
      icon: Camera
    },
    {
      title: "2. Get Styled by AI",
      description: "Not sure what to wear? Our AI Stylist analyzes your collection and the weather to recommend the perfect look for any occasion.",
      icon: Brain
    },
    {
      title: "3. Plan Your Agenda",
      description: "Use the Style Journal to schedule outfits for the week. Eliminate morning decision fatigue and wake up knowing exactly what looks best.",
      icon: Calendar
    }
  ];

  const CurrentIcon = steps[step].icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-10">
        <DialogHeader className="items-center text-center space-y-6">
          <div className="h-20 w-20 rounded-[2rem] bg-primary/5 flex items-center justify-center text-primary shadow-inner">
            <CurrentIcon className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-3xl font-headline font-bold text-primary italic">{steps[step].title}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground font-body leading-relaxed">
              {steps[step].description}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="flex justify-center gap-2 my-6">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-10 bg-accent' : 'w-2 bg-slate-100'}`} 
            />
          ))}
        </div>

        <DialogFooter className="sm:justify-center">
          {step < steps.length - 1 ? (
            <Button 
              className="rounded-full w-full h-14 gradient-primary text-white font-headline text-lg" 
              onClick={() => setStep(step + 1)}
            >
              Next Step <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              className="rounded-full w-full h-14 gradient-pill text-white font-headline text-lg shadow-xl" 
              onClick={handleClose}
            >
              Start My Style Journey
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
