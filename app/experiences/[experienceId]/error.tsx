"use client";

import { PageError } from "@/components/ui/ErrorState";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <PageError error={error} reset={reset} />;
}
