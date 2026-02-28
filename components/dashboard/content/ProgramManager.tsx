"use client";

import { useState, useEffect, useCallback } from "react";
import type { Program, ProgramCategory, ProgramDifficulty, ProgramDay } from "@/lib/types";
import { ContentTable, type ContentColumn } from "./ContentTable";
import { ContentFormModal, FormInput, FormSelect, FormTextarea, FormCheckbox } from "./ContentFormModal";
import { ArrayFieldEditor } from "./ArrayFieldEditor";
import { ProgramDayEditor } from "./ProgramDayEditor";

const categoryOptions: { value: ProgramCategory; label: string }[] = [
	{ value: "focus", label: "Focus" },
	{ value: "productivity", label: "Productivity" },
	{ value: "sleep", label: "Sleep" },
	{ value: "mindset", label: "Mindset" },
	{ value: "clarity", label: "Clarity" },
];

const difficultyOptions: { value: ProgramDifficulty; label: string }[] = [
	{ value: "beginner", label: "Beginner" },
	{ value: "intermediate", label: "Intermediate" },
	{ value: "advanced", label: "Advanced" },
];

const emptyProgram = {
	title: "",
	tagline: "",
	description: "",
	duration: 7,
	category: "focus" as ProgramCategory,
	difficulty: "beginner" as ProgramDifficulty,
	coverImage: "",
	includeSummary: { meditations: 0, tasks: 0, journalPrompts: 0 },
	requirements: [] as string[],
	benefits: [] as string[],
	timeCommitment: "",
	recommendedFor: [] as string[],
	days: [] as ProgramDay[],
	isPremium: false,
};

const columns: ContentColumn<Program>[] = [
	{
		key: "title",
		label: "Title",
		render: (item) => (
			<div>
				<p className="font-medium">{item.title}</p>
				<p className="text-xs text-earth-500 dark:text-[#B5AFA3] line-clamp-1">{item.tagline}</p>
			</div>
		),
	},
	{ key: "category", label: "Category", render: (item) => <span className="capitalize">{item.category}</span> },
	{ key: "difficulty", label: "Difficulty", render: (item) => <span className="capitalize">{item.difficulty}</span> },
	{ key: "duration", label: "Days", render: (item) => `${item.duration}d`, className: "text-right" },
	{
		key: "premium",
		label: "Premium",
		render: (item) =>
			item.isPremium ? (
				<span className="inline-flex rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700 dark:bg-sage-900/30 dark:text-sage-400">
					Premium
				</span>
			) : (
				<span className="text-earth-400">Free</span>
			),
	},
];

export function ProgramManager() {
	const [items, setItems] = useState<Program[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingItem, setEditingItem] = useState<Program | null>(null);
	const [form, setForm] = useState(emptyProgram);

	const fetchItems = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/admin/programs");
			const json = await res.json();
			setItems(json.items || []);
		} catch (err) {
			console.error("Failed to fetch programs:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const openAdd = () => {
		setEditingItem(null);
		setForm(emptyProgram);
		setIsModalOpen(true);
	};

	const openEdit = (item: Program) => {
		setEditingItem(item);
		setForm({
			title: item.title,
			tagline: item.tagline,
			description: item.description,
			duration: item.duration,
			category: item.category,
			difficulty: item.difficulty,
			coverImage: item.coverImage,
			includeSummary: item.includeSummary,
			requirements: item.requirements,
			benefits: item.benefits,
			timeCommitment: item.timeCommitment,
			recommendedFor: item.recommendedFor,
			days: item.days,
			isPremium: item.isPremium ?? false,
		});
		setIsModalOpen(true);
	};

	const handleDelete = async (item: Program) => {
		if (!confirm(`Delete "${item.title}"?`)) return;
		await fetch(`/api/admin/programs/${item.id}`, { method: "DELETE" });
		fetchItems();
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			if (editingItem) {
				await fetch(`/api/admin/programs/${editingItem.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			} else {
				await fetch("/api/admin/programs", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			}
			setIsModalOpen(false);
			fetchItems();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<ContentTable
				title="Programs"
				items={items}
				columns={columns}
				searchField={(item) => `${item.title} ${item.tagline} ${item.category}`}
				getId={(item) => item.id}
				onAdd={openAdd}
				onEdit={openEdit}
				onDelete={handleDelete}
				isLoading={isLoading}
			/>

			<ContentFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingItem ? "Edit Program" : "New Program"}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			>
				<FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
				<FormInput label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
				<FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
				<div className="grid grid-cols-3 gap-4">
					<FormInput label="Duration (days)" type="number" value={form.duration} onChange={(v) => setForm({ ...form, duration: parseInt(v) || 0 })} />
					<FormSelect label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v as ProgramCategory })} options={categoryOptions} />
					<FormSelect label="Difficulty" value={form.difficulty} onChange={(v) => setForm({ ...form, difficulty: v as ProgramDifficulty })} options={difficultyOptions} />
				</div>
				<FormInput label="Cover Image URL" value={form.coverImage} onChange={(v) => setForm({ ...form, coverImage: v })} placeholder="/images/programs/..." />
				<FormInput label="Time Commitment" value={form.timeCommitment} onChange={(v) => setForm({ ...form, timeCommitment: v })} placeholder="e.g. 25-35 minutes per day" />

				<div className="grid grid-cols-3 gap-4">
					<FormInput label="Meditations Count" type="number" value={form.includeSummary.meditations} onChange={(v) => setForm({ ...form, includeSummary: { ...form.includeSummary, meditations: parseInt(v) || 0 } })} />
					<FormInput label="Tasks Count" type="number" value={form.includeSummary.tasks} onChange={(v) => setForm({ ...form, includeSummary: { ...form.includeSummary, tasks: parseInt(v) || 0 } })} />
					<FormInput label="Journal Prompts Count" type="number" value={form.includeSummary.journalPrompts} onChange={(v) => setForm({ ...form, includeSummary: { ...form.includeSummary, journalPrompts: parseInt(v) || 0 } })} />
				</div>

				<ArrayFieldEditor label="Requirements" values={form.requirements} onChange={(v) => setForm({ ...form, requirements: v })} />
				<ArrayFieldEditor label="Benefits" values={form.benefits} onChange={(v) => setForm({ ...form, benefits: v })} />
				<ArrayFieldEditor label="Recommended For" values={form.recommendedFor} onChange={(v) => setForm({ ...form, recommendedFor: v })} />

				<FormCheckbox label="Premium" checked={form.isPremium} onChange={(v) => setForm({ ...form, isPremium: v })} />

				<ProgramDayEditor days={form.days} onChange={(days) => setForm({ ...form, days })} />
			</ContentFormModal>
		</>
	);
}
