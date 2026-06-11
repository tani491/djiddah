"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
          </div>
        }
      >
        {children}
      </Suspense>
    </SessionProvider>
  );
}
