"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { getAdminAccount } from "@/libs/auth";
import { App } from "antd";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, clearUser } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasCheckedRef = useRef<string | null>(null); // Track which pathname was checked
  const checkingRef = useRef(false);
  const { message } = App.useApp();

  // Wait for persist hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Don't check if not hydrated yet
    if (!isHydrated) {
      return;
    }

    // Skip auth check for signin page - don't check at all
    if (pathname === "/signin" || pathname?.startsWith("/signin")) {
      setIsChecking(false);
      hasCheckedRef.current = pathname;
      // If already authenticated and on signin page, redirect to home
      if (user) {
        router.replace("/");
      }
      return;
    }

    // Don't check if already checking or already checked for this exact pathname
    if (checkingRef.current || hasCheckedRef.current === pathname) {
      return;
    }

    const checkAuth = async () => {
      // Prevent multiple simultaneous checks
      if (checkingRef.current) {
        return;
      }

      checkingRef.current = true;
      setIsChecking(true);

      try {
        // First try to get user from backend (most reliable)
        // This will check cookies sent from the browser
        try {
          const result = await getAdminAccount();
          const currentUser = result?.user;

          // Check if user has admin or staff role
          if (currentUser && (currentUser.role === "admin" || currentUser.role === "staff")) {
            // User is authenticated and has permission
            setUser(currentUser);
            setIsChecking(false);
            hasCheckedRef.current = pathname;
            checkingRef.current = false;
          } else {
            // User doesn't have permission or not authenticated
            clearUser();
            setIsChecking(false);
            hasCheckedRef.current = pathname;
            checkingRef.current = false;
            // Only redirect if not already on signin page
            if (pathname !== "/signin" && !pathname?.startsWith("/signin")) {
              router.replace("/signin");
            }
          }
        } catch (error: any) {
          // Not authenticated or error - check if it's a 401/403
          const isAuthError = error?.message?.includes("Chưa đăng nhập") || 
                              error?.message?.includes("Không có quyền");
          
          if (isAuthError) {
            clearUser();
            setIsChecking(false);
            hasCheckedRef.current = pathname;
            checkingRef.current = false;
            // Only redirect if not already on signin page
            if (pathname !== "/signin" && !pathname?.startsWith("/signin")) {
              router.replace("/signin");
            }
          } else {
            // Other error, allow page to render but user will be null
            setIsChecking(false);
            hasCheckedRef.current = pathname;
            checkingRef.current = false;
          }
        }
      } catch (error: any) {
        // Unexpected error - allow page to render but log error
        setIsChecking(false);
        hasCheckedRef.current = pathname;
        checkingRef.current = false;
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isHydrated]); // Only depend on pathname and hydration

  // If on signin page and already authenticated, redirect to home
  if (pathname === "/signin" && user) {
    router.replace("/");
    return null;
  }

  // Show children while checking (no loading UI, just check in background)
  // If not authenticated, redirect will happen in useEffect
  return <>{children}</>;
}

