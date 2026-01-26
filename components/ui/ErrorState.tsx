/**
 * Error State Components
 * Beautiful error messages with retry functionality
 */

import { AlertCircle, RefreshCw, WifiOff, Lock, FileQuestion } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: "error" | "network" | "auth" | "notFound";
}

export function ErrorState({
  title,
  message,
  onRetry,
  type = "error",
}: ErrorStateProps) {
  const config = {
    error: {
      icon: AlertCircle,
      defaultTitle: "Something went wrong",
      defaultMessage: "We encountered an error. Please try again.",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-900",
    },
    network: {
      icon: WifiOff,
      defaultTitle: "Connection error",
      defaultMessage: "Unable to connect. Check your internet connection.",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-900",
    },
    auth: {
      icon: Lock,
      defaultTitle: "Authentication required",
      defaultMessage: "Please sign in to continue.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-900",
    },
    notFound: {
      icon: FileQuestion,
      defaultTitle: "Not found",
      defaultMessage: "The content you're looking for doesn't exist.",
      color: "text-gray-500",
      bgColor: "bg-gray-50 dark:bg-gray-900",
      borderColor: "border-gray-200 dark:border-gray-800",
    },
  };

  const { icon: Icon, defaultTitle, defaultMessage, color, bgColor, borderColor } = config[type];

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-8 text-center`}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-950">
        <Icon className={`h-8 w-8 ${color}`} />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title || defaultTitle}
      </h3>

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        {message || defaultMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}

export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
      <p className="flex-1 text-sm text-red-700 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <ErrorState
        title="Oops! Something went wrong"
        message={
          process.env.NODE_ENV === "development"
            ? error.message
            : "We encountered an unexpected error. Our team has been notified."
        }
        onRetry={reset}
        type="error"
      />
    </div>
  );
}
