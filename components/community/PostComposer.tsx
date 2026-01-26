"use client";

import { useState } from "react";
import { Send, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface PostComposerProps {
	userName: string;
	userInitial: string;
	postType: "check-in" | "weekly-win" | "reflection";
	onSubmit: (content: string, visibility: "public" | "members_only", programId?: string) => Promise<void>;
	programs?: Array<{ id: string; title: string }>;
}

export function PostComposer({ userName, userInitial, postType, onSubmit, programs = [] }: PostComposerProps) {
	const [content, setContent] = useState("");
	const [visibility, setVisibility] = useState<"public" | "members_only">("members_only");
	const [selectedProgram, setSelectedProgram] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			await onSubmit(content.trim(), visibility, selectedProgram || undefined);
			setContent("");
			setSelectedProgram("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const placeholders = {
		"check-in": "Share your current state, wins, or challenges...",
		"weekly-win": "What breakthrough or win did you experience this week?",
		reflection: "What insights or learnings are you noticing?",
	};

	return (
		<motion.form
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			onSubmit={handleSubmit}
			className="rounded-3xl border border-sage-100 bg-cream-50 p-6 shadow-card dark:border-white/10 dark:bg-[#13151A]"
		>
			<div className="flex items-start gap-3">
				<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-sage text-white font-semibold">
					{userInitial}
				</div>
				<div className="flex-1 space-y-4">
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder={placeholders[postType]}
						className="w-full resize-none rounded-2xl border border-sage-100 bg-cream-50 px-4 py-3 text-earth-900 placeholder:text-earth-400 focus:border-sage-300 focus:outline-none dark:border-white/10 dark:bg-[#111318] dark:text-[#F4EFE6] dark:placeholder:text-[#AFA79B]"
						rows={4}
					/>

					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-3">
							{programs.length > 0 && (
								<select
									value={selectedProgram}
									onChange={(e) => setSelectedProgram(e.target.value)}
									className="rounded-full border border-sage-100 bg-cream-50 px-4 py-1.5 text-sm text-earth-700 focus:border-sage-300 focus:outline-none dark:border-white/10 dark:bg-[#111318] dark:text-[#E2DBCF]"
								>
									<option value="">No program</option>
									{programs.map((program) => (
										<option key={program.id} value={program.id}>
											{program.title}
										</option>
									))}
								</select>
							)}

							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setVisibility("members_only")}
									className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
										visibility === "members_only"
											? "border-sage-300 bg-sage-100 text-sage-700 dark:border-sage-700/50 dark:bg-sage-900/30 dark:text-sage-300"
											: "border-sage-100 text-earth-500 hover:border-sage-200 dark:border-white/10 dark:text-[#AFA79B] dark:hover:border-white/20"
									}`}
								>
									<Lock className="h-3 w-3" />
									Members
								</button>
								<button
									type="button"
									onClick={() => setVisibility("public")}
									className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
										visibility === "public"
											? "border-sage-300 bg-sage-100 text-sage-700 dark:border-sage-700/50 dark:bg-sage-900/30 dark:text-sage-300"
											: "border-sage-100 text-earth-500 hover:border-sage-200 dark:border-white/10 dark:text-[#AFA79B] dark:hover:border-white/20"
									}`}
								>
									<Globe className="h-3 w-3" />
									Public
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={!content.trim() || isSubmitting}
							className="inline-flex items-center gap-2 rounded-full bg-gradient-sage px-6 py-2 text-sm font-medium text-white shadow-soft transition hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Send className="h-4 w-4" />
							{isSubmitting ? "Posting..." : "Post"}
						</button>
					</div>
				</div>
			</div>
		</motion.form>
	);
}
