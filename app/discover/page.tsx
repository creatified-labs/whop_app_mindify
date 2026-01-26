export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-zen text-earth-900 dark:bg-[#0E1012] dark:text-[#F4EFE6]">
			<div className="max-w-4xl mx-auto px-4 py-6 pb-24 sm:py-16">
				{/* Title */}
				<h1 className="text-5xl font-bold text-earth-900 mb-6 text-center">
					Discover your app
				</h1>
				{/* Main Description Card */}
				<div className="bg-cream-50 rounded-xl border border-sage-100 p-8 shadow-card text-center mb-16 dark:border-white/10 dark:bg-[#13151A]">
					<p className="text-xl text-earth-600 max-w-2xl mx-auto mb-4 dark:text-[#CFC7BB]">
						This is your app's discover page—showcase what your app does
						and how it helps creators.
					</p>
					<p className="text-base text-earth-500 max-w-2xl mx-auto mb-2 dark:text-[#BFB6A8]">
						Share real success stories, link to thriving Whop communities
						using your app, and add referral links to earn affiliate fees
						when people install your app.
					</p>
					<p className="text-sm text-earth-500 max-w-2xl mx-auto dark:text-[#AFA79B]">
						💡 <strong>Tip:</strong> Clearly explain your app's value
						proposition and how it helps creators make money or grow their
						communities.
					</p>
				</div>

				{/* Pro Tips Section */}
				<div className="grid md:grid-cols-2 gap-6 mb-10">
					<div className="bg-cream-50 rounded-xl border border-sage-100 p-6 shadow-card flex flex-col gap-2 dark:border-white/10 dark:bg-[#13151A]">
						<h3 className="font-semibold text-earth-900 dark:text-[#F4EFE6]">
							Showcase Real Success
						</h3>
						<p className="text-sm text-earth-600 dark:text-[#CFC7BB]">
							Link to real Whop communities using your app, with revenue
							and member stats.
						</p>
					</div>
					<div className="bg-cream-50 rounded-xl border border-sage-100 p-6 shadow-card flex flex-col gap-2 dark:border-white/10 dark:bg-[#13151A]">
						<h3 className="font-semibold text-earth-900 dark:text-[#F4EFE6]">
							Include Referral Links
						</h3>
						<p className="text-sm text-earth-600 dark:text-[#CFC7BB]">
							Add <code>?a=your_app_id</code> to Whop links to earn
							affiliate commissions.
						</p>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-earth-900 mb-6 text-center">
					Examples of Success Stories
				</h2>

				{/* Main Content Cards */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Success Story Card 1 */}
					<div className="bg-cream-50 rounded-xl border border-sage-100 p-6 shadow-card flex flex-col justify-between dark:border-white/10 dark:bg-[#13151A]">
						<div>
							<h3 className="text-lg font-bold text-earth-900 mb-1 dark:text-[#F4EFE6]">
								CryptoKings
							</h3>
							<p className="text-xs text-earth-500 mb-2 dark:text-[#AFA79B]">
								Trading Community
							</p>
							<p className="text-earth-700 mb-4 text-sm dark:text-[#CFC7BB]">
								"Grew to{" "}
								<span className="font-bold text-sage-600">
									2,500+ members
								</span>{" "}
								and{" "}
								<span className="font-bold text-sage-600">
									$18,000+/mo
								</span>{" "}
								with automated signals. Members love the real-time
								alerts!"
							</p>
						</div>
						<a
							href="https://whop.com/cryptokings/?a=your_app_id"
							className="mt-auto block w-full bg-gradient-sage text-white font-semibold py-2 px-4 rounded-lg shadow-soft transition hover:shadow-hover text-center text-sm"
						>
							Visit CryptoKings
						</a>
					</div>

					{/* Success Story Card 2 */}
					<div className="bg-cream-50 rounded-xl border border-sage-100 p-6 shadow-card flex flex-col justify-between dark:border-white/10 dark:bg-[#13151A]">
						<div>
							<h3 className="text-lg font-bold text-earth-900 mb-1 dark:text-[#F4EFE6]">
								SignalPro
							</h3>
							<p className="text-xs text-earth-500 mb-2 dark:text-[#AFA79B]">
								Premium Signals
							</p>
							<p className="text-earth-700 mb-4 text-sm dark:text-[#CFC7BB]">
								"Retention jumped to{" "}
								<span className="font-bold text-sage-600">92%</span>.
								Affiliate program brought in{" "}
								<span className="font-bold text-sage-600">$4,000+</span>{" "}
								last quarter."
							</p>
						</div>
						<a
							href="https://whop.com/signalpro/?app=your_app_id"
							className="mt-auto block w-full bg-gradient-sage text-white font-semibold py-2 px-4 rounded-lg shadow-soft transition hover:shadow-hover text-center text-sm"
						>
							Visit SignalPro
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
