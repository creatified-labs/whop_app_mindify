"use client";

type MindifyLogoProps = {
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
};

const sizeMap: Record<Required<MindifyLogoProps>["size"], string> = {
	sm: "h-8",
	md: "h-12",
	lg: "h-16",
	xl: "h-24",
};

export function MindifyLogo({ size = "md", className }: MindifyLogoProps) {
	return (
		<div className={`flex items-center gap-3 ${className ?? ""}`}>
			<div className={`${sizeMap[size]} aspect-square relative`}>
				<svg viewBox="0 0 100 100" className="h-full w-full">
					<path d="M50 10 A10 10 0 0 1 50 30 A10 10 0 0 1 50 10" fill="#8B9E7D" />
					<path d="M35 40 Q50 35 65 40 L60 55 Q50 65 40 55 Z" fill="#8B9E7D" />
					<circle cx="30" cy="50" r="4" fill="#8B9E7D" />
					<circle cx="70" cy="50" r="4" fill="#8B9E7D" />
					<path d="M25 35 L27 37 L25 39 L23 37 Z" fill="#D4B86A" />
					<path d="M75 35 L77 37 L75 39 L73 37 Z" fill="#D4B86A" />
				</svg>
			</div>

			<div className="flex flex-col">
				<span
					className="font-serif text-sage-600 tracking-wide"
					style={{ fontSize: size === "sm" ? "18px" : "28px" }}
				>
					Mindify
				</span>
				{size !== "sm" && (
					<span className="text-xs uppercase tracking-[0.3em] text-earth-500">Mind Coach</span>
				)}
			</div>
		</div>
	);
}
