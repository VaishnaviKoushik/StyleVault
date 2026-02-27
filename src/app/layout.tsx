import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MobileContainer } from "@/components/MobileContainer";

export const metadata: Metadata = {
  title: 'ClosetAI - Your AI Fashion Stylist',
  description: 'The ultimate AI wardrobe and AR try-on mobile experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-slate-100 min-h-screen flex items-center justify-center">
        <MobileContainer>
          {children}
        </MobileContainer>
        <Toaster />
      </body>
    </html>
  );
}