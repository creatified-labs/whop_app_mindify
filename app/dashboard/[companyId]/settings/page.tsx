"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Globe, Bell, Shield, Library, Loader2, Layout } from "lucide-react";
import MediaLibrarySection from "@/components/dashboard/settings/MediaLibrarySection";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	DEFAULT_EXPERIENCE_COPY,
	SECTION_KEYS,
	SECTION_LABELS,
	type ExperienceCopy,
	type ExperienceFields,
	type ExperienceSections,
	type SectionKey,
} from "@/lib/ui/experienceCopy";

interface SettingsSection {
	id: string;
	label: string;
	icon: typeof Globe;
}

const sections: SettingsSection[] = [
	{ id: "general", label: "General", icon: Globe },
	{ id: "experience", label: "Experience View", icon: Layout },
	{ id: "notifications", label: "Notifications", icon: Bell },
	{ id: "advanced", label: "Advanced", icon: Shield },
	{ id: "media", label: "Media Library", icon: Library },
];

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

/**
 * Compact pill toggle for inline use next to a field label. Smaller than
 * SettingsToggle (which is a row-level control with its own label).
 */
function MiniToggle({
	checked,
	onChange,
	label,
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={() => onChange(!checked)}
			aria-label={label}
			aria-pressed={checked}
			className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-400))] focus:ring-offset-1 ${
				checked
					? "bg-[rgb(var(--sage-600))]"
					: "bg-[rgb(var(--earth-200))] dark:bg-[#2A2F37]"
			}`}
		>
			<span
				className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
					checked ? "translate-x-4" : "translate-x-0"
				}`}
			/>
		</button>
	);
}

function FieldHeader({
	label,
	visible,
	onVisibleChange,
}: {
	label: string;
	visible?: boolean;
	onVisibleChange?: (v: boolean) => void;
}) {
	const isVisible = visible !== false;
	return (
		<div className="mb-1.5 flex items-center justify-between gap-3">
			<label
				className={`text-sm font-medium transition ${
					isVisible
						? "text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]"
						: "text-[rgb(var(--earth-400))] line-through dark:text-[#7A7568]"
				}`}
			>
				{label}
			</label>
			{onVisibleChange && (
				<div className="flex items-center gap-2">
					<span className="text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--earth-500))] dark:text-[#B5AFA3]">
						{isVisible ? "Shown" : "Hidden"}
					</span>
					<MiniToggle
						checked={isVisible}
						onChange={onVisibleChange}
						label={`${isVisible ? "Hide" : "Show"} ${label}`}
					/>
				</div>
			)}
		</div>
	);
}

function SettingsInput({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
	helpText,
	visible,
	onVisibleChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
	helpText?: string;
	visible?: boolean;
	onVisibleChange?: (v: boolean) => void;
}) {
	const isVisible = visible !== false;
	return (
		<div className={isVisible ? "" : "opacity-60"}>
			<FieldHeader label={label} visible={visible} onVisibleChange={onVisibleChange} />
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full rounded-lg border border-[rgb(var(--sage-200))] bg-[rgb(var(--cream-50))] px-3 py-2 text-sm text-[rgb(var(--earth-900))] placeholder-[rgb(var(--earth-400))] focus:border-[rgb(var(--sage-400))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-400)/0.2)] dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
			/>
			{helpText && (
				<p className="mt-1 text-xs text-[rgb(var(--earth-500))] dark:text-[#B5AFA3]">
					{helpText}
				</p>
			)}
		</div>
	);
}

function SettingsTextarea({
	label,
	value,
	onChange,
	placeholder,
	helpText,
	rows = 2,
	visible,
	onVisibleChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	helpText?: string;
	rows?: number;
	visible?: boolean;
	onVisibleChange?: (v: boolean) => void;
}) {
	const isVisible = visible !== false;
	return (
		<div className={isVisible ? "" : "opacity-60"}>
			<FieldHeader label={label} visible={visible} onVisibleChange={onVisibleChange} />
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				rows={rows}
				className="w-full resize-y rounded-lg border border-[rgb(var(--sage-200))] bg-[rgb(var(--cream-50))] px-3 py-2 text-sm text-[rgb(var(--earth-900))] placeholder-[rgb(var(--earth-400))] focus:border-[rgb(var(--sage-400))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-400)/0.2)] dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
			/>
			{helpText && (
				<p className="mt-1 text-xs text-[rgb(var(--earth-500))] dark:text-[#B5AFA3]">
					{helpText}
				</p>
			)}
		</div>
	);
}

function SettingsToggle({
	label,
	description,
	checked,
	onChange,
}: {
	label: string;
	description?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div>
				<p className="text-sm font-medium text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
					{label}
				</p>
				{description && (
					<p className="text-xs text-[rgb(var(--earth-500))] dark:text-[#B5AFA3]">
						{description}
					</p>
				)}
			</div>
			<button
				type="button"
				onClick={() => onChange(!checked)}
				className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-400))] focus:ring-offset-2 ${
					checked
						? "bg-[rgb(var(--sage-600))]"
						: "bg-[rgb(var(--earth-200))] dark:bg-[#2A2F37]"
				}`}
			>
				<span
					className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
						checked ? "translate-x-5" : "translate-x-0"
					}`}
				/>
			</button>
		</div>
	);
}

export default function SettingsPage() {
	const params = useParams();
	const companyId = params.companyId as string;
	const [activeSection, setActiveSection] = useState("general");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	// General settings
	const [appTagline, setAppTagline] = useState(
		"Transform your mind, one session at a time"
	);
	const [supportEmail, setSupportEmail] = useState("");
	const [welcomeMessage, setWelcomeMessage] = useState(
		"Welcome to your mindfulness journey"
	);

	// Notification settings
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [streakReminders, setStreakReminders] = useState(true);
	const [weeklyDigest, setWeeklyDigest] = useState(false);
	const [newContentAlerts, setNewContentAlerts] = useState(true);

	// Premium / billing
	const [premiumPlanId, setPremiumPlanId] = useState("");

	// Advanced settings
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const [analyticsTracking, setAnalyticsTracking] = useState(true);
	const [debugMode, setDebugMode] = useState(false);

	// Experience View settings
	const [experienceCopy, setExperienceCopy] = useState<Partial<ExperienceCopy>>({});
	const [experienceSections, setExperienceSections] = useState<Partial<ExperienceSections>>({});
	const [experienceFields, setExperienceFields] = useState<Partial<ExperienceFields>>({});

	const updateCopyField = (key: keyof ExperienceCopy, value: string) => {
		setExperienceCopy((prev) => ({ ...prev, [key]: value }));
	};
	const toggleSection = (key: SectionKey, checked: boolean) => {
		setExperienceSections((prev) => ({ ...prev, [key]: checked }));
	};
	const toggleField = (key: keyof ExperienceCopy, checked: boolean) => {
		setExperienceFields((prev) => ({ ...prev, [key]: checked }));
	};
	const copyValue = (key: keyof ExperienceCopy): string => experienceCopy[key] ?? "";
	const sectionValue = (key: SectionKey): boolean => experienceSections[key] !== false;
	const fieldVisible = (key: keyof ExperienceCopy): boolean => experienceFields[key] !== false;

	// Render a customizable text field for the Experience View tab. Wires up
	// value, onChange, and the per-field visibility toggle in one call.
	const copyInputField = (
		fieldKey: keyof ExperienceCopy,
		label: string,
		options: { placeholder?: string; helpText?: string } = {},
	) => (
		<SettingsInput
			label={label}
			value={copyValue(fieldKey)}
			onChange={(v) => updateCopyField(fieldKey, v)}
			visible={fieldVisible(fieldKey)}
			onVisibleChange={(v) => toggleField(fieldKey, v)}
			placeholder={options.placeholder ?? DEFAULT_EXPERIENCE_COPY[fieldKey]}
			helpText={options.helpText ?? `Default: "${DEFAULT_EXPERIENCE_COPY[fieldKey]}"`}
		/>
	);
	const copyTextareaField = (
		fieldKey: keyof ExperienceCopy,
		label: string,
		options: { placeholder?: string; helpText?: string; rows?: number } = {},
	) => (
		<SettingsTextarea
			label={label}
			value={copyValue(fieldKey)}
			onChange={(v) => updateCopyField(fieldKey, v)}
			visible={fieldVisible(fieldKey)}
			onVisibleChange={(v) => toggleField(fieldKey, v)}
			placeholder={options.placeholder ?? DEFAULT_EXPERIENCE_COPY[fieldKey]}
			helpText={options.helpText ?? `Default: "${DEFAULT_EXPERIENCE_COPY[fieldKey]}"`}
			rows={options.rows}
		/>
	);

	// Load settings from API on mount
	useEffect(() => {
		async function loadSettings() {
			try {
				const res = await fetch(`/api/admin/settings?company_id=${encodeURIComponent(companyId)}`);
				if (!res.ok) throw new Error("Failed to load settings");
				const data = await res.json();
				setAppTagline(data.appTagline);
				setWelcomeMessage(data.welcomeMessage);
				setSupportEmail(data.supportEmail);
				setEmailNotifications(data.emailNotifications);
				setStreakReminders(data.streakReminders);
				setWeeklyDigest(data.weeklyDigest);
				setNewContentAlerts(data.newContentAlerts);
				setPremiumPlanId(data.premiumPlanId ?? "");
				setMaintenanceMode(data.maintenanceMode);
				setAnalyticsTracking(data.analyticsTracking);
				setDebugMode(data.debugMode);
				setExperienceCopy(data.experienceCopy ?? {});
				setExperienceSections(data.experienceSections ?? {});
				setExperienceFields(data.experienceFields ?? {});
			} catch (err) {
				console.error("Failed to load settings:", err);
			} finally {
				setIsLoading(false);
			}
		}
		loadSettings();
	}, []);

	const handleSave = async () => {
		setIsSaving(true);
		setSaveError(null);
		try {
			const res = await fetch(`/api/admin/settings?company_id=${encodeURIComponent(companyId)}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					appTagline,
					welcomeMessage,
					supportEmail,
					emailNotifications,
					streakReminders,
					weeklyDigest,
					newContentAlerts,
					premiumPlanId,
					maintenanceMode,
					analyticsTracking,
					debugMode,
					experienceCopy,
					experienceSections,
					experienceFields,
				}),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to save");
			}
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch (err) {
			setSaveError(err instanceof Error ? err.message : "Failed to save settings");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[rgb(var(--cream-50))] dark:bg-[#0E1012]">
				<Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--sage-600))]" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[rgb(var(--cream-50))] dark:bg-[#0E1012]">
			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
				{saveError && (
					<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
						{saveError}
					</div>
				)}
				{/* Header */}
				<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Link
							href={`/dashboard/${companyId}`}
							className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--sage-200))] bg-white text-[rgb(var(--earth-600))] transition-colors hover:bg-[rgb(var(--cream-100))] dark:border-white/10 dark:bg-[#14171C] dark:text-[#CFC7BB] dark:hover:bg-[#1E2228]"
						>
							<ArrowLeft className="h-5 w-5" />
						</Link>
						<div>
							<h1 className="text-2xl font-bold text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
								Settings
							</h1>
							<p className="text-sm text-[rgb(var(--earth-500))] dark:text-[#B5AFA3]">
								Configure your Mindify app
							</p>
						</div>
					</div>
					<button
						onClick={handleSave}
						disabled={isSaving}
						className="flex items-center gap-2 rounded-xl bg-[rgb(var(--sage-600))] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[rgb(var(--sage-700))] disabled:opacity-50"
					>
						<Save className="h-4 w-4" />
						{isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
					</button>
				</div>

				<div className="flex flex-col gap-6 lg:flex-row">
					{/* Sidebar nav */}
					<nav className="flex gap-2 lg:w-56 lg:shrink-0 lg:flex-col">
						{sections.map((section) => {
							const Icon = section.icon;
							const isActive = activeSection === section.id;
							return (
								<button
									key={section.id}
									type="button"
									onClick={() => setActiveSection(section.id)}
									className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
										isActive
											? "bg-[rgb(var(--sage-600))] text-white shadow-sm"
											: "text-[rgb(var(--earth-700))] hover:bg-white hover:shadow-soft dark:text-[#D9D3C8] dark:hover:bg-[#1A1D23]"
									}`}
								>
									<Icon className="h-4 w-4" />
									{section.label}
								</button>
							);
						})}
					</nav>

					{/* Content */}
					<div className="flex-1 space-y-6">
						{activeSection === "general" && (
							<>
								<SectionCard
									title="App Identity"
									description="Customize how your app appears to users"
								>
									<div>
										<label className="mb-1.5 block text-sm font-medium text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">
											App Name
										</label>
										<p className="text-sm text-[rgb(var(--earth-900))] dark:text-[#F4EFE6]">
											Mindify
										</p>
									</div>
									<SettingsInput
										label="Tagline"
										value={appTagline}
										onChange={setAppTagline}
										placeholder="Your mindfulness journey starts here"
									/>
									<SettingsInput
										label="Welcome Message"
										value={welcomeMessage}
										onChange={setWelcomeMessage}
										placeholder="Shown on the user dashboard"
									/>
								</SectionCard>
								<SectionCard
									title="Contact"
									description="Support and communication settings"
								>
									<SettingsInput
										label="Support Email"
										value={supportEmail}
										onChange={setSupportEmail}
										type="email"
										placeholder="support@example.com"
										helpText="Users will see this for support inquiries"
									/>
								</SectionCard>
								<SectionCard
									title="Premium & Billing"
									description="Connect your Whop plan to enable in-app upgrades"
								>
									<SettingsInput
										label="Premium Plan ID"
										value={premiumPlanId}
										onChange={setPremiumPlanId}
										placeholder="plan_XXXXX"
										helpText="Your Whop plan ID for premium access. Find this in your Whop dashboard under Plans."
									/>
								</SectionCard>
							</>
						)}

						{activeSection === "experience" && (
							<>
								<SectionCard
									title="Hero & welcome"
									description="Customize the text at the top of the experience page. Leave a field blank to use the default. Use the toggle on each row to hide that piece of text completely."
								>
									{copyInputField("heroEyebrow", "Hero eyebrow")}
									{copyInputField("heroTitle", "Hero title", {
										placeholder: "Leave blank to show the Whop experience name",
										helpText: "Blank = uses your Whop experience name automatically.",
									})}
									{copyTextareaField("heroTagline", "Hero tagline")}
									{copyInputField("welcomeEyebrowTemplate", "Welcome eyebrow (small caps above heading)", {
										helpText: `Use {timeOfDay} and {tier} placeholders. Default: "${DEFAULT_EXPERIENCE_COPY.welcomeEyebrowTemplate}"`,
									})}
									{copyInputField("welcomeHeadingTemplate", "Welcome heading", {
										helpText: `Use {name} where the user's name should appear. Default: "${DEFAULT_EXPERIENCE_COPY.welcomeHeadingTemplate}"`,
									})}
									{copyTextareaField("welcomeBody", "Welcome body", { rows: 3 })}
								</SectionCard>

								<SectionCard
									title="Section labels"
									description="Rename or hide the labels and descriptions shown above each home-page section."
								>
									{copyInputField("continueRitualLabel", "Continue Ritual label")}
									{copyInputField("currentProgramLabel", "Current Program label")}
									{copyInputField("featuredProgramsLabel", "Featured Programs eyebrow", {
										helpText: "Shown above the programs carousel when the user is not enrolled.",
									})}
									{copyInputField("featuredProgramsHeading", "Featured Programs heading")}
									{copyInputField("featuredProgramsCTA", "Featured Programs CTA button")}
									{copyInputField("recentActivityLabel", "Recent Activity label")}
									{copyInputField("favoritesEyebrow", "Favorites eyebrow")}
									{copyInputField("favoritesHeading", "Favorites heading")}
									{copyInputField("favoritesSubtitle", "Favorites subtitle")}
									{copyInputField("recommendedEyebrow", "Recommended eyebrow")}
									{copyInputField("recommendedHeadingTemplate", "Recommended heading", {
										helpText: "Use {timeOfDay} placeholder (e.g. 'morning').",
									})}
									{copyInputField("recommendedFooter", "Recommended footer")}
									{copyInputField("dailyStreakEyebrow", "Daily Streak eyebrow")}
									{copyTextareaField("dailyStreakBody", "Daily Streak body")}
									{copyInputField("dailyStreakMinutesLabel", "Total minutes label")}
									{copyInputField("featuredMeditationsLabel", "Featured Meditations label")}
									{copyInputField("featuredHypnosisLabel", "Featured Hypnosis label")}
									{copyInputField("featuredQuickResetsLabel", "Featured Quick Resets label")}
								</SectionCard>

								<SectionCard
									title="Section pages"
									description="Customize headings and descriptions shown when users navigate to each section."
								>
									<p className="text-xs font-semibold uppercase tracking-widest text-[rgb(var(--earth-400))]">Knowledge Hub</p>
									{copyInputField("knowledgeEyebrow", "Eyebrow")}
									{copyInputField("knowledgeHeading", "Heading")}
									{copyTextareaField("knowledgeDescription", "Description")}
									{copyInputField("knowledgeSearchPlaceholder", "Search placeholder")}
									{copyInputField("knowledgeEmptyState", "Empty state text")}

									<p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--earth-400))]">Meditations</p>
									{copyInputField("meditationsEmptyTitle", "Empty state title")}
									{copyInputField("meditationsEmptyDescription", "Empty state description")}
									{copyTextareaField("meditationsPreviewDescription", "Preview panel description")}

									<p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--earth-400))]">Hypnosis</p>
									{copyInputField("hypnosisEyebrow", "Eyebrow")}
									{copyInputField("hypnosisHeading", "Heading")}
									{copyTextareaField("hypnosisDescription", "Description")}
									{copyInputField("hypnosisEmptyTitle", "Empty state title")}
									{copyInputField("hypnosisEmptyDescription", "Empty state description")}

									<p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--earth-400))]">Quick Resets</p>
									{copyInputField("quickResetsEyebrow", "Eyebrow")}
									{copyInputField("quickResetsHeading", "Heading")}
									{copyInputField("quickResetsInstruction", "Instruction text")}
									{copyInputField("quickResetsEmptyState", "Empty state text")}

									<p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--earth-400))]">Programs</p>
									{copyInputField("programsEyebrow", "Eyebrow")}
									{copyInputField("programsHeading", "Heading")}
									{copyTextareaField("programsDescription", "Description")}
									{copyInputField("programsEmptyState", "Empty state text")}

									<p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--earth-400))]">Sidebar Premium Card</p>
									{copyInputField("premiumCardHeading", "Card heading")}
									{copyInputField("premiumCardBody", "Card body")}
									{copyInputField("premiumCardCTA", "Button text")}
								</SectionCard>

								<SectionCard
									title="Visible sections"
									description="Hide an entire section of the home page. (For finer control, use the toggles on individual fields above.)"
								>
									{SECTION_KEYS.map((key) => (
										<SettingsToggle
											key={key}
											label={SECTION_LABELS[key]}
											checked={sectionValue(key)}
											onChange={(checked) => toggleSection(key, checked)}
										/>
									))}
								</SectionCard>
							</>
						)}

						{activeSection === "notifications" && (
							<SectionCard
								title="User Notifications"
								description="Control what notifications are sent to your users"
							>
								<SettingsToggle
									label="Email Notifications"
									description="Send transactional emails (welcome, password reset, etc.)"
									checked={emailNotifications}
									onChange={setEmailNotifications}
								/>
								<SettingsToggle
									label="Streak Reminders"
									description="Nudge users when they're about to lose their streak"
									checked={streakReminders}
									onChange={setStreakReminders}
								/>
								<SettingsToggle
									label="Weekly Digest"
									description="Send a weekly summary of activity and recommendations"
									checked={weeklyDigest}
									onChange={setWeeklyDigest}
								/>
								<SettingsToggle
									label="New Content Alerts"
									description="Notify users when new content is published"
									checked={newContentAlerts}
									onChange={setNewContentAlerts}
								/>
							</SectionCard>
						)}

						{activeSection === "media" && <MediaLibrarySection companyId={companyId} />}

						{activeSection === "advanced" && (
							<>
								<SectionCard
									title="App Behavior"
									description="Advanced settings for your app"
								>
									<SettingsToggle
										label="Maintenance Mode"
										description="Show a maintenance page to all users. Admins can still access the dashboard."
										checked={maintenanceMode}
										onChange={setMaintenanceMode}
									/>
									<SettingsToggle
										label="Analytics Tracking"
										description="Track user activity and session metrics"
										checked={analyticsTracking}
										onChange={setAnalyticsTracking}
									/>
									<SettingsToggle
										label="Debug Mode"
										description="Show additional logging in the browser console"
										checked={debugMode}
										onChange={setDebugMode}
									/>
								</SectionCard>
								<SectionCard
									title="Danger Zone"
									description="Irreversible actions"
								>
									<div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
										<div>
											<p className="text-sm font-medium text-red-800 dark:text-red-300">
												Reset All Content
											</p>
											<p className="text-xs text-red-600 dark:text-red-400">
												This will delete all custom content and restore defaults.
											</p>
										</div>
										<button
											type="button"
											className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
										>
											Reset
										</button>
									</div>
								</SectionCard>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
