-- Mindify Database Schema
-- Migration 005: Seed Content Data
-- Created: 2026-02-28
-- Description: Inserts existing mock data so current content is preserved in the database

-- =============================================================================
-- SEED: meditations
-- =============================================================================
INSERT INTO meditations (id, title, description, duration, category, audio_url, image_url, mood, is_new, is_premium, sort_order) VALUES
('focus-activation', 'Focus Activation: Neural Pathway Priming', 'Breath-synced prompts and soft synth pulses to ignite executive function in under 12 minutes.', 12, 'focus', '/audio/focus-activation.mp3', '/images/meditations/focus-activation.jpg', ARRAY['unfocused'], true, false, 1),
('morning-mind-priming', 'Morning Mind Priming: Set Your Day''s Intention', 'Somatic check-ins plus visualization layered with gentle percussion to script your day.', 8, 'morning', '/audio/morning-priming.mp3', '/images/meditations/morning-priming.jpg', ARRAY['tired'], false, false, 2),
('evening-decompression', 'Evening Decompression: Release the Day', 'Guided unwinding ritual blending cello drones with diaphragmatic breath cues.', 15, 'evening', '/audio/evening-decompression.mp3', '/images/meditations/evening-decompression.jpg', ARRAY['stressed', 'overwhelmed'], false, false, 3),
('deep-sleep-reset', 'Deep Sleep Reset: Delta Wave Induction', 'Slow-wave entrainment and ASMR textures to drop you into restorative sleep.', 20, 'sleep', '/audio/deep-sleep-reset.mp3', '/images/meditations/deep-sleep.jpg', ARRAY['tired', 'overwhelmed'], false, true, 4),
('stress-release-field', 'Stress Release Field', 'Polyvagal humming plus percussion swells that defuse cortisol spikes in five minutes.', 5, 'stress', '/audio/stress-release.mp3', '/images/meditations/stress-release.jpg', ARRAY['stressed'], false, false, 5),
('overwhelm-pattern-reset', 'Overwhelm Pattern Reset', 'Guided tapping sequence paired with immersive soundscapes to reopen capacity.', 11, 'overwhelm', '/audio/overwhelm-reset.mp3', '/images/meditations/overwhelm-reset.jpg', ARRAY['overwhelmed'], false, true, 6),
('productivity-loop', 'Productivity Flow Loop', 'Lo-fi pulses with timed focus cues to power through deep work sprints and reset posture.', 18, 'productivity', '/audio/productivity-loop.mp3', '/images/meditations/productivity-loop.jpg', ARRAY['unfocused'], false, false, 7),
('emotional-processing', 'Emotional Processing Ritual', 'Compassion-based meditation with journaling prompts to metabolize high-signal emotions.', 14, 'emotional', '/audio/emotional-processing.mp3', '/images/meditations/emotional-processing.jpg', ARRAY['stressed', 'overwhelmed'], false, true, 8),
('evening-breath-lullaby', 'Evening Breath Lullaby', 'Layered toning exercises and lullaby strings for calm transitions.', 10, 'evening', '/audio/evening-breath.mp3', '/images/meditations/evening-breath.jpg', ARRAY['tired'], false, false, 9)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SEED: hypnosis_sessions
-- =============================================================================
INSERT INTO hypnosis_sessions (id, title, description, duration, theme, audio_url, has_binaural, daytime_version, nighttime_version, is_premium, sort_order) VALUES
('procrastination-rewire', 'End Procrastination: Neural Pathway Rewiring', 'Guided induction that reframes delayed gratification and installs decisive action loops.', 24, 'procrastination', '/audio/hypnosis-procrastination.mp3', true, '/audio/hypnosis-procrastination-day.mp3', '/audio/hypnosis-procrastination-night.mp3', false, 1),
('overthinking-reset', 'Stop Overthinking: Subconscious Pattern Reset', 'Somatic scanning plus subconscious reparenting to dissolve repetitive cognitive loops.', 28, 'overthinking', '/audio/hypnosis-overthinking.mp3', true, '/audio/hypnosis-overthinking-day.mp3', '/audio/hypnosis-overthinking-night.mp3', false, 2),
('deep-confidence', 'Deep Confidence: Inner Belief Installation', 'Future pacing and embodied visualization to anchor unwavering confidence.', 22, 'confidence', '/audio/hypnosis-confidence.mp3', true, '/audio/hypnosis-confidence-day.mp3', '/audio/hypnosis-confidence-night.mp3', false, 3),
('productivity-conditioning', 'Productivity Conditioning: Peak Performance State', 'Anchor flow triggers and neural priming to sustain peak output windows.', 26, 'productivity', '/audio/hypnosis-productivity.mp3', false, '/audio/hypnosis-productivity-day.mp3', '/audio/hypnosis-productivity-night.mp3', false, 4),
('quit-smoking', 'Quit Smoking: Addiction Pattern Disruption', 'Rewire reward pathways and create aversion responses to nicotine cravings. Premium access required.', 30, 'smoking', '/audio/hypnosis-smoking.mp3', true, '/audio/hypnosis-smoking-day.mp3', '/audio/hypnosis-smoking-night.mp3', true, 5),
('calm-nervous-system', 'Calm Nervous System: Vagal Tone Activation', 'Polyvagal-informed induction to regulate heart rate variability and widen your window of tolerance.', 18, 'nervous-system', '/audio/hypnosis-vagal.mp3', true, '/audio/hypnosis-vagal-day.mp3', '/audio/hypnosis-vagal-night.mp3', false, 6),
('high-performance-mindset', 'High Performance Mindset: Winner''s Psychology', 'Stack embodied affirmations with mental rehearsal to cultivate an elite, calm intensity.', 25, 'performance', '/audio/hypnosis-performance.mp3', false, '/audio/hypnosis-performance-day.mp3', '/audio/hypnosis-performance-night.mp3', false, 7)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SEED: programs
-- (days JSONB contains the full nested structure)
-- =============================================================================
INSERT INTO programs (id, title, tagline, description, duration, category, difficulty, cover_image, include_summary, requirements, benefits, time_commitment, recommended_for, days, is_premium, sort_order) VALUES
(
  'focus-reset-7',
  '7-Day Focus Reset',
  'Reclaim your attention and build rituals for deep work that stick.',
  'A concise nervous system tune-up that rewires your attention loops with somatic practices, tactical workflows, and accountability rituals.',
  7, 'focus', 'beginner',
  '/images/programs/focus-reset.jpg',
  '{"meditations": 7, "tasks": 21, "journalPrompts": 7}',
  ARRAY['Headphones for audio sessions', '15 minutes of quiet time daily', 'Focus baseline worksheet'],
  ARRAY['Crystal-clear morning priorities', 'Calm, interruption-proof work blocks', 'Body awareness for early distraction cues'],
  '25-35 minutes per day',
  ARRAY['Founders', 'Operators', 'Creators with scattered focus'],
  '[{"dayNumber":1,"title":"Understanding Your Attention","audioSession":"focus-activation","tasks":["Complete the Focus Baseline questionnaire","Identify the top 2 distractions pulling you off task","Schedule a 15-minute observation block"],"journalPrompts":["When do you feel most focused? What environmental cues help?"],"quote":"Attention flows where intention goes."},{"dayNumber":2,"title":"Eliminating Digital Noise","audioSession":"morning-mind-priming","tasks":["Audit all notifications and disable 50% of them","Create a ''deep work'' home screen","Install website limiter for key distractions"],"journalPrompts":["What noise sources are easiest to remove today?"]},{"dayNumber":3,"title":"Deep Work Foundations","audioSession":"productivity-loop","tasks":["Define your highest-leverage task for tomorrow","Block 90 minutes on your calendar","Prepare your workspace with analog backup"],"journalPrompts":["Describe your ideal deep work ritual in detail."]},{"dayNumber":4,"title":"Flow State Entry","audioSession":"overwhelm-pattern-reset","tasks":["Practice the 4-7-8 breath cycle for 3 rounds","Use a 5-minute movement primer before work","Select your soundtrack or ambient noise"],"journalPrompts":["What triggers help you drop into flow quickest?"]},{"dayNumber":5,"title":"Sustained Concentration","audioSession":"stress-release-field","tasks":["Implement the 52/17 work cadence","Track when your energy dips throughout the day","Identify one teammate to run accountability"],"journalPrompts":["Where did your concentration break today? Why?"]},{"dayNumber":6,"title":"Attention Recovery","audioSession":"evening-decompression","tasks":["Schedule three micro-breaks with nervous system resets","Complete a full-body scan before bed","Prepare tomorrow''s first task with clarity"],"journalPrompts":["How does your body signal the need for recovery?"]},{"dayNumber":7,"title":"Focus Integration","audioSession":"focus-activation","tasks":["Write a commitment contract for post-program weeks","Share your wins with an accountability partner","Set reminders for weekly focus audits"],"journalPrompts":["What focus identity are you stepping into now?"]}]',
  false, 1
),
(
  'productivity-mind-rewire-21',
  '21-Day Productivity & Mind Rewiring',
  'Release procrastination, install elite execution patterns, and keep them.',
  'A three-week immersive challenge moving you from mindset priming into ruthless implementation and long-tail integration. Includes hypnosis, meditations, and micro-behavior sprints.',
  21, 'productivity', 'intermediate',
  '/images/programs/productivity-rewire.jpg',
  '{"meditations": 18, "tasks": 63, "journalPrompts": 21}',
  ARRAY['Daily check-ins (10 min)', 'Weekly reflection upload', 'Ability to carve 60-minute sprints'],
  ARRAY['Consistent execution even on low-motivation days', 'Upgraded relationship with pressure and deadlines', 'A repeatable operating cadence for big milestones'],
  '40-55 minutes per day',
  ARRAY['Founders scaling teams', 'Agency owners', 'Creators launching products'],
  '[]',
  true, 2
),
(
  'better-sleep-protocol-10',
  '10-Day Better Sleep Protocol',
  'Engineer restorative nights with science-backed rituals and dream priming.',
  'Pair sleep hygiene labs, gentle hypnosis, and journaling to build a predictable evening arc that actually sticks.',
  10, 'sleep', 'beginner',
  '/images/programs/sleep-protocol.jpg',
  '{"meditations": 10, "tasks": 30, "journalPrompts": 10}',
  ARRAY['Blue light reduction tools', 'Journal near bedside', 'Optional sleep tracker'],
  ARRAY['Easier transitions from work mode to rest', 'Reduced night wakings and anxiety loops', 'Morning clarity with dream recall rituals'],
  '30 minutes in the evening',
  ARRAY['Founders with late-night rumination', 'Shifted sleep schedules', 'Parents needing evening calm'],
  '[]',
  false, 3
),
(
  'neuroplasticity-upgrade-14',
  '14-Day Neuroplasticity Mindset Upgrade',
  'Install durable identity upgrades through hypnosis and evidence stacking.',
  'A guided neuroplasticity lab blending hypnosis, somatic anchoring, and micro-behavior experiments to lock in new beliefs.',
  14, 'mindset', 'intermediate',
  '/images/programs/neuroplasticity-upgrade.jpg',
  '{"meditations": 12, "tasks": 42, "journalPrompts": 14}',
  ARRAY['Headphones', 'Mirror or camera for rehearsal', 'Partner or community for reflections'],
  ARRAY['Rapid belief auditing and replacement', 'Expanded nervous system range for bigger moves', 'Embodied confidence anchored to daily cues'],
  '35-45 minutes per day',
  ARRAY['Leaders stepping into new roles', 'Creators scaling personal brand', 'Anyone rewiring self-talk'],
  '[]',
  true, 4
),
(
  'overwhelm-to-clarity',
  'Overwhelm-to-Clarity System',
  'Diffuse stress signatures and build a decision-making sanctuary.',
  'A hybrid of nervous system resets, cognitive unloading, and operational clarity practices to move from chaos to calm execution.',
  10, 'clarity', 'beginner',
  '/images/programs/clarity-system.jpg',
  '{"meditations": 10, "tasks": 30, "journalPrompts": 10}',
  ARRAY['Quiet reflection block', 'Printable clarity map', 'Optionally a coach/accountability partner'],
  ARRAY['Reconnection to your calm baseline even on heavy days', 'Repeatable process for priority sorting', 'Language to set boundaries without guilt'],
  '30 minutes per day',
  ARRAY['High-output leaders', 'Folks rebuilding routines', 'Anyone post-burnout'],
  '[]',
  false, 5
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SEED: quick_resets
-- =============================================================================
INSERT INTO quick_resets (id, title, duration, type, audio_url, instructions, sort_order) VALUES
('grounding-breath-1', '1-Minute Grounding Breath', 1, 'breath', '/audio/quick-resets/grounding-breath.mp3', 'Follow the 4-2-6 tactical breathing cadence with nasal inhale, brief hold, extended exhale.', 1),
('anxiety-switch-2', '2-Minute Anxiety Switch-Off', 2, 'anxiety', '/audio/quick-resets/anxiety-switch.mp3', 'Layer bilateral tapping with whispered cues to downshift adrenaline spikes.', 2),
('focus-primer-3', '3-Minute Focus Primer', 3, 'focus', '/audio/quick-resets/focus-primer.mp3', 'Use rhythmic breath holds to prime prefrontal activation before deep work.', 3),
('calm-downshift', 'Instant Calm Downshift', 2, 'calm', '/audio/quick-resets/calm-downshift.mp3', 'Pulse vagal toning hums with shoulder drops for immediate tension release.', 4),
('pattern-interrupt', 'Pattern Interrupt Audio', 2, 'pattern-interrupt', '/audio/quick-resets/pattern-interrupt.mp3', 'Layer sharp sonic cues with guided visualization to shock looping thoughts.', 5)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SEED: knowledge_articles
-- =============================================================================
INSERT INTO knowledge_articles (slug, title, category, author, read_time_minutes, thumbnail, content, key_takeaways, action_steps, recommended_sessions, sort_order) VALUES
(
  'breaking-overwhelm-cycle',
  'Breaking the Overwhelm Cycle: Neuroscience of Stress',
  'neuroscience',
  'Dr. Lila Rowan',
  6,
  '/images/knowledge/overwhelm.jpg',
  '# Breaking the Overwhelm Cycle

_Decode how the amygdala-hypothalamus axis floods your system and how to reclaim cognitive clarity._

## Stress Loop Mechanics

When your amygdala flags a threat, the hypothalamus and pituitary glands launch a cortisol cascade. This keeps you safe in the short term but hijacks prefrontal cortex bandwidth when it becomes chronic.

**Polyvagal nuance:** your vagus nerve toggles between mobilization (fight-flight) and immobilization (freeze). We want strategic ventral vagal activation so you can take decisive action without frying your wiring.

## Pattern Interrupt Protocol

1. **Orient:** count five objects behind you. This snaps the midbrain out of tunnel vision.
2. **Exhale Emphasis:** 4-2-8 breathing downregulates sympathetic charge.
3. **Somatic Audit:** name one sensation in your chest, one in your gut, one on your skin.
4. **Micro Choice:** ask "What is the next reversible step?" - reclaims agency.

Layer this protocol before heavy decision blocks or when you feel the "screen-swipe panic" show up.

## Key Takeaways

- Overwhelm is a neurochemical loop, not a personal failing.
- Slow exhalations and orientation drills free prefrontal resources.
- Micro choices rebuild agency faster than abstract mindset shifts.

## Actionable Steps

1. Schedule two 90-second overwhelm resets during high-load days.
2. Pair 4-2-8 breathing with tactile cues to make it memorable.
3. Log triggers that precede overwhelm to preempt them next sprint.',
  ARRAY['Amygdala-driven cortisol loops narrow attention and spike error rates.', 'Ventral vagal activation restores executive function.', 'Actionable somatic drills beat purely cognitive reframes.'],
  ARRAY['Run the orient-breathe-scan protocol twice daily for one week.', 'Tag stressful tasks with a specific buffer ritual in your calendar.', 'Share your overwhelm script with a teammate for accountability.'],
  '[{"id": "stress-release-field", "type": "meditation", "title": "Stress Release Field"}, {"id": "overwhelm-pattern-reset", "type": "meditation", "title": "Overwhelm Pattern Reset"}]',
  1
),
(
  'science-of-focus',
  'The Science of Focus: How Attention Really Works',
  'focus',
  'Noelle Vega',
  5,
  '/images/knowledge/focus.jpg',
  '# The Science of Focus

_Understand attentional spotlight theory, dopamine gating, and how to architect deep work windows._

## Spotlight Mechanics

Attention is a spotlight controlled by your dorsal attention network (for goal-directed focus) and the ventral network (for novelty interrupts). Context switching pulls blood flow away from prefrontal control centers for up to 8 minutes.

## Dopamine as a Tracking Signal

Dopamine isn''t just a "pleasure chemical." It''s a prediction signal. When your brain anticipates a meaningful reward, it tags the current task as worth energy. Design your workflow so micro wins release dopamine on schedule.

## Build Focus Sprints

- **Prime:** 2-minute diaphragmatic breathing + set intention.
- **Protect:** block notifications, physically remove your phone, use noise shaping audio.
- **Pulse:** operate in 52/17 cadence; the brain loves intervals.
- **Reflect:** log one sentence on what felt sticky to refine the next sprint.

## Key Takeaways

- Attention has two neural networks; you must calm the novelty one.
- Dopamine tracks predicted progress, so front-load clarity.
- Short, intense intervals beat marathon focus attempts.

## Actionable Steps

1. Schedule three 52/17 sprints tomorrow with clear deliverables.
2. Prime each sprint with a 120-second breath ritual.
3. Reward completions immediately to reinforce the loop.',
  ARRAY['Context switching costs accumulate faster than most teams expect.', 'Breath-led priming improves frontal lobe oxygenation.', 'Cadence rhythm (like 52/17) keeps dopamine churning.'],
  ARRAY['Design tomorrow''s sprints before you end today.', 'Pair focus blocks with Mindify''s Focus Primer audio.', 'Do a 60-second debrief after each sprint to anchor learning.'],
  '[{"id": "focus-activation", "type": "meditation", "title": "Focus Activation"}, {"id": "productivity-loop", "type": "meditation", "title": "Productivity Flow Loop"}]',
  2
),
(
  'nighttime-routine-sleep',
  'Nighttime Routine for Better Sleep: Circadian Optimization',
  'sleep',
  'Zuri Ahmed',
  4,
  '/images/knowledge/sleep.jpg',
  '# Nighttime Routine for Better Sleep

_Calibrate circadian cues, body temperature, and light hygiene for restorative nights._

## Circadian Building Blocks

Your suprachiasmatic nucleus (SCN) sets the pace. Send consistent signals:

- **Morning sunlight** within 30 minutes resets melatonin onset.
- **Temperature drop** at night triggers drowsiness; take a warm shower 90 minutes before bed to induce a rebound drop.

## Sleep Ritual Stack

1. **Digital Sunset:** kill blue light / notifications 60 minutes pre-bed.
2. **Downshift Breath:** 4-7-8 or box breathing to slow heart rate.
3. **Somatic unload:** 5-minute journaling or body scan to empty working memory.
4. **Environmental cues:** 65F room, blackout curtains, white noise if helpful.

## Key Takeaways

- Timing of light and temperature cues matters more than supplements.
- Breathwork plus journaling prevents cognitive recycling overnight.
- Consistency beats complexity for circadian alignment.

## Actionable Steps

1. Set a daily alarm for your digital sunset.
2. Do one evening Mindify sleep track right after journaling.
3. Track morning energy for one week to gauge impact.',
  ARRAY['SCN relies on light, temperature, and feeding cues.', 'Evening breathwork lowers heart rate variability stress markers.', 'Environmental tweaks compound over time.'],
  ARRAY['Block 20 minutes nightly for a repeatable routine.', 'Use the Better Sleep Protocol audio nightly.', 'Measure sleep latency to prove the change.'],
  '[{"id": "evening-decompression", "type": "meditation", "title": "Evening Decompression"}, {"id": "deep-sleep-reset", "type": "meditation", "title": "Deep Sleep Reset"}]',
  3
),
(
  'dopamine-productivity',
  'Dopamine & Productivity: The Motivation Molecule',
  'productivity',
  'Elio Hart',
  5,
  '/images/knowledge/dopamine.jpg',
  '# Dopamine & Productivity

_Learn how dopamine prediction errors drive motivation and how to architect rewarding workflows._

## Dopamine''s Job

Dopamine spikes when outcomes beat expectations. In creative or executive work, you must design **predictable wins** so motivation stays high.

## Workflow Design

- **Chunk tasks** so each block ends with a visible outcome.
- **Celebrate micro wins** immediately (write it, say it aloud, share it).
- **Alternate effort types** (analytical vs creative) to avoid receptor fatigue.

## Avoid Dopamine Debt

Scrolling / constant novelty floods dopamine without progress. Use deliberate novelty: change location, add a new audio layer, or invite a collaborator when energy dips.

## Key Takeaways

- Dopamine is a learning signal; protect it from low-quality hits.
- Visible proof of progress keeps motivation alive.
- Context changes are better than doom-scrolling breaks.

## Actionable Steps

1. List the tiny wins you''ll log during tomorrow''s sprint.
2. Pair Mindify''s Focus Primer with a novel scent to anchor motivation.
3. Swap scrolling for intentional novelty (walk, cold rinse, etc.).',
  ARRAY['Prediction errors modulate dopamine release.', 'Progress logs keep momentum even when outputs take weeks.', 'Mindless novelty drains motivation reserves.'],
  ARRAY['Implement a 2-minute win log at day''s end.', 'Use Mindify''s Productivity Flow Loop to transition into deep work.', 'Share one micro win with your community to reinforce it.'],
  '[{"id": "productivity-loop", "type": "meditation", "title": "Productivity Flow Loop"}, {"id": "overwhelm-pattern-reset", "type": "meditation", "title": "Overwhelm Pattern Reset"}]',
  4
),
(
  'reprogram-mind-dispenza',
  'How to Reprogram Your Mind: Dispenza-Style Neuroplasticity',
  'psychology',
  'Mara Xie',
  6,
  '/images/knowledge/neuroplasticity.jpg',
  '# Reprogram Your Mind

_Blend Joe Dispenza''s visualization rituals with peer-reviewed neuroplasticity science._

## Identity vs Behavior

Thoughts are electrical; emotions are chemical. Repetition wires identity, but only if you add elevated emotion (gratitude, awe) plus visual proof.

## Neuroplasticity Stack

1. **Induce coherence:** slow breathing + heart-focus until HRV balances.
2. **Future self rehearsal:** visualize specific sensory details of the new identity.
3. **Act immediately:** take a micro action congruent with the future version.

## Evidence Journaling

Your brain believes what it sees you doing. Log daily "evidence points" proving you already are the upgraded identity. This collapses the gap between visualization and reality.

## Key Takeaways

- Elevated emotions amplify synaptic plasticity.
- Visualization must be paired with immediate action.
- Evidence journaling convinces your nervous system faster.

## Actionable Steps

1. Run the coherence + rehearsal drill every morning for 14 days.
2. Journal three evidence points nightly.
3. Pair with Mindify hypnosis to deepen the belief shifts.',
  ARRAY['Heart-brain coherence boosts neuroplasticity.', 'Somatic emotions accelerate belief adoption.', 'Proof stacking reprograms identity faster than affirmations alone.'],
  ARRAY['Schedule a 10-minute morning ritual for coherence + rehearsal.', 'Use Deep Confidence hypnosis during the ritual.', 'Share evidence wins weekly with your community.'],
  '[{"id": "deep-confidence", "type": "hypnosis", "title": "Deep Confidence"}, {"id": "productivity-loop", "type": "meditation", "title": "Productivity Flow Loop"}]',
  5
),
(
  'breathwork-mental-performance',
  'Breathwork for Mental Performance: Vagal Tone & HRV',
  'breathwork',
  'Ivy Cano',
  4,
  '/images/knowledge/breathwork.jpg',
  '# Breathwork for Mental Performance

_Use breath ratios to tune vagal tone, improve HRV, and unlock calm intensity._

## Why Breath Works

Slow exhalations signal safety, increasing parasympathetic dominance. Resonant breathing (~5.5 breaths per minute) maximizes HRV and cognitive flexibility.

## Three Breath Protocols

- **Box Breath (4-4-4-4):** Stabilize before high-stakes calls.
- **4-2-6 Tactical:** Rapid calm without losing alertness.
- **Cycling Breath (inhale left nostril, exhale right):** Balances hemispheres, sharpens focus.

## Integrate With Mindify

Layer breath cues inside our 3-minute resets or at the start of longer meditations for compounded effect.

## Key Takeaways

- Vagal tone predicts emotional resilience.
- Specific ratios deliver predictable outcomes.
- Pairing breath with audio primes neural pathways faster.

## Actionable Steps

1. Schedule one 4-minute breath session before deep work daily.
2. Use Instant Calm Downshift when anxiety hits.
3. Track HRV for two weeks to measure changes.',
  ARRAY['Breath is the fastest lever for vagal tone.', 'Ratios map to specific nervous system outcomes.', 'Consistency trumps intensity with breathwork.'],
  ARRAY['Add breath cues to morning journaling.', 'Run the Grounding Breath reset before key meetings.', 'Share HRV improvements with your team to normalize breath breaks.'],
  '[{"id": "grounding-breath-1", "type": "meditation", "title": "1-Minute Grounding Breath"}, {"id": "stress-release-field", "type": "meditation", "title": "Stress Release Field"}]',
  6
),
(
  'default-mode-network',
  'The Default Mode Network: Understanding Mind Wandering',
  'neuroscience',
  'Dr. Kenji Patel',
  4,
  '/images/knowledge/dmn.jpg',
  '# Default Mode Network

_Harness the DMN by toggling between introspection and task mode intentionally._

## DMN Basics

The default mode network (DMN) lights up during mind wandering, self-referential thinking, and future simulation. Overactivation can spiral into rumination, but controlled DMN time unlocks creativity.

## Controlled Mind Wandering

Alternate 45 minutes of focus with 5 minutes of deliberate daydreaming. Use Mindify''s Pattern Interrupt audio to re-enter execution mode.

## DMN Hygiene

- Journaling externalizes self-talk.
- Moving your body resets DMN-to-task positive coupling.
- Sharing ideas aloud prevents rumination loops.

## Key Takeaways

- DMN is not the enemy; unmanaged DMN is.
- Intentional mind wandering improves creativity.
- Use audio cues to exit rumination fast.

## Actionable Steps

1. Schedule DMN breaks instead of accidental ones.
2. Use Pattern Interrupt when rumination hits.
3. Share DMN insights weekly to make them real.',
  ARRAY['DMN supports creativity when bounded.', 'Physical movement helps toggle off rumination.', 'Audio cues can re-engage task-positive networks quickly.'],
  ARRAY['Set a timer for 5-minute wander sessions midday.', 'Journal your best daydream idea each week.', 'Use Pattern Interrupt audio after wander time.'],
  '[{"id": "pattern-interrupt", "type": "meditation", "title": "Pattern Interrupt Audio"}, {"id": "focus-activation", "type": "meditation", "title": "Focus Activation"}]',
  7
),
(
  'habit-stacking-mental-routines',
  'Habit Stacking: Building Lasting Mental Routines',
  'productivity',
  'Evan Rhodes',
  4,
  '/images/knowledge/habits.jpg',
  '# Habit Stacking for Mental Routines

_Link existing rituals with new mental training to hardwire resilience._

## Habit Stacking 101

Link a new ritual to an existing habit. Example: after I brew coffee, I do a 90-second breath circuit. Your brain already has neuronal pathways for the existing habit; we piggyback on them.

## Mental Routine Stack

- Morning: Coffee -> Breathwork -> Focus Primer.
- Midday: Lunch -> 1-Minute Grounding -> Quick gratitude log.
- Evening: Shutdown -> Sleep hypnosis -> Evidence journaling.

## Celebrate Micro Adherence

Log completions for 14 days. Missing a day isn''t failure; double down on the next anchor instead of "starting over."

## Key Takeaways

- Existing habits act as anchors for new rituals.
- Multiple small stacks beat one giant routine.
- Celebrating adherence keeps motivation alive.

## Actionable Steps

1. Choose one morning, one midday, and one evening anchor.
2. Pair Mindify resets with those anchors.
3. Track streaks visually to reinforce them.',
  ARRAY['Habit stacks piggyback on existing neural pathways.', 'Short rituals compound when linked to anchors.', 'Visual streak tracking locks new habits faster.'],
  ARRAY['Define three anchors today with Mindify sessions attached.', 'Use the Daily Check-In to log habit wins.', 'Reevaluate stacks weekly and adjust anchors if necessary.'],
  '[{"id": "focus-activation", "type": "meditation", "title": "Focus Activation"}, {"id": "grounding-breath-1", "type": "meditation", "title": "1-Minute Grounding Breath"}]',
  8
)
ON CONFLICT (slug) DO NOTHING;
