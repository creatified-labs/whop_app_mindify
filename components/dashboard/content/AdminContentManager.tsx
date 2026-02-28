"use client";

import { ContentTabs, useContentTab } from "./ContentTabs";
import { MeditationManager } from "./MeditationManager";
import { HypnosisManager } from "./HypnosisManager";
import { ProgramManager } from "./ProgramManager";
import { QuickResetManager } from "./QuickResetManager";
import { ArticleManager } from "./ArticleManager";

interface AdminContentManagerProps {
	overviewContent: React.ReactNode;
}

export function AdminContentManager({ overviewContent }: AdminContentManagerProps) {
	const { activeTab, setActiveTab } = useContentTab();

	return (
		<>
			<ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{activeTab === "overview" && overviewContent}
			{activeTab === "meditations" && <MeditationManager />}
			{activeTab === "hypnosis" && <HypnosisManager />}
			{activeTab === "programs" && <ProgramManager />}
			{activeTab === "quick-resets" && <QuickResetManager />}
			{activeTab === "knowledge" && <ArticleManager />}
		</>
	);
}
