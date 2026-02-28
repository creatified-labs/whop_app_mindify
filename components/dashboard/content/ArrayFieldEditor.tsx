"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface ArrayFieldEditorProps {
	label: string;
	values: string[];
	onChange: (values: string[]) => void;
	placeholder?: string;
}

export function ArrayFieldEditor({ label, values, onChange, placeholder }: ArrayFieldEditorProps) {
	const [inputValue, setInputValue] = useState("");

	const addItem = () => {
		const trimmed = inputValue.trim();
		if (trimmed && !values.includes(trimmed)) {
			onChange([...values, trimmed]);
			setInputValue("");
		}
	};

	const removeItem = (index: number) => {
		onChange(values.filter((_, i) => i !== index));
	};

	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-earth-700 dark:text-[#D9D3C8]">
				{label}
			</label>
			<div className="flex gap-2">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							addItem();
						}
					}}
					placeholder={placeholder || `Add ${label.toLowerCase()}...`}
					className="flex-1 rounded-lg border border-sage-200 bg-cream-50 px-3 py-2 text-sm text-earth-900 placeholder-earth-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
				/>
				<button
					type="button"
					onClick={addItem}
					className="flex items-center gap-1 rounded-lg bg-[rgb(var(--sage-600))] px-3 py-2 text-sm text-white shadow-sm hover:bg-[rgb(var(--sage-700))]"
				>
					<Plus className="h-4 w-4" />
				</button>
			</div>
			{values.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-2">
					{values.map((item, index) => (
						<span
							key={index}
							className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 text-xs text-sage-700 dark:bg-sage-900/30 dark:text-sage-400"
						>
							{item}
							<button
								type="button"
								onClick={() => removeItem(index)}
								className="ml-1 rounded-full p-0.5 hover:bg-sage-200 dark:hover:bg-sage-800/50"
							>
								<X className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
