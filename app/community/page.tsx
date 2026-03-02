"use client";

import { useState, useCallback, useEffect } from "react";
import { Users, Trophy, Lightbulb, Loader2 } from "lucide-react";
import { PostComposer } from "@/components/community/PostComposer";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import type { CommunityPost } from "@/components/community/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type TabType = "check-in" | "weekly-win" | "reflection";

const tabs: Array<{ id: TabType; label: string; icon: any }> = [
	{ id: "check-in", label: "Check-ins", icon: Users },
	{ id: "weekly-win", label: "Weekly Wins", icon: Trophy },
	{ id: "reflection", label: "Reflections", icon: Lightbulb },
];

export default function CommunityPage() {
	const [activeTab, setActiveTab] = useState<TabType>("check-in");
	const [posts, setPosts] = useState<CommunityPost[]>([]);
	const [programs, setPrograms] = useState<Array<{ id: string; title: string }>>([]);
	const [currentUser, setCurrentUser] = useState<{ name: string; initial: string; id: string } | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch current user info
	useEffect(() => {
		fetch("/api/user/me")
			.then((res) => res.json())
			.then((data) => {
				if (data.userId) {
					setCurrentUser({
						name: data.displayName,
						initial: data.initial,
						id: data.userId,
					});
				}
			})
			.catch(() => {
				// Fallback
				setCurrentUser({ name: "You", initial: "Y", id: "" });
			});
	}, []);

	// Fetch programs for dropdown
	useEffect(() => {
		fetch("/api/admin/programs")
			.then((res) => res.json())
			.then((data) => {
				const list = data.programs || data.data || [];
				setPrograms(list.map((p: any) => ({ id: p.id, title: p.title })));
			})
			.catch(() => setPrograms([]));
	}, []);

	// Fetch posts
	useEffect(() => {
		setLoading(true);
		setError(null);
		fetch("/api/community")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to load posts");
				return res.json();
			})
			.then((data) => {
				const apiPosts: CommunityPost[] = (data.posts || []).map((p: any) => ({
					id: p.id,
					userId: p.user_id,
					userName: p.user_name || "Member",
					userInitial: (p.user_name || "M").charAt(0).toUpperCase(),
					content: p.content,
					postType: p.post_type,
					programId: p.program_id || undefined,
					programTitle: undefined, // Could be enriched if needed
					visibility: p.visibility,
					createdAt: p.created_at,
					isOwn: p.isOwn,
				}));
				setPosts(apiPosts);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	const handleSubmitPost = useCallback(
		async (content: string, visibility: "public" | "members_only", programId?: string) => {
			const res = await fetch("/api/community", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content,
					postType: activeTab,
					programId,
					visibility,
				}),
			});

			if (!res.ok) throw new Error("Failed to create post");

			const { post: p } = await res.json();

			const newPost: CommunityPost = {
				id: p.id,
				userId: p.user_id,
				userName: p.user_name || currentUser?.name || "You",
				userInitial: (p.user_name || currentUser?.initial || "Y").charAt(0).toUpperCase(),
				content: p.content,
				postType: p.post_type,
				programId: p.program_id || undefined,
				visibility: p.visibility,
				createdAt: p.created_at,
				isOwn: true,
			};

			setPosts((prev) => [newPost, ...prev]);
		},
		[activeTab, currentUser]
	);

	const handleDeletePost = useCallback(async (postId: string) => {
		// Optimistic removal
		setPosts((prev) => prev.filter((post) => post.id !== postId));

		const res = await fetch(`/api/community/${postId}`, { method: "DELETE" });
		if (!res.ok) {
			// Re-fetch on failure
			fetch("/api/community")
				.then((r) => r.json())
				.then((data) => {
					const apiPosts: CommunityPost[] = (data.posts || []).map((p: any) => ({
						id: p.id,
						userId: p.user_id,
						userName: p.user_name || "Member",
						userInitial: (p.user_name || "M").charAt(0).toUpperCase(),
						content: p.content,
						postType: p.post_type,
						programId: p.program_id || undefined,
						visibility: p.visibility,
						createdAt: p.created_at,
						isOwn: p.isOwn,
					}));
					setPosts(apiPosts);
				});
		}
	}, []);

	return (
		<div className="min-h-screen bg-gradient-zen px-4 py-6 pb-24 sm:px-8 sm:py-12 lg:px-16 text-earth-900 dark:bg-[#0E1012] dark:text-[#F4EFE6]">
			<div className="mx-auto max-w-4xl space-y-6 sm:space-y-10">
				<SectionHeading
					eyebrow="Mindify Community"
					title="Connect with fellow practitioners"
					description="Share your journey, celebrate wins, and learn from others on the nervous system path."
				/>

				{/* Tab Navigation */}
				<div className="relative flex gap-2 overflow-x-auto rounded-3xl border border-sage-100 bg-cream-50/80 p-2 backdrop-blur-sm scrollbar-hide dark:border-white/10 dark:bg-[#13151A]/80">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={`relative flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 active:scale-95 ${
									isActive
										? "bg-gradient-sage text-white shadow-glow"
										: "text-earth-600 hover:bg-sage-50 active:bg-sage-100 dark:text-[#CFC7BB] dark:hover:bg-white/5 dark:active:bg-white/10"
								}`}
							>
								<Icon className={`h-4 w-4 ${isActive ? "animate-scale-in" : ""}`} />
								<span className="whitespace-nowrap">{tab.label}</span>
							</button>
						);
					})}
				</div>

				{/* Post Composer */}
				{currentUser && (
					<PostComposer
						userName={currentUser.name}
						userInitial={currentUser.initial}
						postType={activeTab}
						onSubmit={handleSubmitPost}
						programs={programs}
					/>
				)}

				{/* Loading State */}
				{loading && (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-6 w-6 animate-spin text-sage-500" />
						<span className="ml-2 text-sm text-earth-500 dark:text-[#AFA79B]">Loading posts...</span>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-900/20">
						<p className="text-sm text-red-700 dark:text-red-400">{error}</p>
					</div>
				)}

				{/* Community Feed */}
				{!loading && !error && (
					<CommunityFeed posts={posts} onDeletePost={handleDeletePost} />
				)}
			</div>
		</div>
	);
}
