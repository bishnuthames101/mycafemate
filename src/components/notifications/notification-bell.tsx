"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";
import { playNotificationSound } from "@/lib/utils/notification-sound";

interface NotificationBellProps {
  locationId?: string;
}

export function NotificationBell({ locationId }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const previousCountRef = useRef<number>(0);
  const hasInteractedRef = useRef(false);
  const isFirstFetchRef = useRef(true);

  // Track user interaction to enable sound (browsers require interaction first)
  useEffect(() => {
    const handleInteraction = () => {
      hasInteractedRef.current = true;
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.set("locationId", locationId);

      const response = await fetch(`/api/notifications/count?${params}`);
      if (!response.ok) return;

      const data = await response.json();
      const newCount = data.count || 0;

      // Play sound if count increased (but not on first load)
      if (!isFirstFetchRef.current && newCount > previousCountRef.current && hasInteractedRef.current) {
        playNotificationSound();
      }

      previousCountRef.current = newCount;
      isFirstFetchRef.current = false;
      setUnreadCount(newCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [locationId]);

  // Poll for unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Refresh count when dropdown closes
  const handleDropdownClose = () => {
    setIsOpen(false);
    fetchUnreadCount();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => handleDropdownClose()}
          />

          {/* Dropdown */}
          <div className="fixed sm:absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 top-16 sm:right-0 sm:top-12 z-50">
            <NotificationDropdown
              locationId={locationId}
              onClose={() => handleDropdownClose()}
            />
          </div>
        </>
      )}
    </div>
  );
}
