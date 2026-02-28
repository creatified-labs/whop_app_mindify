"use client";

import { useMemo } from "react";
import type { Program } from "@/lib/types";
import { useProgramStore } from "@/lib/stores/programStore";
import type { DailyTaskKey } from "@/lib/stores/programStore";

type DailyProgramViewProps = {
	program: Program;
	dayNumber: number;
	onCompleteDay?: (day: number) => Promise<void> | void;
	onNextDay?: (day: number) => void;
};

const defaultChecklist = [
	"Listen to today's meditation",
	"Complete micro-task 1",
	"Complete micro-task 2",
	"Journal prompt response",
];

export function DailyProgramView({ program, dayNumber, onCompleteDay, onNextDay }: DailyProgramViewProps) {
	const day = program.days[dayNumber - 1];
	const {
		taskCompletion,
		toggleTask,
		journalDrafts,
		setJournalDraft,
		queueCelebration,
	} = useProgramStore((state) => ({
		taskCompletion: state.taskCompletion,
		toggleTask: state.toggleTask,
		journalDrafts: state.journalDrafts,
		setJournalDraft: state.setJournalDraft,
		queueCelebration: state.queueCelebration,
	}));

	const key = `${program.id}:${dayNumber}` as DailyTaskKey;
	const tasks = day?.tasks.length ? day.tasks : defaultChecklist;
	const completionMap = taskCompletion[key] ?? {};
	const journalValue = journalDrafts[key] ?? "";
	const allTasksChecked = tasks.every((_, index) => completionMap[index]);
	const canMarkComplete = allTasksChecked && journalValue.trim().length > 0;

	const audioSrc = day?.audioSession ? `/audio/${day.audioSession}.mp3` : undefined;

	const handleToggleTask = (taskKey: string) => {
		toggleTask(program.id, dayNumber, taskKey);
	};

	const handleSaveJournal = (value: string) => {
		setJournalDraft(program.id, dayNumber, value);
	};

	const handleCompleteDay = async () => {
		if (!canMarkComplete) return;
		queueCelebration(`Day ${dayNumber} complete!`);
		await onCompleteDay?.(dayNumber);
		onNextDay?.(Math.min(dayNumber + 1, program.duration));
	};

	const motivationalQuote = day?.quote ?? "Consistency compounds. Keep layering the reps.";

	const preparationChecklist = useMemo(
		() => [
			"Find quiet space",
			"Use headphones",
			"Set intention",
			"Ready to begin",
		],
		[],
	);

	return (
		<section className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#080A1F] via-[#0D122E] to-[#05060D] p-6 text-white shadow-[0_40px_120px_rgba(5,10,25,0.55)]">
			<header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-white/60">
						Day {dayNumber} • {program.title}
					</p>
					<h3 className="mt-2 text-3xl font-semibold">{day?.title ?? "Preview Day"}</h3>
					<p className="mt-2 text-sm text-white/70">Complete each ritual to unlock the next day.</p>
				</div>
				<div className="text-right">
					<p className="text-xs uppercase tracking-[0.3em] text-white/50">Motivation</p>
					<p className="text-base text-white/80">{motivationalQuote}</p>
				</div>
			</header>

			<div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
				<div className="space-y-6">
					<div className="rounded-4xl border border-white/10 bg-black/30 p-5">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<p className="text-xs uppercase tracking-[0.4em] text-white/50">Today's session</p>
								<p className="text-lg text-white/80">Guided audio for this day</p>
							</div>
							{audioSrc && (
								<a
									href={audioSrc}
									target="_blank"
									className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80"
									rel="noreferrer"
								>
									Open audio
								</a>
							)}
						</div>
						<div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
							<p>
								{day?.audioSession
									? "This track blends hypnosis cues with focus priming. Use headphones for full effect."
									: "No audio required today. Continue with tasks below."}
							</p>
						</div>
					</div>

					<div className="rounded-4xl border border-white/10 bg-black/20 p-5">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Preparation checklist</p>
						<div className="mt-4 grid gap-3 sm:grid-cols-2">
							{preparationChecklist.map((item, index) => {
								const taskKey = `prep-${index}`;
								const prepared = completionMap[taskKey];
								return (
									<button
										key={item}
										type="button"
										onClick={() => handleToggleTask(taskKey)}
										className={[
											"rounded-3xl border px-4 py-3 text-left text-sm transition",
											prepared
												? "border-mindify-lagoon/50 bg-mindify-lagoon/20 text-white"
												: "border-white/15 text-white/70 hover:border-white/40",
										].join(" ")}
									>
										<div className="flex items-center gap-3">
											<span
												className={[
													"flex h-5 w-5 items-center justify-center rounded-full border",
													prepared
														? "border-mindify-lagoon bg-mindify-lagoon/20 text-mindify-lagoon"
														: "border-white/30 text-white/50",
												].join(" ")}
											>
												{prepared ? "✓" : ""}
											</span>
											{item}
										</div>
									</button>
								);
							})}
						</div>
					</div>

					<div className="rounded-4xl border border-white/10 bg-black/20 p-5">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.4em] text-white/50">Daily tasks</p>
								<p className="text-sm text-white/70">Complete all to unlock completion button</p>
							</div>
							<p className="text-sm text-white/60">
								{tasks.filter((_, idx) => completionMap[idx]).length}/{tasks.length} done
							</p>
						</div>
						<div className="mt-4 space-y-3">
							{tasks.map((task, index) => {
								const taskKey = `${index}`;
								const checked = completionMap[taskKey];
								return (
									<label
										key={task}
										className={[
											"flex cursor-pointer items-start gap-3 rounded-3xl border px-4 py-3 text-sm transition",
											checked
												? "border-mindify-dawn/70 bg-mindify-dawn/10 text-white"
												: "border-white/15 text-white/80 hover:border-white/40",
										].join(" ")}
									>
										<input
											type="checkbox"
											checked={!!checked}
											onChange={() => handleToggleTask(taskKey)}
											className="mt-0.5 h-4 w-4 rounded border-white/30 bg-transparent"
										/>
										<span>{task}</span>
									</label>
								);
							})}
						</div>
					</div>

					<div className="rounded-4xl border border-white/10 bg-black/15 p-5">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Journal prompt</p>
						<p className="mt-2 text-sm text-white/70">{day?.journalPrompts[0] ?? "Reflect on today's work."}</p>
						<textarea
							value={journalValue}
							onChange={(event) => handleSaveJournal(event.target.value)}
							className="mt-4 min-h-[140px] w-full rounded-3xl border border-white/15 bg-transparent p-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
							placeholder="Capture your insights, resistance, or breakthroughs here."
						/>
					</div>

					<div className="flex flex-wrap gap-4">
						<button
							type="button"
							onClick={handleCompleteDay}
							disabled={!canMarkComplete}
							className={[
								"flex-1 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition",
								canMarkComplete
									? "bg-white text-black hover:-translate-y-0.5"
									: "bg-white/10 text-white/40",
							].join(" ")}
						>
							Mark day as complete
						</button>
						<button
							type="button"
							onClick={() => onNextDay?.(Math.min(dayNumber + 1, program.duration))}
							className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 hover:border-white/40"
						>
							Continue to next day
						</button>
					</div>
				</div>

				<aside className="space-y-6">
					<div className="rounded-4xl border border-white/10 bg-black/30 p-5">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Micro wins</p>
						<ul className="mt-4 space-y-3 text-sm text-white/80">
							{(day?.microWins ?? ["Celebrate matching your pacing", "Share insight with accountability partner"]).map(
								(win) => (
									<li key={win} className="flex items-start gap-3">
										<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-mindify-lagoon" />
										{win}
									</li>
								),
							)}
						</ul>
					</div>
					<div className="rounded-4xl border border-white/10 bg-black/20 p-5">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Session Guidance</p>
						<p className="mt-3 text-sm text-white/70">
							Plan for gentle movement or breathwork before and after audio to lock in state changes. If you miss a
							day, mark a rest day and re-enter with compassion.
						</p>
					</div>
					<div className="rounded-4xl border border-white/10 bg-black/25 p-5">
						<p className="text-xs uppercase tracking-[0.4em] text-white/50">Post-session reflection</p>
						<p className="mt-3 text-sm text-white/70">
							How did your nervous system shift? What evidence proves your new identity today?
						</p>
					</div>
				</aside>
			</div>
		</section>
	);
}
