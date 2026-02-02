"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";

interface NotificationBellProps {
  locationId?: string;
}

export function NotificationBell({ locationId }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.set("locationId", locationId);

      const response = await fetch(`/api/notifications/count?${params}`);
      if (!response.ok) return;

      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Poll for unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [locationId]);

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
