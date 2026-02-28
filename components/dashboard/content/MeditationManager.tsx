"use client";

import { useState, useEffect, useCallback } from "react";
import type { Meditation, MeditationCategory, Mood } from "@/lib/types";
import { ContentTable, type ContentColumn } from "./ContentTable";
import { ContentFormModal, FormInput, FormSelect, FormTextarea, FormCheckbox } from "./ContentFormModal";
import { ArrayFieldEditor } from "./ArrayFieldEditor";

const categoryOptions = [
	{ value: "focus", label: "Focus" },
	{ value: "morning", label: "Morning" },
	{ value: "evening", label: "Evening" },
	{ value: "sleep", label: "Sleep" },
	{ value: "stress", label: "Stress" },
	{ value: "overwhelm", label: "Overwhelm" },
	{ value: "productivity", label: "Productivity" },
	{ value: "emotional", label: "Emotional" },
];

const moodOptions: Mood[] = ["stressed", "tired", "overwhelmed", "unfocused"];

const emptyMeditation = {
	title: "",
	description: "",
	duration: 10,
	category: "focus" as MeditationCategory,
	audioUrl: "",
	imageUrl: "",
	mood: [] as Mood[],
	isNew: false,
	isPremium: false,
	tags: [] as string[],
};

const columns: ContentColumn<Meditation>[] = [
	{
		key: "title",
		label: "Title",
		render: (item) => (
			<div>
				<p className="font-medium">{item.title}</p>
				<p className="text-xs text-earth-500 dark:text-[#B5AFA3] line-clamp-1">{item.description}</p>
			</div>
		),
	},
	{ key: "category", label: "Category", render: (item) => <span className="capitalize">{item.category}</span> },
	{ key: "duration", label: "Duration", render: (item) => `${item.duration}m`, className: "text-right" },
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

export function MeditationManager() {
	const [items, setItems] = useState<Meditation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingItem, setEditingItem] = useState<Meditation | null>(null);
	const [form, setForm] = useState(emptyMeditation);

	const fetchItems = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/admin/meditations");
			const json = await res.json();
			setItems(json.items || []);
		} catch (err) {
			console.error("Failed to fetch meditations:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const openAdd = () => {
		setEditingItem(null);
		setForm(emptyMeditation);
		setIsModalOpen(true);
	};

	const openEdit = (item: Meditation) => {
		setEditingItem(item);
		setForm({
			title: item.title,
			description: item.description,
			duration: item.duration,
			category: item.category,
			audioUrl: item.audioUrl,
			imageUrl: item.imageUrl,
			mood: item.mood,
			isNew: item.isNew ?? false,
			isPremium: item.isPremium ?? false,
			tags: item.tags ?? [],
		});
		setIsModalOpen(true);
	};

	const handleDelete = async (item: Meditation) => {
		if (!confirm(`Delete "${item.title}"?`)) return;
		await fetch(`/api/admin/meditations/${item.id}`, { method: "DELETE" });
		fetchItems();
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			if (editingItem) {
				await fetch(`/api/admin/meditations/${editingItem.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			} else {
				await fetch("/api/admin/meditations", {
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

	const toggleMood = (mood: Mood) => {
		setForm((prev) => ({
			...prev,
			mood: prev.mood.includes(mood) ? prev.mood.filter((m) => m !== mood) : [...prev.mood, mood],
		}));
	};

	return (
		<>
			<ContentTable
				title="Meditations"
				items={items}
				columns={columns}
				searchField={(item) => `${item.title} ${item.description} ${item.category}`}
				getId={(item) => item.id}
				onAdd={openAdd}
				onEdit={openEdit}
				onDelete={handleDelete}
				isLoading={isLoading}
			/>

			<ContentFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingItem ? "Edit Meditation" : "New Meditation"}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			>
				<FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
				<FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
				<div className="grid grid-cols-2 gap-4">
					<FormInput label="Duration (minutes)" type="number" value={form.duration} onChange={(v) => setForm({ ...form, duration: parseInt(v) || 0 })} />
					<FormSelect label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v as MeditationCategory })} options={categoryOptions} />
				</div>
				<FormInput label="Audio URL" value={form.audioUrl} onChange={(v) => setForm({ ...form, audioUrl: v })} placeholder="/audio/..." />
				<FormInput label="Image URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="/images/..." />

				<div>
					<label className="mb-1.5 block text-sm font-medium text-earth-700 dark:text-[#D9D3C8]">Mood Tags</label>
					<div className="flex flex-wrap gap-2">
						{moodOptions.map((mood) => (
							<button
								key={mood}
								type="button"
								onClick={() => toggleMood(mood)}
								className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
									form.mood.includes(mood)
										? "border-[rgb(var(--sage-400))] bg-[rgb(var(--sage-100))] text-[rgb(var(--sage-700))]"
										: "border-[rgb(var(--sage-200))] text-[rgb(var(--earth-600))] hover:border-[rgb(var(--sage-300))] hover:bg-[rgb(var(--sage-50))]"
								}`}
							>
								{mood}
							</button>
						))}
					</div>
				</div>

				<ArrayFieldEditor label="Tags" values={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />

				<div className="flex gap-4">
					<FormCheckbox label="Premium" checked={form.isPremium} onChange={(v) => setForm({ ...form, isPremium: v })} />
					<FormCheckbox label="New" checked={form.isNew} onChange={(v) => setForm({ ...form, isNew: v })} />
				</div>
			</ContentFormModal>
		</>
	);
}
