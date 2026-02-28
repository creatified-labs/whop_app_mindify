"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, ChevronDown, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserData {
	id: string;
	name: string;
	email: string;
	tier: "free" | "premium";
	totalSessions: number;
	totalMinutes: number;
	streak: number;
	joinedAt: string;
	lastActive: string;
}

interface UserManagementTableProps {
	users: UserData[];
}

export default function UserManagementTable({ users }: UserManagementTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterTier, setFilterTier] = useState<"all" | "free" | "premium">("all");
	const [sortBy, setSortBy] = useState<"name" | "sessions" | "minutes" | "joined">(
		"joined"
	);

	const filteredUsers = users
		.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesTier = filterTier === "all" || user.tier === filterTier;
			return matchesSearch && matchesTier;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "sessions":
					return b.totalSessions - a.totalSessions;
				case "minutes":
					return b.totalMinutes - a.totalMinutes;
				case "joined":
					return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
				default:
					return 0;
			}
		});

	return (
		<div className="rounded-2xl border border-sage-200/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#1A1D23]">
			{/* Header */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<h2 className="text-xl font-semibold text-earth-900 dark:text-[#F4EFE6]">
					User Management
				</h2>

				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 rounded-lg border border-sage-300 bg-white px-4 py-2 text-sm font-medium text-earth-700 transition-colors hover:bg-cream-100 dark:border-white/10 dark:bg-[#14171C] dark:text-[#D9D3C8] dark:hover:bg-[#1E2228]">
						<Download className="h-4 w-4" />
						Export
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="mb-4 flex flex-wrap gap-3">
				{/* Search */}
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
					<input
						type="text"
						placeholder="Search users..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full rounded-lg border border-sage-200 bg-white py-2 pl-10 pr-4 text-sm text-earth-900 placeholder-earth-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6] dark:placeholder-[#B5AFA3]"
					/>
				</div>

				{/* Tier Filter */}
				<select
					value={filterTier}
					onChange={(e) => setFilterTier(e.target.value as any)}
					className="rounded-lg border border-sage-200 bg-white px-4 py-2 text-sm text-earth-900 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6]"
				>
					<option value="all">All Tiers</option>
					<option value="free">Free</option>
					<option value="premium">Premium</option>
				</select>

				{/* Sort */}
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as any)}
					className="rounded-lg border border-sage-200 bg-white px-4 py-2 text-sm text-earth-900 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 dark:border-white/10 dark:bg-[#14171C] dark:text-[#F4EFE6]"
				>
					<option value="joined">Recently Joined</option>
					<option value="name">Name</option>
					<option value="sessions">Most Sessions</option>
					<option value="minutes">Most Active</option>
				</select>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-sage-200 dark:border-white/10">
							<th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
								User
							</th>
							<th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
								Tier
							</th>
							<th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
								Sessions
							</th>
							<th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
								Minutes
							</th>
							<th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
								Streak
							</th>
							<th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-[#CFC7BB]">
								Last Active
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-sage-200 dark:divide-white/10">
						{filteredUsers.map((user, index) => (
							<motion.tr
								key={user.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.03 }}
								className="group transition-colors hover:bg-cream-100 dark:hover:bg-[#1E2228]"
							>
								<td className="py-4">
									<div>
										<p className="font-medium text-earth-900 dark:text-[#F4EFE6]">
											{user.name}
										</p>
										<p className="text-sm text-earth-500 dark:text-[#B5AFA3]">
											{user.email}
										</p>
									</div>
								</td>
								<td className="py-4">
									<span
										className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
											user.tier === "premium"
												? "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-400"
												: "bg-earth-100 text-earth-700 dark:bg-earth-900/30 dark:text-earth-400"
										}`}
									>
										{user.tier === "premium" ? "Premium" : "Free"}
									</span>
								</td>
								<td className="py-4 text-right text-earth-900 dark:text-[#F4EFE6]">
									{user.totalSessions}
								</td>
								<td className="py-4 text-right text-earth-900 dark:text-[#F4EFE6]">
									{user.totalMinutes}
								</td>
								<td className="py-4 text-right">
									<span className="inline-flex items-center gap-1 text-earth-900 dark:text-[#F4EFE6]">
										{user.streak > 0 && <Flame className="h-4 w-4 inline" />}
										{user.streak}
									</span>
								</td>
								<td className="py-4 text-right text-sm text-earth-500 dark:text-[#B5AFA3]">
									{formatDistanceToNow(new Date(user.lastActive), {
										addSuffix: true,
									})}
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>

				{filteredUsers.length === 0 && (
					<div className="py-12 text-center">
						<p className="text-earth-600 dark:text-[#CFC7BB]">
							No users found matching your criteria
						</p>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="mt-4 text-sm text-earth-600 dark:text-[#CFC7BB]">
				Showing {filteredUsers.length} of {users.length} users
			</div>
		</div>
	);
}
