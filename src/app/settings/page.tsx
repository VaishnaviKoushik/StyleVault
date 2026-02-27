'use client';

import { Button } from "@/components/ui/button";
import { ChevronRight, LogOut, Settings, Shield, Bell, HelpCircle, Heart, User, Moon, Sparkles } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const menuItems = [
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Shield, label: "Privacy & Security", href: "#" },
  { icon: Heart, label: "Saved Outfits", href: "/outfits" },
  { icon: Settings, label: "App Preferences", href: "#" },
  { icon: HelpCircle, label: "Help Center", href: "#" },
];

const styleTags = ["Minimalist", "Modern", "Casual", "Vintage", "Streetwear", "Formal"];

export default function SettingsPage() {
  return (
    <div className="px-6 space-y-8 animate-in fade-in duration-500">
      <header className="pt-4 flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">My Profile</h2>
        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white rounded-full shadow-sm">
          <Settings className="h-5 w-5 text-[#8E8E93]" />
        </Button>
      </header>

      {/* User Profile Card */}
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/user1/400" 
            alt="User" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-headline font-bold">Alex Chen</h3>
          <p className="text-sm text-[#8E8E93] font-body italic">Wardrobe Explorer</p>
        </div>
      </div>

      {/* Style Preferences */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest px-1">My Style Vibe</h4>
        <div className="flex flex-wrap gap-2">
          {styleTags.map((tag, idx) => (
            <Badge 
              key={tag} 
              variant={idx < 3 ? "default" : "outline"}
              className={cn(
                "rounded-full px-4 py-1.5 font-headline text-xs cursor-pointer transition-all",
                idx < 3 ? "bg-[#6E4AE0] border-none shadow-md" : "bg-white border-none text-[#8E8E93] shadow-sm"
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      {/* Toggles */}
      <div className="space-y-3">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Moon className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-sm font-headline font-bold">Dark Mode</span>
          </div>
          <Switch />
        </div>
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-teal-600" />
            </div>
            <span className="text-sm font-headline font-bold">Demo Mode</span>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.label} className="glass-card rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-98 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#6E4AE0]/5 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-[#6E4AE0]" />
              </div>
              <span className="text-sm font-headline font-bold">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8E8E93]" />
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full h-14 rounded-full border-red-200 text-red-500 font-headline mb-8">
        <LogOut className="mr-2 h-5 w-5" /> Sign Out
      </Button>
    </div>
  );
}

import { cn } from "@/lib/utils";