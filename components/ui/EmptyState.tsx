/**
 * Empty State Components
 * Helpful messages when there's no data
 */

import { Heart, BookOpen, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
      {icon && (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/20">
          {icon}
        </div>
      )}

      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>

      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function NoFavorites() {
  return (
    <EmptyState
      icon={<Heart className="h-10 w-10 text-purple-500" />}
      title="No favorites yet"
      description="Start exploring meditations, programs, and sessions. Tap the heart icon to save your favorites."
      action={{
        label: "Explore Meditations",
        href: "/meditations",
      }}
    />
  );
}

export function NoPrograms() {
  return (
    <EmptyState
      icon={<TrendingUp className="h-10 w-10 text-purple-500" />}
      title="No active programs"
      description="Choose a transformation program to begin your journey. Each program includes daily sessions and guided activities."
      action={{
        label: "Browse Programs",
        href: "/programs",
      }}
    />
  );
}

export function NoJournalEntries() {
  return (
    <EmptyState
      icon={<BookOpen className="h-10 w-10 text-purple-500" />}
      title="No journal entries yet"
      description="Complete today's session and reflect on your practice. Your journal helps track insights and progress."
      action={{
        label: "Start Today's Session",
        href: "#",
      }}
    />
  );
}

export function NoActivity() {
  return (
    <EmptyState
      icon={<Sparkles className="h-10 w-10 text-purple-500" />}
      title="No activity yet"
      description="Complete a meditation, hypnosis session, or quick reset to start tracking your progress and building your streak."
      action={{
        label: "Get Started",
        href: "/meditations",
      }}
    />
  );
}

export function NoCommunityPosts() {
  return (
    <EmptyState
      icon={<Users className="h-10 w-10 text-purple-500" />}
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
  return (
    <EmptyState
      icon={<BookOpen className="h-10 w-10 text-gray-400" />}
      title="No results found"
      description={`We couldn't find any content matching "${query}". Try adjusting your search or browse all content.`}
      action={{
        label: "Clear Search",
        href: "#",
      }}
    />
  );
}
