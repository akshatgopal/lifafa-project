"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useWeddingStore } from "@/store/wedding-store";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Ensures a wedding is selected before rendering protected content.
 *
 * Waits for the Zustand `persist` middleware to rehydrate from localStorage
 * (`hasHydrated`) so we never render children against a stale SSR `wedding=null`.
 * If no wedding is selected after hydration, redirects to `/weddings` with
 * `router.replace` so protected URLs don't pollute back-history.
 */
export function WeddingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const wedding = useWeddingStore((s) => s.wedding);
  const hasHydrated = useWeddingStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !wedding) {
      router.replace("/weddings");
    }
  }, [hasHydrated, wedding, router]);

  if (!hasHydrated || !wedding) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
