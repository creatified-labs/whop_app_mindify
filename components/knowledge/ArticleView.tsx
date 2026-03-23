"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkIcon, Share2Icon, XIcon, HeadphonesIcon, CheckIcon, FileAudioIcon, VideoIcon, ExternalLinkIcon } from "lucide-react";
import { useAudioStore } from "@/lib/stores/audioStore";
import type { KnowledgeArticle } from "@/lib/types";

const categoryColors: Record<string, string> = {
	neuroscience: "from-indigo-600/50 to-purple-500/30",
	psychology: "from-violet-600/50 to-fuchsia-500/30",
	breathwork: "from-teal-600/50 to-cyan-500/30",
	sleep: "from-blue-800/50 to-indigo-600/30",
	focus: "from-amber-600/50 to-orange-500/30",
	productivity: "from-emerald-600/50 to-teal-500/30",
};

type ArticleViewProps = {
	article: KnowledgeArticle;
	onClose: () => void;
	onNavigate?: (slug: string) => void;
	relatedArticles?: KnowledgeArticle[];
	isBookmarked?: boolean;
	onToggleBookmark?: (slug: string) => void;
};

export function ArticleView({ article, onClose, onNavigate, relatedArticles = [], isBookmarked = false, onToggleBookmark }: ArticleViewProps) {
	const [bookmarked, setBookmarked] = useState(isBookmarked);
	useEffect(() => { setBookmarked(isBookmarked); }, [isBookmarked]);
	const [copied, setCopied] = useState(false);
	const { playTrack } = useAudioStore((state) => ({ playTrack: state.playTrack }));

	const articleAudioTrack = useMemo(() => {
		if (article.audioTrack) return article.audioTrack;
		return {
			id: `article-${article.slug}`,
			title: article.title,
			duration: article.readTimeMinutes * 60,
			audioUrl: `/audio/articles/${article.slug}.mp3`,
			trackType: "program" as const,
			description: "Narrated Mindify Knowledge Hub article",
		};
	}, [article]);

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/knowledge/${article.slug}`);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	const handleBookmark = () => {
		setBookmarked((prev) => !prev);
		onToggleBookmark?.(article.slug);
	};

	const handlePlayAudio = () => {
		playTrack(articleAudioTrack);
	};

	const gradient = categoryColors[article.category] ?? categoryColors.neuroscience;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-xl"
			>
				<motion.article
					initial={{ translateY: 80, opacity: 0 }}
					animate={{ translateY: 0, opacity: 1 }}
					exit={{ translateY: 40, opacity: 0 }}
					transition={{ type: "spring", stiffness: 120, damping: 18 }}
					className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[36px] border border-[rgb(var(--sage-100))] bg-white text-[rgb(var(--earth-900))] shadow-card dark:border-white/10 dark:bg-gradient-to-br dark:from-[#050711] dark:via-[#0B1022] dark:to-[#05060C] dark:text-white dark:shadow-[0_40px_120px_rgba(4,6,22,0.8)]"
				>
					<button
						type="button"
						onClick={onClose}
						className="absolute right-6 top-6 z-10 rounded-full border border-[rgb(var(--sage-200))] bg-white/80 p-2 text-[rgb(var(--earth-600))] hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:bg-black/40 dark:text-white/70 dark:hover:border-white/50"
						aria-label="Close article"
					>
						<XIcon className="h-5 w-5" />
					</button>
					<div className="flex h-full flex-col overflow-hidden">
						<div className={`relative h-64 w-full bg-gradient-to-br ${gradient}`}>
							<div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#05060C]" />
							<div className="absolute bottom-6 left-6 space-y-2">
								<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">{article.category}</p>
								<h1 className="text-3xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">{article.title}</h1>
								<p className="text-sm text-[rgb(var(--earth-600))] dark:text-white/70">
									By {article.author} • Updated {article.updatedAt} • {article.readTimeMinutes}-min read
								</p>
							</div>
						</div>
						<div className="flex flex-1 flex-col overflow-hidden px-8 py-6">
							<div className="flex flex-wrap items-center gap-3">
								<button
									type="button"
									onClick={handlePlayAudio}
									className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--sage-200))] px-4 py-2 text-sm text-[rgb(var(--earth-700))] hover:border-[rgb(var(--sage-400))] dark:border-white/20 dark:text-white/80 dark:hover:border-white/40"
								>
									<HeadphonesIcon className="h-4 w-4" />
									Listen to audio
								</button>
								<button
									type="button"
									onClick={handleBookmark}
									className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
										bookmarked ? "border-mindify-mist text-mindify-mist" : "border-[rgb(var(--sage-200))] text-[rgb(var(--earth-600))] dark:border-white/20 dark:text-white/70"
									}`}
								>
									<BookmarkIcon className="h-4 w-4" />
									{bookmarked ? "Saved" : "Save for later"}
								</button>
								<button
									type="button"
									onClick={handleShare}
									className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--sage-200))] px-4 py-2 text-sm text-[rgb(var(--earth-600))] hover:border-[rgb(var(--sage-400))] dark:border-white/20 dark:text-white/70 dark:hover:border-white/40"
								>
									{copied ? <CheckIcon className="h-4 w-4 text-mindify-mist" /> : <Share2Icon className="h-4 w-4" />}
									{copied ? "Link copied" : "Share"}
								</button>
							</div>
							<div className="mt-5 flex-1 overflow-y-auto pr-2">
								<div className="prose max-w-none prose-headings:font-semibold prose-headings:text-[rgb(var(--earth-900))] prose-p:text-[rgb(var(--earth-700))] prose-li:text-[rgb(var(--earth-700))] dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-white/80 dark:prose-li:text-white/80">
									{/* eslint-disable-next-line react/no-danger */}
									<div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br/>") }} />
								</div>
								<div className="mt-6 rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 dark:border-white/15 dark:bg-white/5">
									<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">Key Takeaways</p>
									<ul className="mt-3 space-y-2 text-sm text-[rgb(var(--earth-700))] dark:text-white/80">
										{article.keyTakeaways.map((item) => (
											<li key={item} className="flex items-start gap-3">
												<span className="mt-1 h-2 w-2 rounded-full bg-mindify-lagoon" />
												{item}
											</li>
										))}
									</ul>
								</div>
								<div className="mt-4 rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 dark:border-white/15 dark:bg-white/5">
									<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">Actionable Steps</p>
									<ol className="mt-3 space-y-2 text-sm text-[rgb(var(--earth-700))] list-decimal pl-5 dark:text-white/80">
										{article.actionSteps.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ol>
								</div>
								<div className="mt-4 rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 dark:border-white/15 dark:bg-black/30">
									<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">Recommended Sessions</p>
									<div className="mt-3 grid gap-3 md:grid-cols-2">
										{article.recommendedSessions.map((session) => (
											<div key={session.id} className="rounded-2xl border border-[rgb(var(--sage-100))] bg-white p-3 text-sm dark:border-white/15 dark:bg-white/5">
												<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-400))] dark:text-white/40">{session.type}</p>
												<p className="text-[rgb(var(--earth-700))] dark:text-white/80">{session.title}</p>
												<button
													type="button"
													onClick={() =>
														onNavigate?.(session.id) ??
														playTrack({
															id: session.id,
															title: session.title,
															trackType: session.type === "meditation" ? "meditation" : "hypnosis",
															audioUrl: `/audio/${session.id}.mp3`,
															duration: 600,
														})
													}
													className="mt-2 text-xs font-semibold text-mindify-lagoon"
												>
													Play session →
												</button>
											</div>
										))}
									</div>
								</div>
								<div className="mt-4 rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 dark:border-white/15 dark:bg-black/20">
									<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">References</p>
									<ul className="mt-3 space-y-2 text-sm text-[rgb(var(--earth-600))] list-disc pl-5 dark:text-white/70">
										{article.references.map((ref) => (
											<li key={ref}>{ref}</li>
										))}
									</ul>
								</div>
								{article.attachments && article.attachments.length > 0 && (
									<div className="mt-4 rounded-3xl border border-[rgb(var(--sage-100))] bg-[rgb(var(--cream-50))] p-5 dark:border-white/15 dark:bg-white/5">
										<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">Media & Resources</p>
										<div className="mt-3 space-y-3">
											{article.attachments.map((attachment) => {
												const Icon = attachment.type === "audio" ? FileAudioIcon : attachment.type === "video" ? VideoIcon : ExternalLinkIcon;
												return (
													<a
														key={attachment.url}
														href={attachment.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--sage-100))] bg-white p-3 text-sm transition hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
													>
														<Icon className="h-5 w-5 flex-shrink-0 text-[rgb(var(--sage-600))]" />
														<div className="min-w-0 flex-1">
															<p className="truncate font-medium text-[rgb(var(--earth-900))] dark:text-white">{attachment.title}</p>
															<p className="text-xs capitalize text-[rgb(var(--earth-500))] dark:text-white/50">{attachment.type}</p>
														</div>
													</a>
												);
											})}
										</div>
									</div>
								)}
							{relatedArticles.length > 0 && (
									<div className="mt-6">
										<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">Related Articles</p>
										<div className="mt-3 grid gap-3 md:grid-cols-2">
											{relatedArticles.map((related) => (
												<button
													type="button"
													key={related.slug}
													onClick={() => onNavigate?.(related.slug)}
													className="rounded-3xl border border-[rgb(var(--sage-100))] bg-white p-4 text-left transition hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
												>
													<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/50">{related.category}</p>
													<p className="mt-2 font-semibold text-[rgb(var(--earth-900))] dark:text-white">{related.title}</p>
													<p className="text-xs text-[rgb(var(--earth-500))] dark:text-white/50">{related.readTimeMinutes}-min read</p>
												</button>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</motion.article>
			</motion.div>
		</AnimatePresence>
	);
}
