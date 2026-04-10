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

function SettingsInput({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
	helpText,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
	helpText?: string;
}) {
	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">
				{label}
			</label>
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
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	helpText?: string;
	rows?: number;
}) {
	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-[rgb(var(--earth-700))] dark:text-[#D9D3C8]">
				{label}
			</label>
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

	// Advanced settings
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const [analyticsTracking, setAnalyticsTracking] = useState(true);
	const [debugMode, setDebugMode] = useState(false);

	// Experience View settings
	const [experienceCopy, setExperienceCopy] = useState<Partial<ExperienceCopy>>({});
	const [experienceSections, setExperienceSections] = useState<Partial<ExperienceSections>>({});

	const updateCopyField = (key: keyof ExperienceCopy, value: string) => {
		setExperienceCopy((prev) => ({ ...prev, [key]: value }));
	};
	const toggleSection = (key: SectionKey, checked: boolean) => {
		setExperienceSections((prev) => ({ ...prev, [key]: checked }));
	};
	const copyValue = (key: keyof ExperienceCopy): string => experienceCopy[key] ?? "";
	const sectionValue = (key: SectionKey): boolean => experienceSections[key] !== false;

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
				setMaintenanceMode(data.maintenanceMode);
				setAnalyticsTracking(data.analyticsTracking);
				setDebugMode(data.debugMode);
				setExperienceCopy(data.experienceCopy ?? {});
				setExperienceSections(data.experienceSections ?? {});
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
					maintenanceMode,
					analyticsTracking,
					debugMode,
					experienceCopy,
					experienceSections,
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
							</>
						)}

						{activeSection === "experience" && (
							<>
								<SectionCard
									title="Hero & welcome"
									description="Customize the top of the experience page and the welcome block. Leave any field blank to use the default shown below."
								>
									<SettingsInput
										label="Hero eyebrow"
										value={copyValue("heroEyebrow")}
										onChange={(v) => updateCopyField("heroEyebrow", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.heroEyebrow}
										helpText={`Default: "${DEFAULT_EXPERIENCE_COPY.heroEyebrow}"`}
									/>
									<SettingsInput
										label="Hero title"
										value={copyValue("heroTitle")}
										onChange={(v) => updateCopyField("heroTitle", v)}
										placeholder="Leave blank to show the Whop experience name"
										helpText="Blank = uses your Whop experience name automatically."
									/>
									<SettingsTextarea
										label="Hero tagline"
										value={copyValue("heroTagline")}
										onChange={(v) => updateCopyField("heroTagline", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.heroTagline}
										helpText={`Default: "${DEFAULT_EXPERIENCE_COPY.heroTagline}"`}
									/>
									<SettingsInput
										label="Welcome eyebrow (small caps above heading)"
										value={copyValue("welcomeEyebrowTemplate")}
										onChange={(v) => updateCopyField("welcomeEyebrowTemplate", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.welcomeEyebrowTemplate}
										helpText={`Use {timeOfDay} and {tier} placeholders. Default: "${DEFAULT_EXPERIENCE_COPY.welcomeEyebrowTemplate}"`}
									/>
									<SettingsInput
										label="Welcome heading"
										value={copyValue("welcomeHeadingTemplate")}
										onChange={(v) => updateCopyField("welcomeHeadingTemplate", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.welcomeHeadingTemplate}
										helpText={`Use {name} where the user's name should appear. Default: "${DEFAULT_EXPERIENCE_COPY.welcomeHeadingTemplate}"`}
									/>
									<SettingsTextarea
										label="Welcome body"
										value={copyValue("welcomeBody")}
										onChange={(v) => updateCopyField("welcomeBody", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.welcomeBody}
										helpText={`Default: "${DEFAULT_EXPERIENCE_COPY.welcomeBody}"`}
										rows={3}
									/>
								</SectionCard>

								<SectionCard
									title="Section labels"
									description="Rename the labels and descriptions shown above each home-page section."
								>
									<SettingsInput
										label="Continue Ritual label"
										value={copyValue("continueRitualLabel")}
										onChange={(v) => updateCopyField("continueRitualLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.continueRitualLabel}
									/>
									<SettingsInput
										label="Current Program label"
										value={copyValue("currentProgramLabel")}
										onChange={(v) => updateCopyField("currentProgramLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.currentProgramLabel}
									/>
									<SettingsInput
										label="Featured Programs eyebrow"
										value={copyValue("featuredProgramsLabel")}
										onChange={(v) => updateCopyField("featuredProgramsLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.featuredProgramsLabel}
										helpText="Shown above the programs carousel when the user is not enrolled."
									/>
									<SettingsInput
										label="Featured Programs heading"
										value={copyValue("featuredProgramsHeading")}
										onChange={(v) => updateCopyField("featuredProgramsHeading", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.featuredProgramsHeading}
									/>
									<SettingsInput
										label="Featured Programs CTA button"
										value={copyValue("featuredProgramsCTA")}
										onChange={(v) => updateCopyField("featuredProgramsCTA", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.featuredProgramsCTA}
									/>
									<SettingsInput
										label="Recent Activity label"
										value={copyValue("recentActivityLabel")}
										onChange={(v) => updateCopyField("recentActivityLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.recentActivityLabel}
									/>
									<SettingsInput
										label="Favorites eyebrow"
										value={copyValue("favoritesEyebrow")}
										onChange={(v) => updateCopyField("favoritesEyebrow", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.favoritesEyebrow}
									/>
									<SettingsInput
										label="Favorites heading"
										value={copyValue("favoritesHeading")}
										onChange={(v) => updateCopyField("favoritesHeading", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.favoritesHeading}
									/>
									<SettingsInput
										label="Favorites subtitle"
										value={copyValue("favoritesSubtitle")}
										onChange={(v) => updateCopyField("favoritesSubtitle", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.favoritesSubtitle}
									/>
									<SettingsInput
										label="Recommended eyebrow"
										value={copyValue("recommendedEyebrow")}
										onChange={(v) => updateCopyField("recommendedEyebrow", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.recommendedEyebrow}
									/>
									<SettingsInput
										label="Recommended heading"
										value={copyValue("recommendedHeadingTemplate")}
										onChange={(v) => updateCopyField("recommendedHeadingTemplate", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.recommendedHeadingTemplate}
										helpText="Use {timeOfDay} placeholder (e.g. 'morning')."
									/>
									<SettingsInput
										label="Recommended footer"
										value={copyValue("recommendedFooter")}
										onChange={(v) => updateCopyField("recommendedFooter", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.recommendedFooter}
									/>
									<SettingsInput
										label="Daily Streak eyebrow"
										value={copyValue("dailyStreakEyebrow")}
										onChange={(v) => updateCopyField("dailyStreakEyebrow", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.dailyStreakEyebrow}
									/>
									<SettingsTextarea
										label="Daily Streak body"
										value={copyValue("dailyStreakBody")}
										onChange={(v) => updateCopyField("dailyStreakBody", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.dailyStreakBody}
									/>
									<SettingsInput
										label="Total minutes label"
										value={copyValue("dailyStreakMinutesLabel")}
										onChange={(v) => updateCopyField("dailyStreakMinutesLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.dailyStreakMinutesLabel}
									/>
									<SettingsInput
										label="Featured Meditations label"
										value={copyValue("featuredMeditationsLabel")}
										onChange={(v) => updateCopyField("featuredMeditationsLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.featuredMeditationsLabel}
									/>
									<SettingsInput
										label="Featured Hypnosis label"
										value={copyValue("featuredHypnosisLabel")}
										onChange={(v) => updateCopyField("featuredHypnosisLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.featuredHypnosisLabel}
									/>
									<SettingsInput
										label="Featured Quick Resets label"
										value={copyValue("featuredQuickResetsLabel")}
										onChange={(v) => updateCopyField("featuredQuickResetsLabel", v)}
										placeholder={DEFAULT_EXPERIENCE_COPY.featuredQuickResetsLabel}
									/>
								</SectionCard>

								<SectionCard
									title="Visible sections"
									description="Hide any section you don't want to show on the experience home page."
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
