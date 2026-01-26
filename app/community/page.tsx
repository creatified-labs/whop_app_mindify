"use client";

import { useState, useCallback } from "react";
import { Users, Trophy, Lightbulb } from "lucide-react";
import { PostComposer } from "@/components/community/PostComposer";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import type { CommunityPost } from "@/components/community/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Mock data - in production, this would come from the API
const mockPosts: CommunityPost[] = [
	{
		id: "1",
		userId: "user_123",
		userName: "Sarah Chen",
		userInitial: "S",
		content: "Just completed day 5 of the NeuroLeadership program. The polyvagal mapping practice was intense but transformative. Already noticing better stress responses in daily situations.",
		postType: "check-in",
		programId: "neuro-leadership",
		programTitle: "NeuroLeadership Reset",
		visibility: "members_only",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		isOwn: false,
	},
	{
		id: "2",
		userId: "user_456",
		userName: "Marcus Silva",
		userInitial: "M",
		content: "This week I managed to maintain a 7-day meditation streak while launching a product. The morning rituals made all the difference in staying centered during high-pressure moments.",
		postType: "weekly-win",
		visibility: "public",
		createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		isOwn: false,
	},
	{
		id: "3",
		userId: "user_789",
		userName: "Elena Rodriguez",
		userInitial: "E",
		content: "Interesting observation: after 3 weeks of consistent breathwork, I'm noticing my HRV baseline has increased by 15ms. The connection between conscious breathing and nervous system regulation is real.",
		postType: "reflection",
		programId: "focus-mastery",
		programTitle: "Focus Mastery",
		visibility: "members_only",
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		isOwn: false,
	},
];

const mockPrograms = [
	{ id: "neuro-leadership", title: "NeuroLeadership Reset" },
	{ id: "focus-mastery", title: "Focus Mastery" },
	{ id: "sleep-optimization", title: "Sleep Optimization" },
];

type TabType = "check-in" | "weekly-win" | "reflection";

const tabs: Array<{ id: TabType; label: string; icon: any }> = [
	{ id: "check-in", label: "Check-ins", icon: Users },
	{ id: "weekly-win", label: "Weekly Wins", icon: Trophy },
	{ id: "reflection", label: "Reflections", icon: Lightbulb },
];

export default function CommunityPage() {
	const [activeTab, setActiveTab] = useState<TabType>("check-in");
	const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);

	// Mock current user
	const currentUser = {
		name: "You",
		initial: "Y",
		id: "current_user",
	};

	const handleSubmitPost = useCallback(
		async (content: string, visibility: "public" | "members_only", programId?: string) => {
			// In production, this would call the API endpoint
			const newPost: CommunityPost = {
				id: `post_${Date.now()}`,
				userId: currentUser.id,
				userName: currentUser.name,
				userInitial: currentUser.initial,
				content,
				postType: activeTab,
				programId,
				programTitle: programId ? mockPrograms.find((p) => p.id === programId)?.title : undefined,
				visibility,
				createdAt: new Date().toISOString(),
				isOwn: true,
			};

			setPosts((prev) => [newPost, ...prev]);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));
		},
		[activeTab, currentUser]
	);

	const handleDeletePost = useCallback((postId: string) => {
		// In production, this would call the API endpoint
		setPosts((prev) => prev.filter((post) => post.id !== postId));
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
				<PostComposer
					userName={currentUser.name}
					userInitial={currentUser.initial}
					postType={activeTab}
					onSubmit={handleSubmitPost}
					programs={mockPrograms}
				/>

				{/* Community Feed */}
				<CommunityFeed posts={posts} onDeletePost={handleDeletePost} />
			</div>
		</div>
	);
}
