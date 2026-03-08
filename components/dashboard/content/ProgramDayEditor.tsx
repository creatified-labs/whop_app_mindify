"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import type { ProgramDay } from "@/lib/types";
import { FormInput, FormTextarea } from "./ContentFormModal";
import { ArrayFieldEditor } from "./ArrayFieldEditor";
import { AudioUploadButton } from "./AudioUploadButton";

interface ProgramDayEditorProps {
	days: ProgramDay[];
	onChange: (days: ProgramDay[]) => void;
	companyId: string;
}

const emptyDay: ProgramDay = {
	dayNumber: 1,
	title: "",
	tasks: [],
	journalPrompts: [],
};

export function ProgramDayEditor({ days, onChange, companyId }: ProgramDayEditorProps) {
	const [expandedDay, setExpandedDay] = useState<number | null>(null);

	const addDay = () => {
		const newDay: ProgramDay = {
			...emptyDay,
			dayNumber: days.length + 1,
			title: `Day ${days.length + 1}`,
		};
		onChange([...days, newDay]);
		setExpandedDay(days.length);
	};

	const removeDay = (index: number) => {
		const updated = days.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 }));
		onChange(updated);
		setExpandedDay(null);
	};

	const updateDay = (index: number, updates: Partial<ProgramDay>) => {
		const updated = [...days];
		updated[index] = { ...updated[index], ...updates };
		onChange(updated);
	};

	return (
		<div>
			<div className="mb-2 flex items-center justify-between">
				<label className="text-sm font-medium text-earth-700 dark:text-[#D9D3C8]">
					Program Days ({days.length})
				</label>
				<button
					type="button"
					onClick={addDay}
					className="flex items-center gap-1 rounded-lg bg-[rgb(var(--sage-600))] px-3 py-1.5 text-xs text-white shadow-sm hover:bg-[rgb(var(--sage-700))]"
				>
					<Plus className="h-3 w-3" />
					Add Day
				</button>
			</div>

			<div className="space-y-2">
				{days.map((day, index) => {
					const isExpanded = expandedDay === index;
					return (
						<div
							key={index}
							className="rounded-lg border border-sage-200 bg-cream-50 dark:border-white/10 dark:bg-[#14171C]"
						>
							<button
								type="button"
								onClick={() => setExpandedDay(isExpanded ? null : index)}
								className="flex w-full items-center justify-between px-4 py-3 text-sm"
							>
								<div className="flex items-center gap-2 text-earth-900 dark:text-[#F4EFE6]">
									{isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
									<span className="font-medium">Day {day.dayNumber}:</span>
									<span className="text-earth-600 dark:text-[#CFC7BB]">{day.title || "(untitled)"}</span>
								</div>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										removeDay(index);
									}}
									className="rounded p-1 text-earth-400 hover:bg-red-50 hover:text-red-600 dark:text-[#B5AFA3] dark:hover:bg-red-900/20 dark:hover:text-red-400"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</button>
							</button>

							{isExpanded && (
								<div className="space-y-3 border-t border-sage-200 p-4 dark:border-white/10">
									<FormInput
										label="Title"
										value={day.title}
										onChange={(v) => updateDay(index, { title: v })}
									/>
									<FormInput
										label="Audio Session ID"
										value={day.audioSession ?? ""}
										onChange={(v) => updateDay(index, { audioSession: v || undefined })}
										placeholder="e.g. focus-activation"
									/>
									<FormInput
										label="Audio URL"
										value={day.audioUrl ?? ""}
										onChange={(v) => updateDay(index, { audioUrl: v || undefined })}
										placeholder="Upload or paste audio URL"
									/>
									<AudioUploadButton
										companyId={companyId}
										contentType="programs"
										onUploadComplete={(url) => updateDay(index, { audioUrl: url })}
									/>
									<FormInput
										label="Video URL"
										value={day.videoUrl ?? ""}
										onChange={(v) => updateDay(index, { videoUrl: v || undefined })}
									/>
									<FormInput
										label="Quote"
										value={day.quote ?? ""}
										onChange={(v) => updateDay(index, { quote: v || undefined })}
									/>
									<ArrayFieldEditor
										label="Tasks"
										values={day.tasks}
										onChange={(v) => updateDay(index, { tasks: v })}
										placeholder="Add a task..."
									/>
									<ArrayFieldEditor
										label="Journal Prompts"
										values={day.journalPrompts}
										onChange={(v) => updateDay(index, { journalPrompts: v })}
										placeholder="Add a journal prompt..."
									/>
									<ArrayFieldEditor
										label="Micro Wins"
										values={day.microWins ?? []}
										onChange={(v) => updateDay(index, { microWins: v })}
										placeholder="Add a micro win..."
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
