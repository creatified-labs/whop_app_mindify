/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 */

"use client";

import React from "react";
import { ErrorState } from "./ui/ErrorState";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8">
          <ErrorState
            title="Something went wrong"
            message={
              process.env.NODE_ENV === "development"
                ? this.state.error?.message
                : "We encountered an error loading this content."
            }
            onRetry={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            type="error"
          />
        </div>
      );
    }

    return this.props.children;
  }
}
