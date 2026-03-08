"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
	Upload,
	Link2,
	Music,
	Trash2,
	Copy,
	Loader2,
	CheckCircle2,
	XCircle,
	FileAudio,
	FileVideo,
	ExternalLink,
} from "lucide-react";
import type { MediaLibraryItem } from "@/lib/types";

type FilterTab = "all" | "audio" | "video" | "link";

type UploadFileStatus = {
	file: File;
	status: "pending" | "uploading" | "done" | "error";
	error?: string;
};

function SectionCard({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-[rgb(var(--sage-200)/0.5)] bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#1A1D23]">
			<h3 className="text-lg font-semibold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
				{title}
			</h3>
			{description && (
				<p className="mt-1 text-sm text-[rgb(var(--earth-500))] dark:text-[#B5AFA3]">
					{description}
				</p>
			)}
			<div className="mt-5 space-y-4">{children}</div>
		</div>
	);
}

function formatFileSize(bytes: number | null | undefined): string {
	if (!bytes) return "";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function MediaLibrarySection({ companyId }: { companyId: string }) {
	const [items, setItems] = useState<MediaLibraryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filterTab, setFilterTab] = useState<FilterTab>("all");
	const [copiedId, setCopiedId] = useState<string | null>(null);

	// Upload state
	const [uploadFiles, setUploadFiles] = useState<UploadFileStatus[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	// Link import state
	const [linkText, setLinkText] = useState("");
	const [isImporting, setIsImporting] = useState(false);

	const fetchItems = useCallback(async () => {
		try {
			const params = new URLSearchParams({ company_id: companyId });
			if (filterTab !== "all") params.set("type", filterTab);
			const res = await fetch(`/api/admin/media-library?${params}`);
			if (!res.ok) throw new Error("Failed to fetch");
			const data = await res.json();
			setItems(data.items || []);
		} catch (err) {
			console.error("Failed to fetch media items:", err);
		} finally {
			setIsLoading(false);
		}
	}, [filterTab, companyId]);

	useEffect(() => {
		setIsLoading(true);
		fetchItems();
	}, [fetchItems]);

	// --- Audio Upload ---
	const handleFilesSelected = (files: FileList | File[]) => {
		const newFiles: UploadFileStatus[] = Array.from(files).map((f) => ({
			file: f,
			status: "pending" as const,
		}));
		setUploadFiles((prev) => [...prev, ...newFiles]);
	};

	const processUploads = async () => {
		if (uploadFiles.length === 0) return;
		setIsUploading(true);

		for (let i = 0; i < uploadFiles.length; i++) {
			const item = uploadFiles[i];
			if (item.status !== "pending") continue;

			setUploadFiles((prev) =>
				prev.map((f, idx) =>
					idx === i ? { ...f, status: "uploading" } : f
				)
			);

			try {
				// Step 1: Get signed upload URL
				const fileContentType = item.file.type || "audio/mpeg";
				const isVideo = fileContentType.startsWith("video/");

				const uploadRes = await fetch(`/api/admin/media-library?company_id=${encodeURIComponent(companyId)}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						action: "upload",
						fileName: item.file.name,
						contentType: fileContentType,
						fileSize: item.file.size,
					}),
				});

				if (!uploadRes.ok) {
					const err = await uploadRes.json();
					throw new Error(err.error || "Failed to get upload URL");
				}

				const { signedUrl, token, path, publicUrl } =
					await uploadRes.json();

				// Step 2: Upload file to Supabase Storage
				const storageRes = await fetch(signedUrl, {
					method: "PUT",
					headers: {
						"Content-Type": fileContentType,
						"x-upsert": "false",
					},
					body: item.file,
				});

				if (!storageRes.ok) {
					throw new Error("Failed to upload file to storage");
				}

				// Step 3: Register in DB
				const id = crypto.randomUUID();
				const registerRes = await fetch(`/api/admin/media-library?company_id=${encodeURIComponent(companyId)}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						action: "register",
						items: [
							{
								id,
								name: item.file.name.replace(
									/\.[^/.]+$/,
									""
								),
								mediaType: isVideo ? "video" : "audio",
								url: publicUrl,
								storagePath: path,
								mimeType: fileContentType,
								fileSizeBytes: item.file.size,
								tags: [],
							},
						],
					}),
				});

				if (!registerRes.ok) {
					throw new Error("Failed to register media item");
				}

				setUploadFiles((prev) =>
					prev.map((f, idx) =>
						idx === i ? { ...f, status: "done" } : f
					)
				);
			} catch (err) {
				setUploadFiles((prev) =>
					prev.map((f, idx) =>
						idx === i
							? {
									...f,
									status: "error",
									error:
										err instanceof Error
											? err.message
											: "Upload failed",
								}
							: f
					)
				);
			}
		}

		setIsUploading(false);
		fetchItems();
	};

	// --- Link Import ---
	const handleImportLinks = async () => {
		const urls = linkText
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l.length > 0);

		if (urls.length === 0) return;
		setIsImporting(true);

		try {
			const items = urls.map((url) => {
				const id = crypto.randomUUID();
				let name = url;
				try {
					const parsed = new URL(url);
					name =
						parsed.pathname.split("/").pop() ||
						parsed.hostname;
					name = decodeURIComponent(name).replace(
						/[-_]/g,
						" "
					);
					if (name.includes(".")) {
						name = name.replace(/\.[^/.]+$/, "");
					}
				} catch {
					// keep raw URL as name
				}
				return {
					id,
					name,
					mediaType: "link" as const,
					url,
					tags: [],
				};
			});

			const res = await fetch(`/api/admin/media-library?company_id=${encodeURIComponent(companyId)}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "register", items }),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to import links");
			}

			setLinkText("");
			fetchItems();
		} catch (err) {
			console.error("Failed to import links:", err);
		} finally {
			setIsImporting(false);
		}
	};

	// --- Delete ---
	const handleDelete = async (id: string) => {
		try {
			const res = await fetch(
				`/api/admin/media-library?id=${encodeURIComponent(id)}&company_id=${encodeURIComponent(companyId)}`,
				{ method: "DELETE" }
			);
			if (!res.ok) throw new Error("Failed to delete");
			setItems((prev) => prev.filter((item) => item.id !== id));
		} catch (err) {
			console.error("Failed to delete:", err);
		}
	};

	// --- Copy URL ---
	const handleCopyUrl = (id: string, url: string) => {
		navigator.clipboard.writeText(url);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	// --- Drag & Drop ---
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = () => setIsDragging(false);
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files.length > 0) {
			handleFilesSelected(e.dataTransfer.files);
		}
	};

	return (
		<div className="space-y-6">
			{/* Upload Audio Files */}
			<SectionCard
				title="Upload Media Files"
				description="Drag and drop audio or video files to upload"
			>
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() => fileInputRef.current?.click()}
					className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
						isDragging
							? "border-[rgb(var(--sage-500))] bg-[rgb(var(--sage-50))] dark:border-[rgb(var(--sage-400))] dark:bg-[rgb(var(--sage-900)/0.1)]"
							: "border-[rgb(var(--sage-200))] bg-[rgb(var(--cream-50))] hover:border-[rgb(var(--sage-400))] dark:border-white/10 dark:bg-[#14171C] dark:hover:border-white/20"
					}`}
				>
					<Upload className="mb-3 h-8 w-8 text-[rgb(var(--sage-400))]" />
					<p className="text-sm font-medium text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">
						Drop audio or video files here or click to browse
					</p>
					<p className="mt-1 text-xs text-[rgb(var(--earth-400))] dark:text-[#B5AFA3]">
						MP3, WAV, M4A, OGG, AAC, MP4, WebM, MOV — audio up to 100MB, video up to 500MB
					</p>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept="audio/*,video/*"
						className="hidden"
						onChange={(e) => {
							if (e.target.files)
								handleFilesSelected(e.target.files);
							e.target.value = "";
						}}
					/>
				</div>

				{/* Upload queue */}
				{uploadFiles.length > 0 && (
					<div className="space-y-2">
						{uploadFiles.map((item, idx) => (
							<div
								key={idx}
								className="flex items-center gap-3 rounded-lg border border-[rgb(var(--sage-200)/0.5)] bg-[rgb(var(--cream-50))] px-4 py-2.5 dark:border-white/5 dark:bg-[#14171C]"
							>
								{item.file.type.startsWith("video/") ? (
									<FileVideo className="h-4 w-4 shrink-0 text-purple-500" />
								) : (
									<FileAudio className="h-4 w-4 shrink-0 text-[rgb(var(--sage-500))]" />
								)}
								<span className="flex-1 truncate text-sm text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">
									{item.file.name}
								</span>
								<span className="text-xs text-[rgb(var(--earth-400))] dark:text-[#B5AFA3]">
									{formatFileSize(item.file.size)}
								</span>
								{item.status === "pending" && (
									<span className="text-xs text-[rgb(var(--earth-400))] dark:text-[#B5AFA3]">
										Pending
									</span>
								)}
								{item.status === "uploading" && (
									<Loader2 className="h-4 w-4 animate-spin text-[rgb(var(--sage-500))]" />
								)}
								{item.status === "done" && (
									<CheckCircle2 className="h-4 w-4 text-green-500" />
								)}
								{item.status === "error" && (
									<span
										className="flex items-center gap-1 text-xs text-red-500"
										title={item.error}
									>
										<XCircle className="h-4 w-4" />
										Failed
									</span>
								)}
							</div>
						))}

						<div className="flex gap-2">
							<button
								onClick={processUploads}
								disabled={
									isUploading ||
									uploadFiles.every(
										(f) => f.status !== "pending"
									)
								}
								className="flex items-center gap-2 rounded-lg bg-[rgb(var(--sage-600))] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[rgb(var(--sage-700))] disabled:opacity-50"
							>
								{isUploading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Upload className="h-4 w-4" />
								)}
								{isUploading ? "Uploading..." : "Upload All"}
							</button>
							<button
								onClick={() => setUploadFiles([])}
								disabled={isUploading}
								className="rounded-lg border border-[rgb(var(--sage-200))] px-4 py-2 text-sm font-medium text-[rgb(var(--earth-600))] transition-colors hover:bg-[rgb(var(--cream-100))] disabled:opacity-50 dark:border-white/10 dark:text-[#CFC7BB] dark:hover:bg-[#1E2228]"
							>
								Clear
							</button>
						</div>
					</div>
				)}
			</SectionCard>

			{/* Import External Links */}
			<SectionCard
				title="Import External Links"
				description="Paste URLs (one per line) to add them to your media library"
			>
				<textarea
					value={linkText}
					onChange={(e) => setLinkText(e.target.value)}
					placeholder={"https://example.com/audio1.mp3\nhttps://example.com/audio2.mp3"}
					rows={4}
					className="w-full rounded-lg border border-[rgb(var(--sage-200))] bg-[rgb(var(--cream-50))] px-3 py-2 text-sm text-[rgb(var(--earth-900))] placeholder-[rgb(var(--earth-400))] focus:border-[rgb(var(--sage-400))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-400)/0.2)] dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
				/>
				<button
					onClick={handleImportLinks}
					disabled={isImporting || linkText.trim().length === 0}
					className="flex items-center gap-2 rounded-lg bg-[rgb(var(--sage-600))] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[rgb(var(--sage-700))] disabled:opacity-50"
				>
					{isImporting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Link2 className="h-4 w-4" />
					)}
					{isImporting ? "Importing..." : "Import Links"}
				</button>
			</SectionCard>

			{/* Media Library List */}
			<SectionCard title="Media Library">
				{/* Filter tabs */}
				<div className="flex gap-1 rounded-lg bg-[rgb(var(--cream-100))] p-1 dark:bg-[#14171C]">
					{(
						[
							{ id: "all", label: "All" },
							{ id: "audio", label: "Audio" },
							{ id: "video", label: "Video" },
							{ id: "link", label: "Links" },
						] as const
					).map((tab) => (
						<button
							key={tab.id}
							onClick={() => setFilterTab(tab.id)}
							className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
								filterTab === tab.id
									? "bg-white text-[rgb(var(--earth-900))] shadow-sm dark:bg-[#1A1D23] dark:text-[#F4EFE6]"
									: "text-[rgb(var(--earth-500))] hover:text-[rgb(var(--earth-700))] dark:text-[#B5AFA3] dark:hover:text-[#D9D3C8]"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Items list */}
				{isLoading ? (
					<div className="flex justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-[rgb(var(--sage-500))]" />
					</div>
				) : items.length === 0 ? (
					<div className="py-8 text-center">
						<Music className="mx-auto mb-2 h-8 w-8 text-[rgb(var(--earth-300))] dark:text-[#B5AFA3]" />
						<p className="text-sm text-[rgb(var(--earth-500))] dark:text-[#B5AFA3]">
							No media items yet. Upload audio files or import
							links above.
						</p>
					</div>
				) : (
					<div className="space-y-2">
						{items.map((item) => (
							<div
								key={item.id}
								className="flex items-center gap-3 rounded-lg border border-[rgb(var(--sage-200)/0.5)] bg-[rgb(var(--cream-50))] px-4 py-3 transition-colors hover:bg-white dark:border-white/5 dark:bg-[#14171C] dark:hover:bg-[#1A1D23]"
							>
								{/* Icon */}
								{item.mediaType === "audio" ? (
									<FileAudio className="h-5 w-5 shrink-0 text-[rgb(var(--sage-500))]" />
								) : item.mediaType === "video" ? (
									<FileVideo className="h-5 w-5 shrink-0 text-purple-500" />
								) : (
									<ExternalLink className="h-5 w-5 shrink-0 text-blue-500" />
								)}

								{/* Info */}
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
										{item.name}
									</p>
									<div className="flex items-center gap-2 text-xs text-[rgb(var(--earth-400))] dark:text-[#B5AFA3]">
										<span
											className={`rounded px-1.5 py-0.5 font-medium ${
												item.mediaType === "audio"
													? "bg-[rgb(var(--sage-100))] text-[rgb(var(--sage-700))] dark:bg-[rgb(var(--sage-900)/0.3)] dark:text-[rgb(var(--sage-300))]"
													: item.mediaType === "video"
														? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
														: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
											}`}
										>
											{item.mediaType === "audio"
												? "Audio"
												: item.mediaType === "video"
													? "Video"
													: "Link"}
										</span>
										{item.fileSizeBytes && (
											<span>
												{formatFileSize(
													item.fileSizeBytes
												)}
											</span>
										)}
										<span>
											{formatDate(item.createdAt)}
										</span>
										{item.tags.length > 0 && (
											<span className="truncate">
												{item.tags.join(", ")}
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<button
									onClick={() =>
										handleCopyUrl(item.id, item.url)
									}
									className="rounded-lg p-2 text-[rgb(var(--earth-400))] transition-colors hover:bg-[rgb(var(--cream-100))] hover:text-[rgb(var(--earth-600))] dark:text-[#B5AFA3] dark:hover:bg-[#1E2228] dark:hover:text-[#D9D3C8]"
									title="Copy URL"
								>
									{copiedId === item.id ? (
										<CheckCircle2 className="h-4 w-4 text-green-500" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</button>
								<button
									onClick={() => handleDelete(item.id)}
									className="rounded-lg p-2 text-[rgb(var(--earth-400))] transition-colors hover:bg-red-50 hover:text-red-600 dark:text-[#B5AFA3] dark:hover:bg-red-900/10 dark:hover:text-red-400"
									title="Delete"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						))}
					</div>
				)}
			</SectionCard>
		</div>
	);
}
