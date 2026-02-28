"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon, ClockIcon } from "lucide-react";
import { KNOWLEDGE_ARTICLES, type KnowledgeArticle, type KnowledgeCategory } from "@/lib/mockData/articles";
import { ArticleView } from "@/components/knowledge/ArticleView";
import { SearchEmpty } from "@/components/ui/EmptyState";

const categories: Array<{ label: string; value: "all" | KnowledgeCategory }> = [
	{ label: "All", value: "all" },
	{ label: "Neuroscience", value: "neuroscience" },
	{ label: "Psychology", value: "psychology" },
	{ label: "Breathwork", value: "breathwork" },
	{ label: "Sleep", value: "sleep" },
	{ label: "Focus", value: "focus" },
	{ label: "Productivity", value: "productivity" },
];

export function KnowledgeHub() {
	const [articles, setArticles] = useState<KnowledgeArticle[]>(KNOWLEDGE_ARTICLES);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<(typeof categories)[number]["value"]>("all");
	const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

	useEffect(() => {
		fetch("/api/articles")
			.then((res) => res.json())
			.then((json) => {
				if (json.items?.length > 0) setArticles(json.items);
			})
			.catch(() => {});
	}, []);

	const filteredArticles = useMemo(() => {
		return articles.filter((article) => {
			const matchesCategory = category === "all" || article.category === category;
			const matchesQuery =
				article.title.toLowerCase().includes(query.toLowerCase()) ||
				article.keyTakeaways.some((takeaway) => takeaway.toLowerCase().includes(query.toLowerCase()));
			return matchesCategory && matchesQuery;
		});
	}, [category, query]);

	const relatedArticles = useMemo(() => {
		if (!activeArticle) return [];
		return articles.filter(
			(article) => article.category === activeArticle.category && article.slug !== activeArticle.slug,
		).slice(0, 2);
	}, [activeArticle]);

	return (
		<section className="space-y-6 text-white">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-white/60">Knowledge Hub</p>
					<h2 className="text-3xl font-semibold">Labs, guides, and nervous system intel</h2>
					<p className="text-sm text-white/70">
						Search rituals, neuroscience breakdowns, and Somatic sprint blueprints from Mindify faculty.
					</p>
				</div>
				<div className="relative w-full max-w-sm">
					<SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
					<input
						type="text"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search articles"
						className="w-full rounded-3xl border border-white/15 bg-white/5 px-10 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
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
								? "border-white/60 bg-white/10 text-white"
								: "border-white/15 text-white/70 hover:border-white/40"
						}`}
					>
						{cat.label}
					</button>
				))}
			</div>

			{filteredArticles.length > 0 ? (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{filteredArticles.map((article, index) => (
						<motion.button
							type="button"
							key={article.slug}
							onClick={() => setActiveArticle(article)}
							initial={{ opacity: 0, translateY: 30 }}
							whileInView={{ opacity: 1, translateY: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.05 }}
							className="group overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-white/10 to-white/0 p-5 text-left shadow-[0_20px_60px_rgba(3,4,12,0.4)]"
						>
							<div className="text-xs uppercase tracking-[0.4em] text-white/50">{article.category}</div>
							<h3 className="mt-3 text-2xl font-semibold">{article.title}</h3>
							<p className="mt-2 text-sm text-white/70 line-clamp-3">
								{article.keyTakeaways[0] ?? "Applied nervous system science for modern operators."}
							</p>
							<div className="mt-4 flex items-center gap-3 text-xs text-white/50">
								<span className="inline-flex items-center gap-1">
									<ClockIcon className="h-4 w-4" />
									{article.readTimeMinutes} min read
								</span>
								<span>{article.author}</span>
							</div>
							<div className="mt-4 flex gap-2 text-xs text-white/50">
								{article.keyTakeaways.slice(0, 2).map((takeaway) => (
									<span
										key={takeaway}
										className="rounded-full border border-white/15 px-3 py-1 line-clamp-1 group-hover:border-white/40"
									>
										{takeaway}
									</span>
								))}
							</div>
						</motion.button>
					))}
				</div>
			) : (
				<div className="py-8">
					<SearchEmpty query={query} />
				</div>
			)}

			{activeArticle && (
				<ArticleView
					article={activeArticle}
					onClose={() => setActiveArticle(null)}
					relatedArticles={relatedArticles}
					onNavigate={(slug) => {
						const next = articles.find((article) => article.slug === slug);
						if (next) {
							setActiveArticle(next);
						}
					}}
				/>
			)}
		</section>
	);
}
