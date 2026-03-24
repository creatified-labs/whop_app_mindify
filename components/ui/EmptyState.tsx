"use client";

/**
 * Empty State Components
 * Helpful messages when there's no data
 */

import { Heart, BookOpen, Sparkles, TrendingUp, Users } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[rgb(var(--sage-100))] bg-white p-12 text-center dark:border-white/10 dark:bg-[#13151A]">
      {icon && (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--sage-50))] dark:bg-[rgb(var(--sage-900))]/20">
          {icon}
        </div>
      )}

      <h3 className="mb-2 text-xl font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
        {title}
      </h3>

      <p className="mb-6 max-w-sm text-sm text-[rgb(var(--earth-600))] dark:text-[#CFC7BB]">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--sage-600))] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[rgb(var(--sage-700))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-500))] focus:ring-offset-2 dark:focus:ring-offset-[#0E1012]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function NoFavorites() {
  const setNavSelection = useAppStore((state) => state.setNavSelection);
  return (
    <EmptyState
      icon={<Heart className="h-10 w-10 text-[rgb(var(--sage-600))]" />}
      title="No favorites yet"
      description="Start exploring meditations, programs, and sessions. Tap the heart icon to save your favorites."
      action={{
        label: "Explore Meditations",
        onClick: () => setNavSelection("meditations"),
      }}
    />
  );
}

export function NoPrograms() {
  const setNavSelection = useAppStore((state) => state.setNavSelection);
  return (
    <EmptyState
      icon={<TrendingUp className="h-10 w-10 text-[rgb(var(--sage-600))]" />}
      title="No active programs"
      description="Choose a transformation program to begin your journey. Each program includes daily sessions and guided activities."
      action={{
        label: "Browse Programs",
        onClick: () => setNavSelection("programs"),
      }}
    />
  );
}

export function NoJournalEntries() {
  const setNavSelection = useAppStore((state) => state.setNavSelection);
  return (
    <EmptyState
      icon={<BookOpen className="h-10 w-10 text-[rgb(var(--sage-600))]" />}
      title="No journal entries yet"
      description="Complete today's session and reflect on your practice. Your journal helps track insights and progress."
      action={{
        label: "Start Today's Session",
        onClick: () => setNavSelection("meditations"),
      }}
    />
  );
}

export function NoActivity() {
  const setNavSelection = useAppStore((state) => state.setNavSelection);
  return (
    <EmptyState
      icon={<Sparkles className="h-10 w-10 text-[rgb(var(--sage-600))]" />}
      title="No activity yet"
      description="Complete a meditation, hypnosis session, or quick reset to start tracking your progress and building your streak."
      action={{
        label: "Get Started",
        onClick: () => setNavSelection("meditations"),
      }}
    />
  );
}

export function NoCommunityPosts() {
  return (
    <EmptyState
      icon={<Users className="h-10 w-10 text-[rgb(var(--sage-600))]" />}
      title="No posts yet"
      description="Be the first to share your journey! Post a check-in, weekly win, or reflection to connect with the community."
      action={{
        label: "Share Your First Post",
        onClick: () => {},
      }}
    />
  );
}

export function SearchEmpty({ query }: { query: string }) {
  const setNavSelection = useAppStore((state) => state.setNavSelection);
  return (
    <EmptyState
      icon={<BookOpen className="h-10 w-10 text-[rgb(var(--earth-400))]" />}
      title="No results found"
      description={`We couldn't find any content matching "${query}". Try adjusting your search or browse all content.`}
      action={{
        label: "Clear Search",
        onClick: () => setNavSelection("dashboard"),
      }}
    />
  );
}
