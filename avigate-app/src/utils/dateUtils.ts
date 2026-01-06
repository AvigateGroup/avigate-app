// src/utils/dateUtils.ts

/**
 * Format a date to a relative time string (e.g., "5m ago", "2h ago", "3d ago")
 */
export const formatDistanceToNow = (date: string | Date): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

/**
 * Format a date to a readable string (e.g., "Jan 5, 2026")
 */
export const formatDate = (date: string | Date): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return targetDate.toLocaleDateString('en-US', options);
};

/**
 * Format a date to a readable string with time (e.g., "Jan 5, 2026 at 3:45 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const dateStr = targetDate.toLocaleDateString('en-US', dateOptions);
  const timeStr = targetDate.toLocaleTimeString('en-US', timeOptions);
  return `${dateStr} at ${timeStr}`;
};
