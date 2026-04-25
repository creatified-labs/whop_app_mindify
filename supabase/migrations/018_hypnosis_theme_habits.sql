-- Add 'habits' to the allowed hypnosis themes.

ALTER TABLE hypnosis_sessions
  DROP CONSTRAINT IF EXISTS hypnosis_sessions_theme_check;

ALTER TABLE hypnosis_sessions
  ADD CONSTRAINT hypnosis_sessions_theme_check
  CHECK (theme IN (
    'procrastination',
    'overthinking',
    'confidence',
    'productivity',
    'smoking',
    'nervous-system',
    'performance',
    'habits'
  ));
