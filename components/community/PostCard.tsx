"use client";

import { formatDistanceToNow } from "date-fns";
import { Trash2, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";

export interface CommunityPost {
	id: string;
	userId: string;
	userName: string;
	userInitial: string;
	content: string;
	postType: "check-in" | "weekly-win" | "reflection";
	programId?: string;
	programTitle?: string;
	visibility: "public" | "members_only";
	createdAt: string;
	isOwn?: boolean;
}

interface PostCardProps {
	post: CommunityPost;
	onDelete?: (postId: string) => void;
}

const postTypeLabels = {
	"check-in": "Check-in",
	"weekly-win": "Weekly Win",
	reflection: "Reflection",
};

const postTypeColors = {
	"check-in": "border-sage-200 bg-sage-50 text-sage-700 dark:border-sage-700/30 dark:bg-sage-900/20 dark:text-sage-300",
	"weekly-win": "border-gold-200 bg-gold-50 text-gold-700 dark:border-gold-700/30 dark:bg-gold-900/20 dark:text-gold-300",
	reflection: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700/30 dark:bg-purple-900/20 dark:text-purple-300",
};

export function PostCard({ post, onDelete }: PostCardProps) {
	const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="rounded-3xl border border-sage-100 bg-cream-50 p-6 shadow-card dark:border-white/10 dark:bg-[#13151A]"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-3">
					<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-sage text-white font-semibold">
						{post.userInitial}
					</div>
					<div className="flex-1">
						<div className="flex flex-wrap items-center gap-2">
							<h3 className="font-semibold text-earth-900 dark:text-[#F4EFE6]">{post.userName}</h3>
							<span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${postTypeColors[post.postType]}`}>
								{postTypeLabels[post.postType]}
							</span>
							{post.programTitle && (
								<span className="rounded-full border border-sage-100 bg-cream-50 px-2 py-0.5 text-xs text-earth-600 dark:border-white/10 dark:bg-[#111318] dark:text-[#CFC7BB]">
									{post.programTitle}
								</span>
							)}
						</div>
						<div className="mt-1 flex items-center gap-2 text-xs text-earth-500 dark:text-[#AFA79B]">
							<time>{timeAgo}</time>
							{post.visibility === "public" ? (
								<span className="inline-flex items-center gap-1">
									<Globe className="h-3 w-3" />
									Public
								</span>
							) : (
								<span className="inline-flex items-center gap-1">
									<Lock className="h-3 w-3" />
									Members only
								</span>
							)}
						</div>
					</div>
				</div>
				{post.isOwn && onDelete && (
					<button
						type="button"
						onClick={() => onDelete(post.id)}
						className="text-earth-500 hover:text-red-600 transition dark:text-[#AFA79B] dark:hover:text-red-400"
						aria-label="Delete post"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				)}
			</div>
			<p className="mt-4 text-base leading-relaxed text-earth-700 whitespace-pre-wrap dark:text-[#D9D3C8]">
				{post.content}
			</p>
		</motion.article>
	);
}
