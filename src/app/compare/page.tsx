
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompareRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified Style Feed tab in AI Stylist
    router.replace('/ai-stylist?tab=feed');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
}
