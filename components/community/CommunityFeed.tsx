"use client";

import { useState, useMemo } from "react";
import { PostCard, type CommunityPost } from "./PostCard";
import { NoCommunityPosts } from "@/components/ui/EmptyState";

interface CommunityFeedProps {
	posts: CommunityPost[];
	onDeletePost?: (postId: string) => void;
}

export function CommunityFeed({ posts, onDeletePost }: CommunityFeedProps) {
	const [filter, setFilter] = useState<"all" | "check-in" | "weekly-win" | "reflection">("all");

	const filteredPosts = useMemo(() => {
		if (filter === "all") return posts;
		return posts.filter((post) => post.postType === filter);
	}, [posts, filter]);

	const sortedPosts = useMemo(() => {
		return [...filteredPosts].sort((a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}, [filteredPosts]);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => setFilter("all")}
					className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition ${
						filter === "all"
							? "border-sage-300 bg-sage-100 text-sage-700 dark:border-sage-700/50 dark:bg-sage-900/30 dark:text-sage-300"
							: "border-sage-100 text-earth-500 hover:border-sage-200 dark:border-white/10 dark:text-[#AFA79B] dark:hover:border-white/20"
					}`}
				>
					All
				</button>
				<button
					type="button"
					onClick={() => setFilter("check-in")}
					className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition ${
						filter === "check-in"
							? "border-sage-300 bg-sage-100 text-sage-700 dark:border-sage-700/50 dark:bg-sage-900/30 dark:text-sage-300"
							: "border-sage-100 text-earth-500 hover:border-sage-200 dark:border-white/10 dark:text-[#AFA79B] dark:hover:border-white/20"
					}`}
				>
					Check-ins
				</button>
				<button
					type="button"
					onClick={() => setFilter("weekly-win")}
					className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition ${
						filter === "weekly-win"
							? "border-sage-300 bg-sage-100 text-sage-700 dark:border-sage-700/50 dark:bg-sage-900/30 dark:text-sage-300"
							: "border-sage-100 text-earth-500 hover:border-sage-200 dark:border-white/10 dark:text-[#AFA79B] dark:hover:border-white/20"
					}`}
				>
					Weekly Wins
				</button>
				<button
					type="button"
					onClick={() => setFilter("reflection")}
					className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition ${
						filter === "reflection"
							? "border-sage-300 bg-sage-100 text-sage-700 dark:border-sage-700/50 dark:bg-sage-900/30 dark:text-sage-300"
							: "border-sage-100 text-earth-500 hover:border-sage-200 dark:border-white/10 dark:text-[#AFA79B] dark:hover:border-white/20"
					}`}
				>
					Reflections
				</button>
			</div>

			{sortedPosts.length > 0 ? (
				<div className="space-y-4">
					{sortedPosts.map((post) => (
						<PostCard key={post.id} post={post} onDelete={onDeletePost} />
					))}
				</div>
			) : (
				<NoCommunityPosts />
			)}
		</div>
	);
}
