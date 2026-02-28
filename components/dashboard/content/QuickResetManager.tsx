"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuickReset, QuickResetType } from "@/lib/types";
import { ContentTable, type ContentColumn } from "./ContentTable";
import { ContentFormModal, FormInput, FormSelect, FormTextarea } from "./ContentFormModal";

const typeOptions: { value: QuickResetType; label: string }[] = [
	{ value: "breath", label: "Breath" },
	{ value: "anxiety", label: "Anxiety" },
	{ value: "focus", label: "Focus" },
	{ value: "calm", label: "Calm" },
	{ value: "pattern-interrupt", label: "Pattern Interrupt" },
];

const emptyReset = {
	title: "",
	duration: 2,
	type: "breath" as QuickResetType,
	audioUrl: "",
	instructions: "",
};

const columns: ContentColumn<QuickReset>[] = [
	{
		key: "title",
		label: "Title",
		render: (item) => (
			<div>
				<p className="font-medium">{item.title}</p>
				<p className="text-xs text-earth-500 dark:text-[#B5AFA3] line-clamp-1">{item.instructions}</p>
			</div>
		),
	},
	{
		key: "type",
		label: "Type",
		render: (item) => <span className="capitalize">{item.type.replace("-", " ")}</span>,
	},
	{ key: "duration", label: "Duration", render: (item) => `${item.duration}m`, className: "text-right" },
];

export function QuickResetManager() {
	const [items, setItems] = useState<QuickReset[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingItem, setEditingItem] = useState<QuickReset | null>(null);
	const [form, setForm] = useState(emptyReset);

	const fetchItems = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/admin/quick-resets");
			const json = await res.json();
			setItems(json.items || []);
		} catch (err) {
			console.error("Failed to fetch quick resets:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const openAdd = () => {
		setEditingItem(null);
		setForm(emptyReset);
		setIsModalOpen(true);
	};

	const openEdit = (item: QuickReset) => {
		setEditingItem(item);
		setForm({
			title: item.title,
			duration: item.duration,
			type: item.type,
			audioUrl: item.audioUrl,
			instructions: item.instructions,
		});
		setIsModalOpen(true);
	};

	const handleDelete = async (item: QuickReset) => {
		if (!confirm(`Delete "${item.title}"?`)) return;
		await fetch(`/api/admin/quick-resets/${item.id}`, { method: "DELETE" });
		fetchItems();
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			if (editingItem) {
				await fetch(`/api/admin/quick-resets/${editingItem.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			} else {
				await fetch("/api/admin/quick-resets", {
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
				title="Quick Resets"
				items={items}
				columns={columns}
				searchField={(item) => `${item.title} ${item.instructions} ${item.type}`}
				getId={(item) => item.id}
				onAdd={openAdd}
				onEdit={openEdit}
				onDelete={handleDelete}
				isLoading={isLoading}
			/>

			<ContentFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingItem ? "Edit Quick Reset" : "New Quick Reset"}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			>
				<FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
				<div className="grid grid-cols-2 gap-4">
					<FormInput label="Duration (minutes)" type="number" value={form.duration} onChange={(v) => setForm({ ...form, duration: parseInt(v) || 0 })} />
					<FormSelect label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v as QuickResetType })} options={typeOptions} />
				</div>
				<FormInput label="Audio URL" value={form.audioUrl} onChange={(v) => setForm({ ...form, audioUrl: v })} placeholder="/audio/quick-resets/..." />
				<FormTextarea label="Instructions" value={form.instructions} onChange={(v) => setForm({ ...form, instructions: v })} rows={3} />
			</ContentFormModal>
		</>
	);
}
