"use client";

import { useMemo } from "react";
import { ChevronDownIcon } from "lucide-react";
import { DEFAULT_FILTER_STATE, MEDITATION_CATEGORY_DEFINITIONS, MOOD_FILTERS, DURATION_FILTERS } from "@/lib/constants";
import { useAppStore } from "@/lib/stores/appStore";

const categoryEntries = Object.entries(MEDITATION_CATEGORY_DEFINITIONS);

export function MeditationFilters() {
	const { filterState, setFilterState } = useAppStore((state) => ({
		filterState: state.filterState,
		setFilterState: state.setFilterState,
	}));

	const activeFilters = useMemo(() => {
		let count = 0;
		if (filterState.mood !== DEFAULT_FILTER_STATE.mood) count += 1;
		if (filterState.duration !== DEFAULT_FILTER_STATE.duration) count += 1;
		if (filterState.category && filterState.category !== DEFAULT_FILTER_STATE.category) count += 1;
		return count;
	}, [filterState]);

	const onClear = () => setFilterState(DEFAULT_FILTER_STATE);

	return (
		<div className="rounded-4xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h3 className="text-lg font-semibold">Filters</h3>
				<div className="flex items-center gap-3 text-sm text-white/70">
					{activeFilters > 0 && (
						<span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em]">
							{activeFilters} active
						</span>
					)}
					<button type="button" onClick={onClear} className="text-mindify-mist underline decoration-dotted">
						Clear filters
					</button>
				</div>
			</div>

			<div className="mt-6 grid gap-6 md:grid-cols-3">
				<div>
					<label className="text-xs uppercase tracking-[0.4em] text-white/60">Mood</label>
					<div className="mt-2 relative">
						<select
							value={filterState.mood}
							onChange={(event) => setFilterState({ mood: event.target.value as typeof filterState.mood })}
							className="w-full appearance-none rounded-3xl border border-white/15 bg-black/30 px-4 py-3 pr-10 text-sm text-white focus:border-white/40 focus:outline-none"
						>
							{MOOD_FILTERS.map((mood) => (
								<option key={mood} value={mood} className="bg-black text-white">
									{mood === "all" ? "All moods" : mood}
								</option>
							))}
						</select>
						<ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
					</div>
				</div>

				<div>
					<label className="text-xs uppercase tracking-[0.4em] text-white/60">Duration</label>
					<div className="mt-2 flex flex-wrap gap-2">
						{DURATION_FILTERS.map((duration) => {
							const isActive = filterState.duration === duration;
							return (
								<button
									type="button"
									key={duration}
									onClick={() => setFilterState({ duration })}
									className={`rounded-3xl border px-4 py-2 text-sm transition ${
										isActive
											? "border-white/50 bg-white/15 text-white"
											: "border-white/15 text-white/70 hover:border-white/30"
									}`}
								>
									{duration === "all" ? "All lengths" : `${duration} min`}
								</button>
							);
						})}
					</div>
				</div>

				<div>
					<label className="text-xs uppercase tracking-[0.4em] text-white/60">Category</label>
					<div className="mt-2 flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => setFilterState({ category: "all" })}
							className={`rounded-3xl border px-4 py-2 text-sm ${
								!filterState.category || filterState.category === "all"
									? "border-white/50 bg-white/15 text-white"
									: "border-white/15 text-white/70 hover:border-white/30"
							}`}
						>
							All
						</button>
						{categoryEntries.map(([category]) => (
							<button
								type="button"
								key={category}
								onClick={() => setFilterState({ category: category as typeof filterState.category })}
								className={`rounded-3xl border px-4 py-2 text-sm capitalize ${
									filterState.category === category
										? "border-white/50 bg-white/15 text-white"
										: "border-white/15 text-white/70 hover:border-white/30"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
