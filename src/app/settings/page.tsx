'use client';

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, LogOut, Settings, Shield, Bell, HelpCircle, Heart, User, Moon, Sparkles, Palette, Smartphone, Sun } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Bell, label: "Notifications", desc: "Manage alerts for weather and planners", href: "#" },
  { icon: Shield, label: "Privacy & Security", desc: "Control your data and account access", href: "#" },
  { icon: Heart, label: "Saved Outfits", desc: "Quick access to your favorite looks", href: "/outfits" },
  { icon: Smartphone, label: "Connected Devices", desc: "Sync with your smart mirror or watch", href: "#" },
  { icon: HelpCircle, label: "Help Center", desc: "Support and platform documentation", href: "#" },
];

const styleTags = ["Minimalist", "Modern", "Casual", "Vintage", "Streetwear", "Formal"];

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <h2 className="text-4xl font-headline font-bold text-foreground">User Preferences</h2>
          <Button variant="outline" className="rounded-full h-12 px-6 font-headline flex items-center gap-2">
            <Settings className="h-4 w-4" /> Global Settings
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white dark:bg-card overflow-hidden text-center p-8">
              <div className="relative mx-auto w-32 h-32 rounded-full border-8 border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden mb-6">
                <Image 
                  src="https://picsum.photos/seed/user1/400" 
                  alt="User" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-headline font-bold text-card-foreground">Alex Chen</h3>
                <p className="text-sm text-muted-foreground font-body italic">Premium Fashion Curator</p>
              </div>
              <div className="flex justify-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none font-headline uppercase text-[10px] px-3">Level 12</Badge>
                <Badge className="bg-accent/10 text-accent border-none font-headline uppercase text-[10px] px-3">Elite Stylist</Badge>
              </div>
            </Card>

            <Card className="border-none shadow-lg bg-white dark:bg-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">My Style Persona</h4>
              <div className="flex flex-wrap gap-2">
                {styleTags.map((tag, idx) => (
                  <Badge 
                    key={tag} 
                    variant={idx < 3 ? "default" : "outline"}
                    className={cn(
                      "rounded-full px-4 py-2 font-headline text-xs cursor-pointer transition-all",
                      idx < 3 ? "bg-primary border-none shadow-md" : "bg-transparent border-slate-100 dark:border-slate-800 text-muted-foreground"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg bg-white dark:bg-card overflow-hidden">
              <CardHeader className="bg-slate-50/50 dark:bg-white/5">
                <CardTitle className="text-xl font-headline text-card-foreground">Interface & Experience</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y dark:divide-white/5">
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        {isDarkMode ? <Moon className="h-6 w-6 text-indigo-400" /> : <Sun className="h-6 w-6 text-indigo-600" />}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-card-foreground">Night Mode</p>
                        <p className="text-sm text-muted-foreground font-body">Optimize visual comfort for dark environments</p>
                      </div>
                    </div>
                    <Switch 
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <p className="font-headline font-bold text-card-foreground">Generative Styling</p>
                        <p className="text-sm text-muted-foreground font-body">Allow AI to propose creative item combinations</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {menuItems.map((item) => (
                <Card key={item.label} className="border-none shadow-md bg-white dark:bg-card hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-headline font-bold text-lg text-card-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full h-16 rounded-full border-red-100 dark:border-red-900/50 text-red-500 font-headline text-lg hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 shadow-sm mt-4">
              <LogOut className="mr-2 h-5 w-5" /> Terminate Session
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}