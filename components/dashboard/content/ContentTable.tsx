"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

export interface ContentColumn<T> {
	key: string;
	label: string;
	render: (item: T) => React.ReactNode;
	className?: string;
}

interface ContentTableProps<T> {
	title: string;
	items: T[];
	columns: ContentColumn<T>[];
	searchField: (item: T) => string;
	getId: (item: T) => string;
	onAdd: () => void;
	onEdit: (item: T) => void;
	onDelete: (item: T) => void;
	isLoading?: boolean;
}

export function ContentTable<T>({
	title,
	items,
	columns,
	searchField,
	getId,
	onAdd,
	onEdit,
	onDelete,
	isLoading = false,
}: ContentTableProps<T>) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredItems = items.filter((item) =>
		searchField(item).toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="rounded-2xl border border-sage-200/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#1A1D23]">
			{/* Header */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<h2 className="text-xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
					{title}
				</h2>
				<button
					type="button"
					onClick={onAdd}
					className="flex items-center gap-2 rounded-xl bg-[rgb(var(--sage-600))] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[rgb(var(--sage-700))]"
				>
					<Plus className="h-4 w-4" />
					Add New
				</button>
			</div>

			{/* Search */}
			<div className="relative mb-4">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400 dark:text-[#B5AFA3]" />
				<input
					type="text"
					placeholder={`Search ${title.toLowerCase()}...`}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full rounded-lg border border-sage-200 bg-white py-2 pl-10 pr-4 text-sm text-earth-900 placeholder-earth-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
				/>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="py-12 text-center text-earth-500 dark:text-[#B5AFA3]">
					Loading...
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-sage-200 dark:border-white/10">
								{columns.map((col) => (
									<th
										key={col.key}
										className={`pb-3 text-left text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB] ${col.className || ""}`}
									>
										{col.label}
									</th>
								))}
								<th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-sage-200 dark:divide-white/10">
							{filteredItems.map((item, index) => (
								<motion.tr
									key={getId(item)}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, delay: index * 0.02 }}
									className="group transition-colors hover:bg-cream-100 dark:hover:bg-[#1E2228]"
								>
									{columns.map((col) => (
										<td
											key={col.key}
											className={`py-3 text-sm text-earth-900 dark:text-[#F4EFE6] ${col.className || ""}`}
										>
											{col.render(item)}
										</td>
									))}
									<td className="py-3 text-right">
										<div className="flex items-center justify-end gap-2">
											<button
												type="button"
												onClick={() => onEdit(item)}
												className="rounded-lg p-1.5 text-earth-500 hover:bg-sage-100 hover:text-sage-700 dark:text-[#B5AFA3] dark:hover:bg-sage-900/30 dark:hover:text-sage-400"
											>
												<Pencil className="h-4 w-4" />
											</button>
											<button
												type="button"
												onClick={() => onDelete(item)}
												className="rounded-lg p-1.5 text-earth-500 hover:bg-red-50 hover:text-red-600 dark:text-[#B5AFA3] dark:hover:bg-red-900/20 dark:hover:text-red-400"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>

					{filteredItems.length === 0 && (
						<div className="py-12 text-center">
							<p className="text-earth-600 dark:text-[#CFC7BB]">
								{searchTerm
									? "No items found matching your search"
									: "No items yet. Click \"Add New\" to get started."}
							</p>
						</div>
					)}
				</div>
			)}

			{/* Footer */}
			<div className="mt-4 text-sm text-earth-600 dark:text-[#CFC7BB]">
				Showing {filteredItems.length} of {items.length} items
			</div>
		</div>
	);
}
