'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Brain, Send, User, Sparkles, X } from 'lucide-react';
import { styleVaultChat, type StyleVaultChatInput } from '@/ai/flows/style-vault-chat';
import { MOCK_WARDROBE } from '@/lib/mock-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function StyleVaultChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const chatInput: StyleVaultChatInput = {
        history: messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', content: m.content })),
        message: userMessage,
        wardrobeItems: MOCK_WARDROBE.map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          color: i.color,
          description: i.description,
        })),
      };

      const response = await styleVaultChat(chatInput);
      setMessages((prev) => [...prev, { role: 'model', content: response.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting to my styling engine right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-8 right-8 h-16 px-8 rounded-full gradient-pill shadow-2xl border-glow text-white font-headline text-lg group z-50">
          <Brain className="mr-3 h-6 w-6 group-hover:animate-pulse" />
          Ask StyleVault...
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white border-l shadow-2xl flex flex-col">
        <SheetHeader className="p-6 bg-primary text-white border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <SheetTitle className="text-white font-headline text-xl">AI Stylist</SheetTitle>
              <p className="text-xs text-white/70 font-body">Personal styling advice powered by StyleVault</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-primary opacity-20" />
                </div>
                <div className="space-y-2">
                  <p className="font-headline font-bold text-lg text-slate-800">Hello, I'm your StyleVault Stylist.</p>
                  <p className="text-sm text-slate-500 font-body max-w-xs mx-auto">
                    Ask me anything about your wardrobe, current trends, or what to wear for a special occasion.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['What should I wear today?', 'Suggest an outfit for a gala', 'Style my white shirt'].map((suggestion) => (
                    <Button 
                      key={suggestion} 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full text-[10px] font-headline border-slate-100 text-slate-400 hover:text-primary hover:border-primary"
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn(
                "flex flex-col max-w-[85%] space-y-2",
                m.role === 'user' ? "ml-auto items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm font-body shadow-sm leading-relaxed",
                  m.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-slate-100 text-slate-800 rounded-tl-none"
                )}>
                  {m.content}
                </div>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1">
                  {m.role === 'user' ? 'You' : 'Stylist'}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-slate-50/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Message your stylist..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="h-12 rounded-full border-slate-200 bg-white shadow-sm font-body px-6"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || loading}
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shrink-0 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-[9px] text-center text-slate-400 mt-4 font-body uppercase tracking-widest">
            AI Stylist can make mistakes. Verify important style choices.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
