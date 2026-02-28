'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OutfitsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified Inspiration Gallery in Style Studio
    router.replace('/wardrobe?tab=studio&sub=gallery');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
}
