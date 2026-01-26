export type SaveProgressPayload = {
	programId: string;
	dayNumber: number;
	totalDays: number;
	completed?: boolean;
};

export async function saveProgramProgress(payload: SaveProgressPayload) {
	const response = await fetch("/api/programs/progress", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error("Failed to save program progress");
	}

	return response.json();
}

export async function fetchProgramProgress(programId: string) {
	const response = await fetch(`/api/programs/progress/${programId}`);
	if (!response.ok) {
		return null;
	}
	return response.json();
}

export async function resetProgramProgress(programId: string) {
	const response = await fetch(`/api/programs/progress/${programId}`, {
		method: "PUT",
	});
	if (!response.ok) {
		throw new Error("Failed to reset program progress");
	}
	return response.json();
}

export async function saveProgramJournal({
	programId,
	dayNumber,
	entry,
}: {
	programId: string;
	dayNumber: number;
	entry: string;
}) {
	const response = await fetch("/api/programs/journal", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ programId, dayNumber, entry }),
	});
	if (!response.ok) {
		throw new Error("Failed to save journal entry");
	}
	return response.json();
}

export async function fetchProgramJournal(programId: string, dayNumber: number) {
	const response = await fetch(`/api/programs/journal/${programId}/${dayNumber}`);
	if (!response.ok) {
		return null;
	}
	return response.json();
}
