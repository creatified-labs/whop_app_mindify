"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchIcon, ClockIcon } from "lucide-react";
import type { KnowledgeArticle } from "@/lib/types";
import type { ExperienceCopy } from "@/lib/ui/experienceCopy";
import { ArticleView } from "@/components/knowledge/ArticleView";

export function KnowledgeHub({ companyId, experienceCopy }: { companyId: string; experienceCopy?: ExperienceCopy }) {
	const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);
	const [bookmarkedSlugs, setBookmarkedSlugs] = useState<Set<string>>(new Set());

	// Derive categories dynamically from the articles that exist
	const categories = useMemo(() => {
		const unique = [...new Set(articles.map((a) => a.category).filter(Boolean))].sort();
		return [
			{ label: "All", value: "all" },
			...unique.map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
		];
	}, [articles]);

	// Fetch articles from API
	useEffect(() => {
		fetch(`/api/articles?company_id=${encodeURIComponent(companyId)}`)
			.then((res) => res.json())
			.then((data) => setArticles(data.items || []))
			.catch(() => {});
	}, [companyId]);

	// Fetch bookmarked article slugs on mount
	useEffect(() => {
		fetch(`/api/user/favorites?content_type=article&company_id=${encodeURIComponent(companyId)}`)
			.then((res) => res.json())
			.then((data) => {
				const slugs = (data.favorites || []).map((f: any) => f.content_id);
				setBookmarkedSlugs(new Set(slugs));
			})
			.catch(() => {});
	}, []);

	const handleToggleBookmark = useCallback((slug: string) => {
		// Optimistic update
		setBookmarkedSlugs((prev) => {
			const next = new Set(prev);
			if (next.has(slug)) {
				next.delete(slug);
			} else {
				next.add(slug);
			}
			return next;
		});

		// Persist via API
		fetch(`/api/user/favorites?company_id=${encodeURIComponent(companyId)}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				content_type: "article",
				content_id: slug,
				toggle: true,
			}),
		}).catch(() => {
			// Revert on failure
			setBookmarkedSlugs((prev) => {
				const next = new Set(prev);
				if (next.has(slug)) {
					next.delete(slug);
				} else {
					next.add(slug);
				}
				return next;
			});
		});
	}, []);

	const filteredArticles = useMemo(() => {
		return articles.filter((article) => {
			const matchesCategory = category === "all" || article.category === category;
			const matchesQuery =
				query === "" ||
				article.title.toLowerCase().includes(query.toLowerCase()) ||
				(article.keyTakeaways || []).some((takeaway) => takeaway.toLowerCase().includes(query.toLowerCase()));
			return matchesCategory && matchesQuery;
		});
	}, [articles, category, query]);

	return (
		<section className="space-y-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/60">{experienceCopy?.knowledgeEyebrow ?? "Knowledge Hub"}</p>
					<h2 className="text-3xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">{experienceCopy?.knowledgeHeading ?? "Guides and resources"}</h2>
					<p className="text-sm text-[rgb(var(--earth-600))] dark:text-white/70">
						{experienceCopy?.knowledgeDescription ?? "Browse articles, guides, and resources curated for you."}
					</p>
				</div>
				<div className="relative w-full max-w-sm">
					<SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--earth-400))] dark:text-white/40" />
					<input
						type="text"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={experienceCopy?.knowledgeSearchPlaceholder ?? "Search articles"}
						className="w-full rounded-3xl border border-[rgb(var(--sage-200))] bg-[rgb(var(--cream-50))] px-10 py-2 text-sm text-[rgb(var(--earth-900))] placeholder:text-[rgb(var(--earth-400))] focus:border-[rgb(var(--sage-400))] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/40"
					/>
				</div>
			</header>

			<div className="flex flex-wrap gap-2">
				{categories.map((cat) => (
					<button
						type="button"
						key={cat.value}
						onClick={() => setCategory(cat.value)}
						className={`rounded-full border px-4 py-1 text-xs uppercase tracking-[0.3em] ${
							category === cat.value
								? "border-[rgb(var(--sage-400))] bg-[rgb(var(--sage-50))] text-[rgb(var(--sage-700))] dark:border-white/60 dark:bg-white/10 dark:text-white"
								: "border-[rgb(var(--sage-200))] text-[rgb(var(--earth-600))] hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
						}`}
					>
						{String(cat.label)}
					</button>
				))}
			</div>

			{filteredArticles.length > 0 ? (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{filteredArticles.map((article) => (
						<button
							type="button"
							key={article.slug}
							onClick={() => setActiveArticle(article)}
							className="group overflow-hidden rounded-[28px] border border-[rgb(var(--sage-100))] bg-white p-5 text-left shadow-card dark:border-white/15 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/0 dark:shadow-[0_20px_60px_rgba(3,4,12,0.4)]"
						>
							<div className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--earth-500))] dark:text-white/50">{String(article.category)}</div>
							<h3 className="mt-3 text-2xl font-semibold text-[rgb(var(--earth-900))] dark:text-white">{String(article.title)}</h3>
							<p className="mt-2 text-sm text-[rgb(var(--earth-600))] line-clamp-3 dark:text-white/70">
								{String((article.keyTakeaways || [])[0] ?? "")}
							</p>
							<div className="mt-4 flex items-center gap-3 text-xs text-[rgb(var(--earth-500))] dark:text-white/50">
								<span className="inline-flex items-center gap-1">
									<ClockIcon className="h-4 w-4" />
									{String(article.readTimeMinutes)} min read
								</span>
								<span>{String(article.author)}</span>
							</div>
							<div className="mt-4 flex gap-2 text-xs text-[rgb(var(--earth-500))] dark:text-white/50">
								{(article.keyTakeaways || []).slice(0, 2).map((takeaway) => (
									<span
										key={String(takeaway)}
										className="rounded-full border border-[rgb(var(--sage-200))] px-3 py-1 line-clamp-1 group-hover:border-[rgb(var(--sage-400))] dark:border-white/15 dark:group-hover:border-white/40"
									>
										{String(takeaway)}
									</span>
								))}
							</div>
						</button>
					))}
				</div>
			) : (
				<div className="py-8 text-center text-sm text-[rgb(var(--earth-500))] dark:text-white/60">
					{articles.length === 0 ? (experienceCopy?.knowledgeEmptyState ?? "No articles available yet.") : `No articles found for "${query}"`}
				</div>
			)}

			{activeArticle && (
				<ArticleView
					article={activeArticle}
					onClose={() => setActiveArticle(null)}
					onNavigate={(slug) => {
						const article = articles.find((a) => a.slug === slug);
						if (article) setActiveArticle(article);
					}}
					isBookmarked={bookmarkedSlugs.has(activeArticle.slug)}
					onToggleBookmark={handleToggleBookmark}
				/>
			)}
		</section>
	);
}
