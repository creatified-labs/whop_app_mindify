"use client";

import { create } from "zustand";
import type { MeditationSession } from "@/types";

type SoundscapeState = {
	currentSession: MeditationSession | null;
	selectSession: (session: MeditationSession) => void;
};

export const useSoundscapeStore = create<SoundscapeState>((set) => ({
	currentSession: null,
	selectSession: (session) => set({ currentSession: session }),
}));
