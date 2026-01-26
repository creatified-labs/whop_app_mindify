"use client";

import { create } from "zustand";
import type { ProgramProgress } from "@/lib/types";

export type DailyTaskKey = `${string}:${number}`;

type TaskState = Record<string, boolean>;

interface ProgramState {
	enrolledPrograms: Record<string, ProgramProgress>;
	currentProgramId: string | null;
	currentDay: number;
	taskCompletion: Record<DailyTaskKey, TaskState>;
	journalDrafts: Record<DailyTaskKey, string>;
	celebrationQueue: string[];
	lastMissedDay?: number;
	restDaySuggestion: string | null;
	certificateData: { programId: string; issuedAt: string; shareUrl: string } | null;
	setCurrentProgram: (programId: string | null) => void;
	setCurrentDay: (day: number) => void;
	enrollInProgram: (progress: ProgramProgress) => void;
	updateProgress: (progress: ProgramProgress) => void;
	toggleTask: (programId: string, dayNumber: number, taskKey: string | number) => void;
	setJournalDraft: (programId: string, dayNumber: number, value: string) => void;
	queueCelebration: (message: string) => void;
	popCelebration: () => string | undefined;
	resetDayState: (programId: string, dayNumber: number) => void;
	setRestDaySuggestion: (message: string | null) => void;
	setCertificateData: (payload: { programId: string; issuedAt: string; shareUrl: string } | null) => void;
}

const keyFor = (programId: string, dayNumber: number): DailyTaskKey => `${programId}:${dayNumber}`;

export const useProgramStore = create<ProgramState>((set, get) => ({
	enrolledPrograms: {},
	currentProgramId: null,
	currentDay: 1,
	taskCompletion: {},
	journalDrafts: {},
	celebrationQueue: [],
	restDaySuggestion: null,
	certificateData: null,
	setCurrentProgram: (programId) =>
		set({
			currentProgramId: programId,
		}),
	setCurrentDay: (day) =>
		set({
			currentDay: day,
		}),
	enrollInProgram: (progress) =>
		set((state) => ({
			enrolledPrograms: { ...state.enrolledPrograms, [progress.programId]: progress },
			currentProgramId: progress.programId,
			currentDay: progress.currentDay,
		})),
	updateProgress: (progress) =>
		set((state) => ({
			enrolledPrograms: { ...state.enrolledPrograms, [progress.programId]: progress },
			currentDay: progress.currentDay,
		})),
	toggleTask: (programId, dayNumber, taskKey) =>
		set((state) => {
			const key = keyFor(programId, dayNumber);
			const current = state.taskCompletion[key] ?? {};
			const next = { ...current, [taskKey]: !current[taskKey] };
			return {
				taskCompletion: { ...state.taskCompletion, [key]: next },
			};
		}),
	setJournalDraft: (programId, dayNumber, value) =>
		set((state) => ({
			journalDrafts: { ...state.journalDrafts, [keyFor(programId, dayNumber)]: value },
		})),
	queueCelebration: (message) =>
		set((state) => ({
			celebrationQueue: [...state.celebrationQueue, message],
		})),
	popCelebration: () => {
		const { celebrationQueue } = get();
		const [first, ...rest] = celebrationQueue;
		set({ celebrationQueue: rest });
		return first;
	},
	resetDayState: (programId, dayNumber) =>
		set((state) => {
			const key = keyFor(programId, dayNumber);
			const { [key]: _, ...restTasks } = state.taskCompletion;
			const { [key]: __, ...restDrafts } = state.journalDrafts;
			return {
				taskCompletion: restTasks,
				journalDrafts: restDrafts,
			};
		}),
	setRestDaySuggestion: (message) => set({ restDaySuggestion: message }),
	setCertificateData: (payload) => set({ certificateData: payload }),
}));
