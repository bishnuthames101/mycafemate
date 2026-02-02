"use client";

import {
  Package,
  PackageX,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle,
  Bell,
  FileText,
  TrendingUp,
  Database,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: string;
  createdAt: string;
  metadata?: any;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClick: () => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onClick,
}: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "LOW_STOCK":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "OUT_OF_STOCK":
        return <PackageX className="h-5 w-5 text-red-600" />;
      case "TRIAL_EXPIRING_SOON":
      case "PAYMENT_DUE":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "TRIAL_EXPIRED":
      case "PAYMENT_OVERDUE":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "SUBSCRIPTION_RENEWED":
      case "SUBSCRIPTION_UPGRADED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "USAGE_LIMIT_WARNING":
      case "DB_LIMIT_EXCEEDED":
      case "API_LIMIT_EXCEEDED":
        return <Database className="h-5 w-5 text-orange-600" />;
      case "NEW_ORDER":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "ORDER_READY":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "DAILY_REPORT_READY":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "border-l-4 border-red-500";
      case "HIGH":
        return "border-l-4 border-orange-500";
      case "NORMAL":
        return "border-l-4 border-blue-500";
      case "LOW":
        return "border-l-4 border-gray-300";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onClick();
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors
        ${!notification.isRead ? "bg-blue-50" : ""}
        ${getPriorityColor(notification.priority)}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 sm:mt-1">
        <div className="scale-90 sm:scale-100">{getIcon(notification.type)}</div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-xs sm:text-sm font-medium text-gray-900 ${
              !notification.isRead ? "font-semibold" : ""
            }`}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1 sm:mt-1.5" />
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{timeAgo}</p>
      </div>
    </div>
  );
}
