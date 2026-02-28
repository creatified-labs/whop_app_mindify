"use client";

import { useState, useEffect, useCallback } from "react";
import type { KnowledgeArticle, KnowledgeCategory } from "@/lib/mockData/articles";
import { ContentTable, type ContentColumn } from "./ContentTable";
import { ContentFormModal, FormInput, FormSelect, FormTextarea } from "./ContentFormModal";
import { ArrayFieldEditor } from "./ArrayFieldEditor";

const categoryOptions: { value: KnowledgeCategory; label: string }[] = [
	{ value: "neuroscience", label: "Neuroscience" },
	{ value: "psychology", label: "Psychology" },
	{ value: "breathwork", label: "Breathwork" },
	{ value: "sleep", label: "Sleep" },
	{ value: "focus", label: "Focus" },
	{ value: "productivity", label: "Productivity" },
];

const emptyArticle = {
	title: "",
	category: "neuroscience" as KnowledgeCategory,
	author: "",
	readTimeMinutes: 5,
	thumbnail: "",
	content: "",
	keyTakeaways: [] as string[],
	actionSteps: [] as string[],
};

const columns: ContentColumn<KnowledgeArticle>[] = [
	{
		key: "title",
		label: "Title",
		render: (item) => (
			<div>
				<p className="font-medium">{item.title}</p>
				<p className="text-xs text-earth-500 dark:text-[#B5AFA3]">{item.slug}</p>
			</div>
		),
	},
	{ key: "category", label: "Category", render: (item) => <span className="capitalize">{item.category}</span> },
	{ key: "author", label: "Author", render: (item) => item.author },
	{ key: "readTime", label: "Read Time", render: (item) => `${item.readTimeMinutes}m`, className: "text-right" },
];

export function ArticleManager() {
	const [items, setItems] = useState<KnowledgeArticle[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingItem, setEditingItem] = useState<KnowledgeArticle | null>(null);
	const [form, setForm] = useState(emptyArticle);

	const fetchItems = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/admin/articles");
			const json = await res.json();
			setItems(json.items || []);
		} catch (err) {
			console.error("Failed to fetch articles:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const openAdd = () => {
		setEditingItem(null);
		setForm(emptyArticle);
		setIsModalOpen(true);
	};

	const openEdit = (item: KnowledgeArticle) => {
		setEditingItem(item);
		setForm({
			title: item.title,
			category: item.category,
			author: item.author,
			readTimeMinutes: item.readTimeMinutes,
			thumbnail: item.thumbnail,
			content: item.content,
			keyTakeaways: item.keyTakeaways,
			actionSteps: item.actionSteps,
		});
		setIsModalOpen(true);
	};

	const handleDelete = async (item: KnowledgeArticle) => {
		if (!confirm(`Delete "${item.title}"?`)) return;
		await fetch(`/api/admin/articles/${item.slug}`, { method: "DELETE" });
		fetchItems();
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			if (editingItem) {
				await fetch(`/api/admin/articles/${editingItem.slug}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				});
			} else {
				await fetch("/api/admin/articles", {
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
				title="Knowledge Articles"
				items={items}
				columns={columns}
				searchField={(item) => `${item.title} ${item.author} ${item.category}`}
				getId={(item) => item.slug}
				onAdd={openAdd}
				onEdit={openEdit}
				onDelete={handleDelete}
				isLoading={isLoading}
			/>

			<ContentFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingItem ? "Edit Article" : "New Article"}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			>
				<FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
				<div className="grid grid-cols-2 gap-4">
					<FormSelect label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v as KnowledgeCategory })} options={categoryOptions} />
					<FormInput label="Author" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
				</div>
				<div className="grid grid-cols-2 gap-4">
					<FormInput label="Read Time (minutes)" type="number" value={form.readTimeMinutes} onChange={(v) => setForm({ ...form, readTimeMinutes: parseInt(v) || 0 })} />
					<FormInput label="Thumbnail URL" value={form.thumbnail} onChange={(v) => setForm({ ...form, thumbnail: v })} placeholder="/images/knowledge/..." />
				</div>
				<FormTextarea label="Content (Markdown)" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={12} placeholder="# Article Title..." />
				<ArrayFieldEditor label="Key Takeaways" values={form.keyTakeaways} onChange={(v) => setForm({ ...form, keyTakeaways: v })} />
				<ArrayFieldEditor label="Action Steps" values={form.actionSteps} onChange={(v) => setForm({ ...form, actionSteps: v })} />
			</ContentFormModal>
		</>
	);
}
