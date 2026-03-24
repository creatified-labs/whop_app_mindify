"use client";

import { useState, useRef } from "react";
import { ImageIcon, Check, Loader2, AlertCircle } from "lucide-react";
import type { ImageContentType } from "@/lib/storage/imageStorage";

type UploadState = "idle" | "uploading" | "success" | "error";

interface ImageUploadButtonProps {
	onUploadComplete: (publicUrl: string) => void;
	contentType?: ImageContentType;
	companyId: string;
}

export function ImageUploadButton({ onUploadComplete, contentType = "general", companyId }: ImageUploadButtonProps) {
	const [state, setState] = useState<UploadState>("idle");
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setState("uploading");
		setError(null);
		setProgress("Getting upload URL...");

		try {
			// Step 1: Get signed upload URL from our API
			const res = await fetch(`/api/admin/upload/image?company_id=${encodeURIComponent(companyId)}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileName: file.name,
					contentType: file.type,
					folder: contentType,
				}),
			});

			if (!res.ok) {
				const json = await res.json();
				throw new Error(json.error || "Failed to get upload URL");
			}

			const { signedUrl, publicUrl } = await res.json();

			// Step 2: Upload file directly to Supabase Storage
			setProgress("Uploading image...");

			const uploadRes = await fetch(signedUrl, {
				method: "PUT",
				headers: {
					"Content-Type": file.type,
					"x-upsert": "false",
				},
				body: file,
			});

			if (!uploadRes.ok) {
				throw new Error("Failed to upload image to storage");
			}

			// Step 3: Report success
			setState("success");
			setProgress("Upload complete!");
			onUploadComplete(publicUrl);

			// Reset to idle after a brief delay
			setTimeout(() => {
				setState("idle");
				setProgress("");
			}, 2000);
		} catch (err) {
			setState("error");
			setError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			// Reset file input so the same file can be re-selected
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	return (
		<div className="flex items-center gap-2">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				className="hidden"
			/>

			<button
				type="button"
				onClick={handleClick}
				disabled={state === "uploading"}
				className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
					state === "success"
						? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
						: state === "error"
							? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
							: "bg-[rgb(var(--sage-100))] text-[rgb(var(--sage-700))] hover:bg-[rgb(var(--sage-200))] dark:bg-[rgb(var(--sage-900))]/30 dark:text-[rgb(var(--sage-400))] dark:hover:bg-[rgb(var(--sage-800))]/40"
				} disabled:opacity-50`}
			>
				{state === "uploading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
				{state === "success" && <Check className="h-3.5 w-3.5" />}
				{state === "error" && <AlertCircle className="h-3.5 w-3.5" />}
				{state === "idle" && <ImageIcon className="h-3.5 w-3.5" />}
				{state === "idle" ? "Upload Image" : progress}
			</button>

			{state === "error" && error && (
				<span className="text-xs text-red-600 dark:text-red-400">{error}</span>
			)}
		</div>
	);
}
