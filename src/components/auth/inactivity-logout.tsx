"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";

interface InactivityLogoutProps {
  timeoutMinutes: number;
}

/**
 * Client-side inactivity auto-logout.
 * Monitors user activity (mouse, keyboard, touch, scroll) and
 * signs the user out after the specified period of inactivity.
 * No database connections or API calls until logout is triggered.
 */
export function InactivityLogout({ timeoutMinutes }: InactivityLogoutProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutMs = timeoutMinutes * 60 * 1000;

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    window.location.href = "/login?reason=inactivity";
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(handleLogout, timeoutMs);
  }, [handleLogout, timeoutMs]);

  useEffect(() => {
    const events = ["mousedown", "keydown", "touchstart", "scroll", "mousemove"];

    // Throttle event handler to avoid excessive timer resets
    let lastReset = Date.now();
    const throttledReset = () => {
      const now = Date.now();
      if (now - lastReset > 30000) {
        // Only reset every 30 seconds
        lastReset = now;
        resetTimer();
      }
    };

    // Start the timer
    resetTimer();

    // Listen for user activity
    events.forEach((event) => {
      window.addEventListener(event, throttledReset, { passive: true });
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, throttledReset);
      });
    };
  }, [resetTimer]);

  // This component renders nothing
  return null;
}
