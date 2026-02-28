"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ContentFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	onSubmit: () => void;
	isSubmitting?: boolean;
	submitLabel?: string;
}

export function ContentFormModal({
	isOpen,
	onClose,
	title,
	children,
	onSubmit,
	isSubmitting = false,
	submitLabel = "Save",
}: ContentFormModalProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						ref={overlayRef}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-50 bg-black/50"
					/>

					{/* Slide-over panel */}
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto bg-white shadow-xl dark:bg-[#0E1012]"
					>
						{/* Header */}
						<div className="sticky top-0 z-10 flex items-center justify-between border-b border-sage-200 bg-white px-6 py-4 dark:border-white/10 dark:bg-[#0E1012]">
							<h2 className="text-lg font-semibold text-earth-900 dark:text-[#F4EFE6]">
								{title}
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="rounded-lg p-2 text-earth-500 hover:bg-cream-100 dark:text-[#B5AFA3] dark:hover:bg-[#1E2228]"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Body */}
						<div className="space-y-4 p-6">{children}</div>

						{/* Footer */}
						<div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-sage-200 bg-white px-6 py-4 dark:border-white/10 dark:bg-[#0E1012]">
							<button
								type="button"
								onClick={onClose}
								className="rounded-xl border border-sage-300 px-4 py-2.5 text-sm font-medium text-earth-700 hover:bg-cream-100 dark:border-white/10 dark:text-[#D9D3C8] dark:hover:bg-[#1E2228]"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={onSubmit}
								disabled={isSubmitting}
								className="rounded-xl bg-[rgb(var(--sage-600))] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[rgb(var(--sage-700))] disabled:opacity-50"
							>
								{isSubmitting ? "Saving..." : submitLabel}
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

// Reusable form field components
export function FormField({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-earth-700 dark:text-[#D9D3C8]">
				{label}
			</label>
			{children}
		</div>
	);
}

export function FormInput({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
	required,
}: {
	label: string;
	value: string | number;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
	required?: boolean;
}) {
	return (
		<FormField label={label}>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				required={required}
				className="w-full rounded-lg border border-sage-200 bg-cream-50 px-3 py-2 text-sm text-earth-900 placeholder-earth-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
			/>
		</FormField>
	);
}

export function FormSelect({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<FormField label={label}>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-sage-200 bg-cream-50 px-3 py-2 text-sm text-earth-900 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6]"
			>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value} className="bg-white text-earth-900 dark:bg-[#14171C] dark:text-[#F4EFE6]">
						{opt.label}
					</option>
				))}
			</select>
		</FormField>
	);
}

export function FormTextarea({
	label,
	value,
	onChange,
	rows = 3,
	placeholder,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	rows?: number;
	placeholder?: string;
}) {
	return (
		<FormField label={label}>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				rows={rows}
				placeholder={placeholder}
				className="w-full rounded-lg border border-sage-200 bg-cream-50 px-3 py-2 text-sm text-earth-900 placeholder-earth-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
			/>
		</FormField>
	);
}

export function FormCheckbox({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<label className="flex items-center gap-2 text-sm text-earth-700 dark:text-[#D9D3C8]">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="rounded border-sage-300 bg-cream-50 text-sage-600 focus:ring-sage-500 dark:border-white/20 dark:bg-[#14171C] dark:checked:bg-sage-500"
			/>
			{label}
		</label>
	);
}
