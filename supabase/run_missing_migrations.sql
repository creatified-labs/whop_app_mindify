-- =============================================================================
-- Combined migrations 003-006: Content tables, RLS, seed data, audio storage
-- Safe to run even if parts already exist (uses IF NOT EXISTS / ON CONFLICT)
-- =============================================================================

-- =====================================================================
-- 003: CONTENT TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS meditations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    category TEXT NOT NULL CHECK (category IN ('focus', 'morning', 'evening', 'sleep', 'stress', 'overwhelm', 'productivity', 'emotional')),
    audio_url TEXT NOT NULL,
    image_url TEXT NOT NULL DEFAULT '',
    mood TEXT[] DEFAULT '{}',
    is_new BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meditations_category ON meditations(category);
CREATE INDEX IF NOT EXISTS idx_meditations_sort_order ON meditations(sort_order);

CREATE TABLE IF NOT EXISTS hypnosis_sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    theme TEXT NOT NULL CHECK (theme IN ('procrastination', 'overthinking', 'confidence', 'productivity', 'smoking', 'nervous-system', 'performance')),
    audio_url TEXT NOT NULL,
    has_binaural BOOLEAN DEFAULT false,
    daytime_version TEXT,
    nighttime_version TEXT,
    is_premium BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hypnosis_theme ON hypnosis_sessions(theme);
CREATE INDEX IF NOT EXISTS idx_hypnosis_sort_order ON hypnosis_sessions(sort_order);

CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    category TEXT NOT NULL CHECK (category IN ('focus', 'productivity', 'sleep', 'mindset', 'clarity')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    cover_image TEXT NOT NULL DEFAULT '',
    include_summary JSONB NOT NULL DEFAULT '{"meditations": 0, "tasks": 0, "journalPrompts": 0}',
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    time_commitment TEXT NOT NULL DEFAULT '',
    recommended_for TEXT[] DEFAULT '{}',
    days JSONB NOT NULL DEFAULT '[]',
    is_premium BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_difficulty ON programs(difficulty);
CREATE INDEX IF NOT EXISTS idx_programs_sort_order ON programs(sort_order);

CREATE TABLE IF NOT EXISTS quick_resets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    type TEXT NOT NULL CHECK (type IN ('breath', 'anxiety', 'focus', 'calm', 'pattern-interrupt')),
    audio_url TEXT NOT NULL,
    instructions TEXT NOT NULL DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quick_resets_type ON quick_resets(type);
CREATE INDEX IF NOT EXISTS idx_quick_resets_sort_order ON quick_resets(sort_order);

CREATE TABLE IF NOT EXISTS knowledge_articles (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('neuroscience', 'psychology', 'breathwork', 'sleep', 'focus', 'productivity')),
    author TEXT NOT NULL DEFAULT '',
    read_time_minutes INTEGER NOT NULL DEFAULT 5,
    thumbnail TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    key_takeaways TEXT[] DEFAULT '{}',
    action_steps TEXT[] DEFAULT '{}',
    recommended_sessions JSONB DEFAULT '[]',
    references TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON knowledge_articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_sort_order ON knowledge_articles(sort_order);

-- Triggers (reuses update_updated_at_column from 001)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_meditations_updated_at') THEN
    CREATE TRIGGER update_meditations_updated_at BEFORE UPDATE ON meditations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_hypnosis_sessions_updated_at') THEN
    CREATE TRIGGER update_hypnosis_sessions_updated_at BEFORE UPDATE ON hypnosis_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_programs_updated_at') THEN
    CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_quick_resets_updated_at') THEN
    CREATE TRIGGER update_quick_resets_updated_at BEFORE UPDATE ON quick_resets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_knowledge_articles_updated_at') THEN
    CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================================================================
-- 004: ROW LEVEL SECURITY FOR CONTENT TABLES
-- =====================================================================

ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hypnosis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view meditations') THEN
    CREATE POLICY "Anyone can view meditations" ON meditations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view hypnosis sessions') THEN
    CREATE POLICY "Anyone can view hypnosis sessions" ON hypnosis_sessions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view programs') THEN
    CREATE POLICY "Anyone can view programs" ON programs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view quick resets') THEN
    CREATE POLICY "Anyone can view quick resets" ON quick_resets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view knowledge articles') THEN
    CREATE POLICY "Anyone can view knowledge articles" ON knowledge_articles FOR SELECT USING (true);
  END IF;
END $$;

-- =====================================================================
-- 005: SEED CONTENT DATA
-- =====================================================================

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

INSERT INTO hypnosis_sessions (id, title, description, duration, theme, audio_url, has_binaural, daytime_version, nighttime_version, is_premium, sort_order) VALUES
('procrastination-rewire', 'End Procrastination: Neural Pathway Rewiring', 'Guided induction that reframes delayed gratification and installs decisive action loops.', 24, 'procrastination', '/audio/hypnosis-procrastination.mp3', true, '/audio/hypnosis-procrastination-day.mp3', '/audio/hypnosis-procrastination-night.mp3', false, 1),
('overthinking-reset', 'Stop Overthinking: Subconscious Pattern Reset', 'Somatic scanning plus subconscious reparenting to dissolve repetitive cognitive loops.', 28, 'overthinking', '/audio/hypnosis-overthinking.mp3', true, '/audio/hypnosis-overthinking-day.mp3', '/audio/hypnosis-overthinking-night.mp3', false, 2),
('deep-confidence', 'Deep Confidence: Inner Belief Installation', 'Future pacing and embodied visualization to anchor unwavering confidence.', 22, 'confidence', '/audio/hypnosis-confidence.mp3', true, '/audio/hypnosis-confidence-day.mp3', '/audio/hypnosis-confidence-night.mp3', false, 3),
('productivity-conditioning', 'Productivity Conditioning: Peak Performance State', 'Anchor flow triggers and neural priming to sustain peak output windows.', 26, 'productivity', '/audio/hypnosis-productivity.mp3', false, '/audio/hypnosis-productivity-day.mp3', '/audio/hypnosis-productivity-night.mp3', false, 4),
('quit-smoking', 'Quit Smoking: Addiction Pattern Disruption', 'Rewire reward pathways and create aversion responses to nicotine cravings. Premium access required.', 30, 'smoking', '/audio/hypnosis-smoking.mp3', true, '/audio/hypnosis-smoking-day.mp3', '/audio/hypnosis-smoking-night.mp3', true, 5),
('calm-nervous-system', 'Calm Nervous System: Vagal Tone Activation', 'Polyvagal-informed induction to regulate heart rate variability and widen your window of tolerance.', 18, 'nervous-system', '/audio/hypnosis-vagal.mp3', true, '/audio/hypnosis-vagal-day.mp3', '/audio/hypnosis-vagal-night.mp3', false, 6),
('high-performance-mindset', 'High Performance Mindset: Winner''s Psychology', 'Stack embodied affirmations with mental rehearsal to cultivate an elite, calm intensity.', 25, 'performance', '/audio/hypnosis-performance.mp3', false, '/audio/hypnosis-performance-day.mp3', '/audio/hypnosis-performance-night.mp3', false, 7)
ON CONFLICT (id) DO NOTHING;

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

INSERT INTO quick_resets (id, title, duration, type, audio_url, instructions, sort_order) VALUES
('grounding-breath-1', '1-Minute Grounding Breath', 1, 'breath', '/audio/quick-resets/grounding-breath.mp3', 'Follow the 4-2-6 tactical breathing cadence with nasal inhale, brief hold, extended exhale.', 1),
('anxiety-switch-2', '2-Minute Anxiety Switch-Off', 2, 'anxiety', '/audio/quick-resets/anxiety-switch.mp3', 'Layer bilateral tapping with whispered cues to downshift adrenaline spikes.', 2),
('focus-primer-3', '3-Minute Focus Primer', 3, 'focus', '/audio/quick-resets/focus-primer.mp3', 'Use rhythmic breath holds to prime prefrontal activation before deep work.', 3),
('calm-downshift', 'Instant Calm Downshift', 2, 'calm', '/audio/quick-resets/calm-downshift.mp3', 'Pulse vagal toning hums with shoulder drops for immediate tension release.', 4),
('pattern-interrupt', 'Pattern Interrupt Audio', 2, 'pattern-interrupt', '/audio/quick-resets/pattern-interrupt.mp3', 'Layer sharp sonic cues with guided visualization to shock looping thoughts.', 5)
ON CONFLICT (id) DO NOTHING;

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
4. **Micro Choice:** ask "What is the next reversible step?" - reclaims agency.',
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

_Understand attentional spotlight theory, dopamine gating, and how to architect deep work windows._',
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

_Calibrate circadian cues, body temperature, and light hygiene for restorative nights._',
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

_Learn how dopamine prediction errors drive motivation and how to architect rewarding workflows._',
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

_Blend Joe Dispenza''s visualization rituals with peer-reviewed neuroplasticity science._',
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

_Use breath ratios to tune vagal tone, improve HRV, and unlock calm intensity._',
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

_Harness the DMN by toggling between introspection and task mode intentionally._',
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

_Link existing rituals with new mental training to hardwire resilience._',
  ARRAY['Habit stacks piggyback on existing neural pathways.', 'Short rituals compound when linked to anchors.', 'Visual streak tracking locks new habits faster.'],
  ARRAY['Define three anchors today with Mindify sessions attached.', 'Use the Daily Check-In to log habit wins.', 'Reevaluate stacks weekly and adjust anchors if necessary.'],
  '[{"id": "focus-activation", "type": "meditation", "title": "Focus Activation"}, {"id": "grounding-breath-1", "type": "meditation", "title": "1-Minute Grounding Breath"}]',
  8
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- 006: AUDIO STORAGE BUCKET
-- =====================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  true,
  104857600,
  ARRAY[
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/ogg',
    'audio/webm',
    'audio/aac'
  ]
)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for audio' AND tablename = 'objects') THEN
    CREATE POLICY "Public read access for audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role upload for audio' AND tablename = 'objects') THEN
    CREATE POLICY "Service role upload for audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role delete for audio' AND tablename = 'objects') THEN
    CREATE POLICY "Service role delete for audio" ON storage.objects FOR DELETE USING (bucket_id = 'audio');
  END IF;
END $$;
