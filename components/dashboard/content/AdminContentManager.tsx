"use client";

import { ContentTabs, useContentTab } from "./ContentTabs";
import { MeditationManager } from "./MeditationManager";
import { HypnosisManager } from "./HypnosisManager";
import { ProgramManager } from "./ProgramManager";
import { QuickResetManager } from "./QuickResetManager";
import { ArticleManager } from "./ArticleManager";

interface AdminContentManagerProps {
	overviewContent: React.ReactNode;
	companyId: string;
}

export function AdminContentManager({ overviewContent, companyId }: AdminContentManagerProps) {
	const { activeTab, setActiveTab } = useContentTab();

	return (
		<>
			<ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{activeTab === "overview" && overviewContent}
			{activeTab === "meditations" && <MeditationManager companyId={companyId} />}
			{activeTab === "hypnosis" && <HypnosisManager companyId={companyId} />}
			{activeTab === "programs" && <ProgramManager companyId={companyId} />}
			{activeTab === "quick-resets" && <QuickResetManager companyId={companyId} />}
			{activeTab === "knowledge" && <ArticleManager companyId={companyId} />}
		</>
	);
}
