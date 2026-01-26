"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkIcon, Share2Icon, XIcon, HeadphonesIcon, CheckIcon } from "lucide-react";
import { useAudioStore } from "@/lib/stores/audioStore";
import type { KnowledgeArticle } from "@/lib/mockData/articles";

type ArticleViewProps = {
	article: KnowledgeArticle;
	onClose: () => void;
	onNavigate?: (slug: string) => void;
	relatedArticles?: KnowledgeArticle[];
};

export function ArticleView({ article, onClose, onNavigate, relatedArticles = [] }: ArticleViewProps) {
	const [bookmarked, setBookmarked] = useState(false);
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
	};

	const handlePlayAudio = () => {
		playTrack(articleAudioTrack);
	};

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
					className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#050711] via-[#0B1022] to-[#05060C] text-white shadow-[0_40px_120px_rgba(4,6,22,0.8)]"
				>
					<button
						type="button"
						onClick={onClose}
						className="absolute right-6 top-6 rounded-full border border-white/15 bg-black/40 p-2 text-white/70 hover:border-white/50"
						aria-label="Close article"
					>
						<XIcon className="h-5 w-5" />
					</button>
					<div className="flex h-full flex-col overflow-hidden">
						<div className="relative h-64 w-full overflow-hidden">
							<Image
								src={article.thumbnail}
								alt={article.title}
								fill
								className="object-cover opacity-70"
								unoptimized
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#05060C] via-transparent to-transparent" />
							<div className="absolute bottom-6 left-6 space-y-2">
								<p className="text-xs uppercase tracking-[0.4em] text-white/60">{article.category}</p>
								<h1 className="text-3xl font-semibold">{article.title}</h1>
								<p className="text-sm text-white/70">
									By {article.author} • Updated {article.updatedAt} • {article.readTimeMinutes}-min read
								</p>
							</div>
						</div>
						<div className="flex flex-1 flex-col overflow-hidden px-8 py-6">
							<div className="flex flex-wrap items-center gap-3">
								<button
									type="button"
									onClick={handlePlayAudio}
									className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/40"
								>
									<HeadphonesIcon className="h-4 w-4" />
									Listen to audio
								</button>
								<button
									type="button"
									onClick={handleBookmark}
									className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
										bookmarked ? "border-mindify-mist text-mindify-mist" : "border-white/20 text-white/70"
									}`}
								>
									<BookmarkIcon className="h-4 w-4" />
									{bookmarked ? "Saved" : "Save for later"}
								</button>
								<button
									type="button"
									onClick={handleShare}
									className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 hover:border-white/40"
								>
									{copied ? <CheckIcon className="h-4 w-4 text-mindify-mist" /> : <Share2Icon className="h-4 w-4" />}
									{copied ? "Link copied" : "Share"}
								</button>
							</div>
							<div className="mt-5 flex-1 overflow-y-auto pr-2">
								<div className="prose prose-invert max-w-none prose-headings:font-semibold prose-p:text-white/80 prose-li:text-white/80">
									{/* eslint-disable-next-line react/no-danger */}
									<div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br/>") }} />
								</div>
								<div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-5">
									<p className="text-xs uppercase tracking-[0.4em] text-white/60">Key Takeaways</p>
									<ul className="mt-3 space-y-2 text-sm text-white/80">
										{article.keyTakeaways.map((item) => (
											<li key={item} className="flex items-start gap-3">
												<span className="mt-1 h-2 w-2 rounded-full bg-mindify-lagoon" />
												{item}
											</li>
										))}
									</ul>
								</div>
								<div className="mt-4 rounded-3xl border border-white/15 bg-white/5 p-5">
									<p className="text-xs uppercase tracking-[0.4em] text-white/60">Actionable Steps</p>
									<ol className="mt-3 space-y-2 text-sm text-white/80 list-decimal pl-5">
										{article.actionSteps.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ol>
								</div>
								<div className="mt-4 rounded-3xl border border-white/15 bg-black/30 p-5">
									<p className="text-xs uppercase tracking-[0.4em] text-white/60">Recommended Sessions</p>
									<div className="mt-3 grid gap-3 md:grid-cols-2">
										{article.recommendedSessions.map((session) => (
											<div key={session.id} className="rounded-2xl border border-white/15 bg-white/5 p-3 text-sm">
												<p className="text-xs uppercase tracking-[0.4em] text-white/40">{session.type}</p>
												<p className="text-white/80">{session.title}</p>
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
								<div className="mt-4 rounded-3xl border border-white/15 bg-black/20 p-5">
									<p className="text-xs uppercase tracking-[0.4em] text-white/60">References</p>
									<ul className="mt-3 space-y-2 text-sm text-white/70 list-disc pl-5">
										{article.references.map((ref) => (
											<li key={ref}>{ref}</li>
										))}
									</ul>
								</div>
								{relatedArticles.length > 0 && (
									<div className="mt-6">
										<p className="text-xs uppercase tracking-[0.4em] text-white/60">Related Articles</p>
										<div className="mt-3 grid gap-3 md:grid-cols-2">
											{relatedArticles.map((related) => (
												<button
													type="button"
													key={related.slug}
													onClick={() => onNavigate?.(related.slug)}
													className="rounded-3xl border border-white/15 bg-white/5 p-4 text-left transition hover:border-white/40"
												>
													<p className="text-xs uppercase tracking-[0.4em] text-white/50">{related.category}</p>
													<p className="mt-2 text-white font-semibold">{related.title}</p>
													<p className="text-xs text-white/50">{related.readTimeMinutes}-min read</p>
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
