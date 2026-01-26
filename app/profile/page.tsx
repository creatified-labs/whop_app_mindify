"use client";

import { useState } from "react";
import { User, Bell, CreditCard, LogOut, Mail, Shield } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatsCard, type UserStats } from "@/components/profile/StatsCard";

// Mock data - in production, this would come from API/context
const mockUserStats: UserStats = {
	streakDays: 7,
	totalMinutes: 342,
	completedMeditations: 15,
	completedHypnosis: 8,
	completedPrograms: 1,
	favoritesCount: 6,
	memberSince: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
};

const mockUserData = {
	name: "Alex Johnson",
	email: "alex.johnson@example.com",
	membershipTier: "Premium" as const,
	membershipStatus: "active" as const,
	nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function ProfilePage() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [emailUpdates, setEmailUpdates] = useState(true);
	const [weeklyDigest, setWeeklyDigest] = useState(false);

	const handleLogout = () => {
		// In production, this would call the logout API
		console.log("Logging out...");
	};

	return (
		<div className="min-h-screen bg-gradient-zen px-4 py-6 pb-24 sm:px-8 sm:py-12 lg:px-16 text-earth-900 dark:bg-[#0E1012] dark:text-[#F4EFE6]">
			<div className="mx-auto max-w-5xl space-y-6 sm:space-y-10">
				<SectionHeading
					eyebrow="Your Profile"
					title="Account & Statistics"
					description="Manage your account settings and view your Mindify journey."
				/>

				{/* User Info Card */}
				<section className="rounded-3xl border border-sage-100 bg-cream-50 p-8 shadow-card dark:border-white/10 dark:bg-[#13151A]">
					<div className="flex flex-wrap items-start justify-between gap-6">
						<div className="flex items-center gap-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-sage text-2xl font-semibold text-white">
								{mockUserData.name.charAt(0)}
							</div>
							<div>
								<h2 className="text-2xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">
									{mockUserData.name}
								</h2>
								<p className="mt-1 text-sm text-earth-600 dark:text-[#CFC7BB]">{mockUserData.email}</p>
							</div>
						</div>
						<div className="rounded-2xl border border-gold-200 bg-gold-50 px-6 py-3 dark:border-gold-700/30 dark:bg-gold-900/20">
							<p className="text-xs uppercase tracking-[0.3em] text-gold-600 dark:text-gold-400">
								{mockUserData.membershipTier}
							</p>
							<p className="mt-1 text-sm font-medium text-gold-700 dark:text-gold-300">
								{mockUserData.membershipStatus === "active" ? "Active" : "Inactive"}
							</p>
						</div>
					</div>
				</section>

				{/* Statistics */}
				<section className="space-y-6">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">Your Progress</p>
						<h3 className="mt-2 text-2xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">
							Statistics
						</h3>
					</div>
					<StatsCard stats={mockUserStats} />
				</section>

				{/* Account Settings */}
				<section className="space-y-6">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-earth-500 dark:text-[#AFA79B]">Settings</p>
						<h3 className="mt-2 text-2xl font-serif font-semibold text-earth-900 dark:text-[#F4EFE6]">
							Account Settings
						</h3>
					</div>

					<div className="space-y-4">
						{/* Email Settings */}
						<div className="rounded-3xl border border-sage-100 bg-cream-50 p-6 dark:border-white/10 dark:bg-[#13151A]">
							<div className="flex items-start gap-4">
								<div className="rounded-2xl bg-sage-50 p-3 dark:bg-sage-900/20">
									<Mail className="h-5 w-5 text-sage-600 dark:text-sage-400" />
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-earth-900 dark:text-[#F4EFE6]">Email Address</h4>
									<p className="mt-1 text-sm text-earth-600 dark:text-[#CFC7BB]">{mockUserData.email}</p>
									<button
										type="button"
										className="mt-3 text-sm text-sage-600 hover:text-sage-700 dark:text-sage-400 dark:hover:text-sage-300"
									>
										Change email
									</button>
								</div>
							</div>
						</div>

						{/* Notification Settings */}
						<div className="rounded-3xl border border-sage-100 bg-cream-50 p-6 dark:border-white/10 dark:bg-[#13151A]">
							<div className="flex items-start gap-4">
								<div className="rounded-2xl bg-purple-50 p-3 dark:bg-purple-900/20">
									<Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
								</div>
								<div className="flex-1 space-y-4">
									<div>
										<h4 className="font-semibold text-earth-900 dark:text-[#F4EFE6]">Notifications</h4>
										<p className="mt-1 text-sm text-earth-600 dark:text-[#CFC7BB]">
											Manage your notification preferences
										</p>
									</div>

									<div className="space-y-3">
										<label className="flex items-center justify-between">
											<span className="text-sm text-earth-700 dark:text-[#D9D3C8]">Push notifications</span>
											<button
												type="button"
												onClick={() => setNotificationsEnabled(!notificationsEnabled)}
												className={`relative h-6 w-11 rounded-full transition ${
													notificationsEnabled
														? "bg-sage-500"
														: "bg-earth-300 dark:bg-earth-700"
												}`}
											>
												<span
													className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
														notificationsEnabled ? "left-[22px]" : "left-0.5"
													}`}
												/>
											</button>
										</label>

										<label className="flex items-center justify-between">
											<span className="text-sm text-earth-700 dark:text-[#D9D3C8]">Email updates</span>
											<button
												type="button"
												onClick={() => setEmailUpdates(!emailUpdates)}
												className={`relative h-6 w-11 rounded-full transition ${
													emailUpdates
														? "bg-sage-500"
														: "bg-earth-300 dark:bg-earth-700"
												}`}
											>
												<span
													className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
														emailUpdates ? "left-[22px]" : "left-0.5"
													}`}
												/>
											</button>
										</label>

										<label className="flex items-center justify-between">
											<span className="text-sm text-earth-700 dark:text-[#D9D3C8]">Weekly digest</span>
											<button
												type="button"
												onClick={() => setWeeklyDigest(!weeklyDigest)}
												className={`relative h-6 w-11 rounded-full transition ${
													weeklyDigest
														? "bg-sage-500"
														: "bg-earth-300 dark:bg-earth-700"
												}`}
											>
												<span
													className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
														weeklyDigest ? "left-[22px]" : "left-0.5"
													}`}
												/>
											</button>
										</label>
									</div>
								</div>
							</div>
						</div>

						{/* Membership Info */}
						<div className="rounded-3xl border border-sage-100 bg-cream-50 p-6 dark:border-white/10 dark:bg-[#13151A]">
							<div className="flex items-start gap-4">
								<div className="rounded-2xl bg-gold-50 p-3 dark:bg-gold-900/20">
									<CreditCard className="h-5 w-5 text-gold-600 dark:text-gold-400" />
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-earth-900 dark:text-[#F4EFE6]">Membership</h4>
									<p className="mt-1 text-sm text-earth-600 dark:text-[#CFC7BB]">
										{mockUserData.membershipTier} - {mockUserData.membershipStatus}
									</p>
									<p className="mt-2 text-xs text-earth-500 dark:text-[#AFA79B]">
										Next billing:{" "}
										{new Date(mockUserData.nextBillingDate).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
									<button
										type="button"
										className="mt-3 text-sm text-sage-600 hover:text-sage-700 dark:text-sage-400 dark:hover:text-sage-300"
									>
										Manage subscription
									</button>
								</div>
							</div>
						</div>

						{/* Privacy & Security */}
						<div className="rounded-3xl border border-sage-100 bg-cream-50 p-6 dark:border-white/10 dark:bg-[#13151A]">
							<div className="flex items-start gap-4">
								<div className="rounded-2xl bg-earth-100 p-3 dark:bg-earth-900/20">
									<Shield className="h-5 w-5 text-earth-600 dark:text-earth-400" />
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-earth-900 dark:text-[#F4EFE6]">Privacy & Security</h4>
									<p className="mt-1 text-sm text-earth-600 dark:text-[#CFC7BB]">
										Manage your privacy settings and password
									</p>
									<div className="mt-3 space-x-4">
										<button
											type="button"
											className="text-sm text-sage-600 hover:text-sage-700 dark:text-sage-400 dark:hover:text-sage-300"
										>
											Change password
										</button>
										<button
											type="button"
											className="text-sm text-sage-600 hover:text-sage-700 dark:text-sage-400 dark:hover:text-sage-300"
										>
											Privacy settings
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Logout Button */}
				<section>
					<button
						type="button"
						onClick={handleLogout}
						className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700 shadow-soft transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
					>
						<LogOut className="h-4 w-4" />
						Log Out
					</button>
				</section>
			</div>
		</div>
	);
}
