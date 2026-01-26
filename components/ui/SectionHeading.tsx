interface SectionHeadingProps {
	eyebrow?: string;
	title: string;
	description?: string;
	align?: "left" | "center";
}

export function SectionHeading({
	eyebrow,
	title,
	description,
	align = "left",
}: SectionHeadingProps) {
	return (
		<div
			className={`space-y-3 ${align === "center" ? "text-center max-w-2xl mx-auto" : ""}`}
		>
			{eyebrow && (
				<p className="text-xs uppercase tracking-[0.4em] text-sage-600">
					{eyebrow}
				</p>
			)}
			<h2 className="font-serif text-4xl font-semibold text-earth-900">{title}</h2>
			{description && (
				<p className="text-base leading-relaxed text-earth-600">{description}</p>
			)}
		</div>
	);
}
