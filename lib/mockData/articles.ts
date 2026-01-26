import type { AudioTrack } from "@/lib/types";

export type KnowledgeCategory =
	| "neuroscience"
	| "psychology"
	| "breathwork"
	| "sleep"
	| "focus"
	| "productivity";

export interface KnowledgeArticle {
	slug: string;
	title: string;
	category: KnowledgeCategory;
	readTimeMinutes: number;
	thumbnail: string;
	author: string;
	updatedAt: string;
	audioTrack?: AudioTrack;
	content: string;
	keyTakeaways: string[];
	actionSteps: string[];
	recommendedSessions: { id: string; type: "meditation" | "hypnosis"; title: string }[];
	references: string[];
}

const baseMarkdown = ({
	title,
	description,
	body,
	takeaways,
	actions,
}: {
	title: string;
	description: string;
	body: string;
	takeaways: string[];
	actions: string[];
}) => `# ${title}

_${description}_

${body}

## Key Takeaways

${takeaways.map((item) => `- ${item}`).join("\n")}

## Actionable Steps

${actions.map((item, index) => `${index + 1}. ${item}`).join("\n")}
`;

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
	{
		slug: "breaking-overwhelm-cycle",
		title: "Breaking the Overwhelm Cycle: Neuroscience of Stress",
		category: "neuroscience",
		readTimeMinutes: 6,
		thumbnail: "/images/knowledge/overwhelm.jpg",
		author: "Dr. Lila Rowan",
		updatedAt: "2025-05-30",
		content: baseMarkdown({
			title: "Breaking the Overwhelm Cycle",
			description: "Decode how the amygdala-hypothalamus axis floods your system and how to reclaim cognitive clarity.",
			body: `## Stress Loop Mechanics

When your amygdala flags a threat, the hypothalamus and pituitary glands launch a cortisol cascade. This keeps you safe in the short term but hijacks prefrontal cortex bandwidth when it becomes chronic.

**Polyvagal nuance:** your vagus nerve toggles between mobilization (fight-flight) and immobilization (freeze). We want strategic ventral vagal activation so you can take decisive action without frying your wiring.

## Pattern Interrupt Protocol

1. **Orient:** count five objects behind you. This snaps the midbrain out of tunnel vision.
2. **Exhale Emphasis:** 4-2-8 breathing downregulates sympathetic charge.
3. **Somatic Audit:** name one sensation in your chest, one in your gut, one on your skin.
4. **Micro Choice:** ask “What is the next reversible step?” – reclaims agency.

Layer this protocol before heavy decision blocks or when you feel the "screen-swipe panic" show up.
`,
			takeaways: [
				"Overwhelm is a neurochemical loop, not a personal failing.",
				"Slow exhalations and orientation drills free prefrontal resources.",
				"Micro choices rebuild agency faster than abstract mindset shifts.",
			],
			actions: [
				"Schedule two 90-second overwhelm resets during high-load days.",
				"Pair 4-2-8 breathing with tactile cues to make it memorable.",
				"Log triggers that precede overwhelm to preempt them next sprint.",
			],
		}),
		keyTakeaways: [
			"Amygdala-driven cortisol loops narrow attention and spike error rates.",
			"Ventral vagal activation restores executive function.",
			"Actionable somatic drills beat purely cognitive reframes.",
		],
		actionSteps: [
			"Run the orient-breathe-scan protocol twice daily for one week.",
			"Tag stressful tasks with a specific buffer ritual in your calendar.",
			"Share your overwhelm script with a teammate for accountability.",
		],
		recommendedSessions: [
			{ id: "stress-release-field", type: "meditation", title: "Stress Release Field" },
			{ id: "overwhelm-pattern-reset", type: "meditation", title: "Overwhelm Pattern Reset" },
		],
		references: [
			"Porges, S. (2011). The Polyvagal Theory.",
			"McEwen, B. (2017). Neurobiology of Stress.",
		],
	},
	{
		slug: "science-of-focus",
		title: "The Science of Focus: How Attention Really Works",
		category: "focus",
		readTimeMinutes: 5,
		thumbnail: "/images/knowledge/focus.jpg",
		author: "Noelle Vega",
		updatedAt: "2025-05-18",
		content: baseMarkdown({
			title: "The Science of Focus",
			description: "Understand attentional spotlight theory, dopamine gating, and how to architect deep work windows.",
			body: `## Spotlight Mechanics

Attention is a spotlight controlled by your dorsal attention network (for goal-directed focus) and the ventral network (for novelty interrupts). Context switching pulls blood flow away from prefrontal control centers for up to 8 minutes.

## Dopamine as a Tracking Signal

Dopamine isn't just a “pleasure chemical.” It’s a prediction signal. When your brain anticipates a meaningful reward, it tags the current task as worth energy. Design your workflow so micro wins release dopamine on schedule.

## Build Focus Sprints

- **Prime:** 2-minute diaphragmatic breathing + set intention.
- **Protect:** block notifications, physically remove your phone, use noise shaping audio.
- **Pulse:** operate in 52/17 cadence; the brain loves intervals.
- **Reflect:** log one sentence on what felt sticky to refine the next sprint.
`,
			takeaways: [
				"Attention has two neural networks; you must calm the novelty one.",
				"Dopamine tracks predicted progress, so front-load clarity.",
				"Short, intense intervals beat marathon focus attempts.",
			],
			actions: [
				"Schedule three 52/17 sprints tomorrow with clear deliverables.",
				"Prime each sprint with a 120-second breath ritual.",
				"Reward completions immediately to reinforce the loop.",
			],
		}),
		keyTakeaways: [
			"Context switching costs accumulate faster than most teams expect.",
			"Breath-led priming improves frontal lobe oxygenation.",
			"Cadence rhythm (like 52/17) keeps dopamine churning.",
		],
		actionSteps: [
			"Design tomorrow’s sprints before you end today.",
			"Pair focus blocks with Mindify’s Focus Primer audio.",
			"Do a 60-second debrief after each sprint to anchor learning.",
		],
		recommendedSessions: [
			{ id: "focus-activation", type: "meditation", title: "Focus Activation" },
			{ id: "productivity-loop", type: "meditation", title: "Productivity Flow Loop" },
		],
		references: [
			"Posner, M. & Petersen, S. (1990). Attention systems in the human brain.",
			"Huberman, A. (2022). Spotlight and alertness protocols.",
		],
	},
	{
		slug: "nighttime-routine-sleep",
		title: "Nighttime Routine for Better Sleep: Circadian Optimization",
		category: "sleep",
		readTimeMinutes: 4,
		thumbnail: "/images/knowledge/sleep.jpg",
		author: "Zuri Ahmed",
		updatedAt: "2025-04-12",
		content: baseMarkdown({
			title: "Nighttime Routine for Better Sleep",
			description: "Calibrate circadian cues, body temperature, and light hygiene for restorative nights.",
			body: `## Circadian Building Blocks

Your suprachiasmatic nucleus (SCN) sets the pace. Send consistent signals:

- **Morning sunlight** within 30 minutes resets melatonin onset.
- **Temperature drop** at night triggers drowsiness; take a warm shower 90 minutes before bed to induce a rebound drop.

## Sleep Ritual Stack

1. **Digital Sunset:** kill blue light / notifications 60 minutes pre-bed.
2. **Downshift Breath:** 4-7-8 or box breathing to slow heart rate.
3. **Somatic unload:** 5-minute journaling or body scan to empty working memory.
4. **Environmental cues:** 65°F room, blackout curtains, white noise if helpful.
`,
			takeaways: [
				"Timing of light and temperature cues matters more than supplements.",
				"Breathwork plus journaling prevents cognitive recycling overnight.",
				"Consistency beats complexity for circadian alignment.",
			],
			actions: [
				"Set a daily alarm for your digital sunset.",
				"Do one evening Mindify sleep track right after journaling.",
				"Track morning energy for one week to gauge impact.",
			],
		}),
		keyTakeaways: [
			"SCN relies on light, temperature, and feeding cues.",
			"Evening breathwork lowers heart rate variability stress markers.",
			"Environmental tweaks compound over time.",
		],
		actionSteps: [
			"Block 20 minutes nightly for a repeatable routine.",
			"Use the Better Sleep Protocol audio nightly.",
			"Measure sleep latency to prove the change.",
		],
		recommendedSessions: [
			{ id: "evening-decompression", type: "meditation", title: "Evening Decompression" },
			{ id: "deep-sleep-reset", type: "meditation", title: "Deep Sleep Reset" },
		],
		references: [
			"Walker, M. (2017). Why We Sleep.",
			"Buysse, D. (2014). Sleep health framework.",
		],
	},
	{
		slug: "dopamine-productivity",
		title: "Dopamine & Productivity: The Motivation Molecule",
		category: "productivity",
		readTimeMinutes: 5,
		thumbnail: "/images/knowledge/dopamine.jpg",
		author: "Elio Hart",
		updatedAt: "2025-03-29",
		content: baseMarkdown({
			title: "Dopamine & Productivity",
			description: "Learn how dopamine prediction errors drive motivation and how to architect rewarding workflows.",
			body: `## Dopamine’s Job

Dopamine spikes when outcomes beat expectations. In creative or executive work, you must design **predictable wins** so motivation stays high.

## Workflow Design

- **Chunk tasks** so each block ends with a visible outcome.
- **Celebrate micro wins** immediately (write it, say it aloud, share it).
- **Alternate effort types** (analytical vs creative) to avoid receptor fatigue.

## Avoid Dopamine Debt

Scrolling / constant novelty floods dopamine without progress. Use deliberate novelty: change location, add a new audio layer, or invite a collaborator when energy dips.
`,
			takeaways: [
				"Dopamine is a learning signal; protect it from low-quality hits.",
				"Visible proof of progress keeps motivation alive.",
				"Context changes are better than doom-scrolling breaks.",
			],
			actions: [
				"List the tiny wins you’ll log during tomorrow’s sprint.",
				"Pair Mindify’s Focus Primer with a novel scent to anchor motivation.",
				"Swap scrolling for intentional novelty (walk, cold rinse, etc.).",
			],
		}),
		keyTakeaways: [
			"Prediction errors modulate dopamine release.",
			"Progress logs keep momentum even when outputs take weeks.",
			"Mindless novelty drains motivation reserves.",
		],
		actionSteps: [
			"Implement a 2-minute win log at day’s end.",
			"Use Mindify’s Productivity Flow Loop to transition into deep work.",
			"Share one micro win with your community to reinforce it.",
		],
		recommendedSessions: [
			{ id: "productivity-loop", type: "meditation", title: "Productivity Flow Loop" },
			{ id: "overwhelm-pattern-reset", type: "meditation", title: "Overwhelm Pattern Reset" },
		],
		references: [
			"Schultz, W. (2016). Dopamine reward prediction-error.",
			"Wise, R. (2004). Dopamine and love learning.",
		],
	},
	{
		slug: "reprogram-mind-dispenza",
		title: "How to Reprogram Your Mind: Dispenza-Style Neuroplasticity",
		category: "psychology",
		readTimeMinutes: 6,
		thumbnail: "/images/knowledge/neuroplasticity.jpg",
		author: "Mara Xie",
		updatedAt: "2025-06-02",
		content: baseMarkdown({
			title: "Reprogram Your Mind",
			description: "Blend Joe Dispenza’s visualization rituals with peer-reviewed neuroplasticity science.",
			body: `## Identity vs Behavior

Thoughts are electrical; emotions are chemical. Repetition wires identity, but only if you add elevated emotion (gratitude, awe) plus visual proof.

## Neuroplasticity Stack

1. **Induce coherence:** slow breathing + heart-focus until HRV balances.
2. **Future self rehearsal:** visualize specific sensory details of the new identity.
3. **Act immediately:** take a micro action congruent with the future version.

## Evidence Journaling

Your brain believes what it sees you doing. Log daily “evidence points” proving you already are the upgraded identity. This collapses the gap between visualization and reality.
`,
			takeaways: [
				"Elevated emotions amplify synaptic plasticity.",
				"Visualization must be paired with immediate action.",
				"Evidence journaling convinces your nervous system faster.",
			],
			actions: [
				"Run the coherence + rehearsal drill every morning for 14 days.",
				"Journal three evidence points nightly.",
				"Pair with Mindify hypnosis to deepen the belief shifts.",
			],
		}),
		keyTakeaways: [
			"Heart-brain coherence boosts neuroplasticity.",
			"Somatic emotions accelerate belief adoption.",
			"Proof stacking reprograms identity faster than affirmations alone.",
		],
		actionSteps: [
			"Schedule a 10-minute morning ritual for coherence + rehearsal.",
			"Use Deep Confidence hypnosis during the ritual.",
			"Share evidence wins weekly with your community.",
		],
		recommendedSessions: [
			{ id: "deep-confidence", type: "hypnosis", title: "Deep Confidence" },
			{ id: "productivity-loop", type: "meditation", title: "Productivity Flow Loop" },
		],
		references: [
			"Dispenza, J. (2014). You Are the Placebo.",
			"Hebb, D. (1949). Synaptic plasticity foundations.",
		],
	},
	{
		slug: "breathwork-mental-performance",
		title: "Breathwork for Mental Performance: Vagal Tone & HRV",
		category: "breathwork",
		readTimeMinutes: 4,
		thumbnail: "/images/knowledge/breathwork.jpg",
		author: "Ivy Cano",
		updatedAt: "2025-05-10",
		content: baseMarkdown({
			title: "Breathwork for Mental Performance",
			description: "Use breath ratios to tune vagal tone, improve HRV, and unlock calm intensity.",
			body: `## Why Breath Works

Slow exhalations signal safety, increasing parasympathetic dominance. Resonant breathing (~5.5 breaths per minute) maximizes HRV and cognitive flexibility.

## Three Breath Protocols

- **Box Breath (4-4-4-4):** Stabilize before high-stakes calls.
- **4-2-6 Tactical:** Rapid calm without losing alertness.
- **Cycling Breath (inhale left nostril, exhale right):** Balances hemispheres, sharpens focus.

## Integrate With Mindify

Layer breath cues inside our 3-minute resets or at the start of longer meditations for compounded effect.
`,
			takeaways: [
				"Vagal tone predicts emotional resilience.",
				"Specific ratios deliver predictable outcomes.",
				"Pairing breath with audio primes neural pathways faster.",
			],
			actions: [
				"Schedule one 4-minute breath session before deep work daily.",
				"Use Instant Calm Downshift when anxiety hits.",
				"Track HRV for two weeks to measure changes.",
			],
		}),
		keyTakeaways: [
			"Breath is the fastest lever for vagal tone.",
			"Ratios map to specific nervous system outcomes.",
			"Consistency trumps intensity with breathwork.",
		],
		actionSteps: [
			"Add breath cues to morning journaling.",
			"Run the Grounding Breath reset before key meetings.",
			"Share HRV improvements with your team to normalize breath breaks.",
		],
		recommendedSessions: [
			{ id: "grounding-breath-1", type: "meditation", title: "1-Minute Grounding Breath" },
			{ id: "stress-release-field", type: "meditation", title: "Stress Release Field" },
		],
		references: [
			"Lehrer, P. (2013). Heart rate variability biofeedback.",
			"Nestor, J. (2020). Breath science overview.",
		],
	},
	{
		slug: "default-mode-network",
		title: "The Default Mode Network: Understanding Mind Wandering",
		category: "neuroscience",
		readTimeMinutes: 4,
		thumbnail: "/images/knowledge/dmn.jpg",
		author: "Dr. Kenji Patel",
		updatedAt: "2025-04-05",
		content: baseMarkdown({
			title: "Default Mode Network",
			description: "Harness the DMN by toggling between introspection and task mode intentionally.",
			body: `## DMN Basics

The default mode network (DMN) lights up during mind wandering, self-referential thinking, and future simulation. Overactivation can spiral into rumination, but controlled DMN time unlocks creativity.

## Controlled Mind Wandering

Alternate 45 minutes of focus with 5 minutes of deliberate daydreaming. Use Mindify's Pattern Interrupt audio to re-enter execution mode.

## DMN Hygiene

- Journaling externalizes self-talk.
- Moving your body resets DMN-to-task positive coupling.
- Sharing ideas aloud prevents rumination loops.
`,
			takeaways: [
				"DMN is not the enemy; unmanaged DMN is.",
				"Intentional mind wandering improves creativity.",
				"Use audio cues to exit rumination fast.",
			],
			actions: [
				"Schedule DMN breaks instead of accidental ones.",
				"Use Pattern Interrupt when rumination hits.",
				"Share DMN insights weekly to make them real.",
			],
		}),
		keyTakeaways: [
			"DMN supports creativity when bounded.",
			"Physical movement helps toggle off rumination.",
			"Audio cues can re-engage task-positive networks quickly.",
		],
		actionSteps: [
			"Set a timer for 5-minute wander sessions midday.",
			"Journal your best daydream idea each week.",
			"Use Pattern Interrupt audio after wander time.",
		],
		recommendedSessions: [
			{ id: "pattern-interrupt", type: "meditation", title: "Pattern Interrupt Audio" },
			{ id: "focus-activation", type: "meditation", title: "Focus Activation" },
		],
		references: [
			"Raichle, M. (2015). The Brain's Default Mode Network.",
			"Mason, M. (2007). Wandering minds literature.",
		],
	},
	{
		slug: "habit-stacking-mental-routines",
		title: "Habit Stacking: Building Lasting Mental Routines",
		category: "productivity",
		readTimeMinutes: 4,
		thumbnail: "/images/knowledge/habits.jpg",
		author: "Evan Rhodes",
		updatedAt: "2025-04-21",
		content: baseMarkdown({
			title: "Habit Stacking for Mental Routines",
			description: "Link existing rituals with new mental training to hardwire resilience.",
			body: `## Habit Stacking 101

Link a new ritual to an existing habit. Example: after I brew coffee, I do a 90-second breath circuit. Your brain already has neuronal pathways for the existing habit; we piggyback on them.

## Mental Routine Stack

- Morning: Coffee → Breathwork → Focus Primer.
- Midday: Lunch → 1-Minute Grounding → Quick gratitude log.
- Evening: Shutdown → Sleep hypnosis → Evidence journaling.

## Celebrate Micro Adherence

Log completions for 14 days. Missing a day isn't failure; double down on the next anchor instead of “starting over.”`,
			takeaways: [
				"Existing habits act as anchors for new rituals.",
				"Multiple small stacks beat one giant routine.",
				"Celebrating adherence keeps motivation alive.",
			],
			actions: [
				"Choose one morning, one midday, and one evening anchor.",
				"Pair Mindify resets with those anchors.",
				"Track streaks visually to reinforce them.",
			],
		}),
		keyTakeaways: [
			"Habit stacks piggyback on existing neural pathways.",
			"Short rituals compound when linked to anchors.",
			"Visual streak tracking locks new habits faster.",
		],
		actionSteps: [
			"Define three anchors today with Mindify sessions attached.",
			"Use the Daily Check-In to log habit wins.",
			"Reevaluate stacks weekly and adjust anchors if necessary.",
		],
		recommendedSessions: [
			{ id: "focus-activation", type: "meditation", title: "Focus Activation" },
			{ id: "grounding-breath-1", type: "meditation", title: "1-Minute Grounding Breath" },
		],
		references: [
			"Clear, J. (2018). Atomic Habits.",
			"Wood, W. (2019). Good Habits, Bad Habits.",
		],
	},
];
