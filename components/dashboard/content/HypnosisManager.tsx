"use client";

import { useState, useEffect, useCallback } from "react";
import type { HypnosisSession, HypnosisTheme } from "@/lib/types";
import { ContentTable, type ContentColumn } from "./ContentTable";
import { ContentFormModal, FormInput, FormSelect, FormTextarea, FormCheckbox } from "./ContentFormModal";
import { AudioUploadButton } from "./AudioUploadButton";

const themeOptions: { value: HypnosisTheme; label: string }[] = [
	{ value: "procrastination", label: "Procrastination" },
	{ value: "overthinking", label: "Overthinking" },
	{ value: "confidence", label: "Confidence" },
	{ value: "productivity", label: "Productivity" },
	{ value: "smoking", label: "Smoking" },
	{ value: "nervous-system", label: "Nervous System" },
	{ value: "performance", label: "Performance" },
	{ value: "habits", label: "Habits" },
];

const emptySession = {
	title: "",
	description: "",
	duration: 20,
	theme: "confidence" as HypnosisTheme,
	audioUrl: "",
	hasBinaural: false,
	daytimeVersion: "",
	nighttimeVersion: "",
	isPremium: false,
	externalUrl: "",
};

const columns: ContentColumn<HypnosisSession>[] = [
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
	{
		key: "theme",
		label: "Theme",
		render: (item) => <span className="capitalize">{item.theme.replace("-", " ")}</span>,
	},
	{ key: "duration", label: "Duration", render: (item) => `${item.duration}m`, className: "text-right" },
	{
		key: "binaural",
		label: "Binaural",
		render: (item) => (item.hasBinaural ? "Yes" : "No"),
	},
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

export function HypnosisManager({ companyId }: { companyId: string }) {
	const [items, setItems] = useState<HypnosisSession[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingItem, setEditingItem] = useState<HypnosisSession | null>(null);
	const [form, setForm] = useState(emptySession);

	const fetchItems = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch(`/api/admin/hypnosis?company_id=${encodeURIComponent(companyId)}`);
			const json = await res.json();
			setItems(json.items || []);
		} catch (err) {
			console.error("Failed to fetch hypnosis sessions:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const openAdd = () => {
		setEditingItem(null);
		setForm(emptySession);
		setIsModalOpen(true);
	};

	const openEdit = (item: HypnosisSession) => {
		setEditingItem(item);
		setForm({
			title: item.title,
			description: item.description,
			duration: item.duration,
			theme: item.theme,
			audioUrl: item.audioUrl,
			hasBinaural: item.hasBinaural,
			daytimeVersion: item.daytimeVersion ?? "",
			nighttimeVersion: item.nighttimeVersion ?? "",
			isPremium: item.isPremium ?? false,
			externalUrl: item.externalUrl ?? "",
		});
		setIsModalOpen(true);
	};

	const handleDelete = async (item: HypnosisSession) => {
		if (!confirm(`Delete "${item.title}"?`)) return;
		await fetch(`/api/admin/hypnosis/${item.id}?company_id=${encodeURIComponent(companyId)}`, { method: "DELETE" });
		fetchItems();
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			if (editingItem) {
				await fetch(`/api/admin/hypnosis/${editingItem.id}?company_id=${encodeURIComponent(companyId)}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			} else {
				await fetch(`/api/admin/hypnosis?company_id=${encodeURIComponent(companyId)}`, {
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
				title="Hypnosis Sessions"
				items={items}
				columns={columns}
				searchField={(item) => `${item.title} ${item.description} ${item.theme}`}
				getId={(item) => item.id}
				onAdd={openAdd}
				onEdit={openEdit}
				onDelete={handleDelete}
				isLoading={isLoading}
			/>

			<ContentFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingItem ? "Edit Hypnosis Session" : "New Hypnosis Session"}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			>
				<FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
				<FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
				<div className="grid grid-cols-2 gap-4">
					<FormInput label="Duration (minutes)" type="number" value={form.duration} onChange={(v) => setForm({ ...form, duration: parseInt(v) || 0 })} />
					<FormSelect label="Theme" value={form.theme} onChange={(v) => setForm({ ...form, theme: v as HypnosisTheme })} options={themeOptions} />
				</div>
				<FormInput label="Audio URL" value={form.audioUrl} onChange={(v) => setForm({ ...form, audioUrl: v })} placeholder="/audio/..." />
				<AudioUploadButton companyId={companyId} contentType="hypnosis" onUploadComplete={(url) => setForm((prev) => ({ ...prev, audioUrl: url }))} />
				<FormInput label="Daytime Version URL" value={form.daytimeVersion} onChange={(v) => setForm({ ...form, daytimeVersion: v })} placeholder="/audio/..." />
				<AudioUploadButton companyId={companyId} contentType="hypnosis" onUploadComplete={(url) => setForm((prev) => ({ ...prev, daytimeVersion: url }))} />
				<FormInput label="Nighttime Version URL" value={form.nighttimeVersion} onChange={(v) => setForm({ ...form, nighttimeVersion: v })} placeholder="/audio/..." />
				<AudioUploadButton companyId={companyId} contentType="hypnosis" onUploadComplete={(url) => setForm((prev) => ({ ...prev, nighttimeVersion: url }))} />
				<div className="flex gap-4">
					<FormCheckbox label="Has Binaural Beats" checked={form.hasBinaural} onChange={(v) => setForm({ ...form, hasBinaural: v })} />
					<FormCheckbox label="Premium" checked={form.isPremium} onChange={(v) => setForm({ ...form, isPremium: v })} />
				</div>
				<FormInput label="External URL" value={form.externalUrl} onChange={(v) => setForm({ ...form, externalUrl: v })} placeholder="https://whop.com/..." />
			</ContentFormModal>
		</>
	);
}
