"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/LoginContext";

export default function ProtectedRoute({ children }) {
  const { loading, accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[ProtectedRoute] state update:', { loading, accessToken });
    if (!loading && !accessToken) {
      console.log(`[ProtectedRoute] REDIRECTING to / : loading=${loading}, accessToken=${accessToken}`)
      router.replace("/"); // redirect to login
    }
  }, [loading, accessToken, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!accessToken) return null; // prevent flicker before redirect

  return <>{children}</>;
}
