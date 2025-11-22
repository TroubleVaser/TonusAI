import { EmotionType } from './types';

export const EMOTION_COLORS: Record<EmotionType, string> = {
  [EmotionType.ANGER]: '#E53E3E',
  [EmotionType.JOY]: '#F6E05E',
  [EmotionType.SAD]: '#2B6CB0',
  [EmotionType.FEAR]: '#6B46C1',
  [EmotionType.DISGUST]: '#38A169',
  [EmotionType.EMBARRASSMENT]: '#ED64A6',
  [EmotionType.ANXIETY]: '#DD6B20',
  [EmotionType.ENNUI]: '#4C51BF',
  [EmotionType.ENVY]: '#7FDBDA',
  [EmotionType.NEUTRAL]: '#A0AEC0',
  [EmotionType.SARCASM]: '#8B5E3C',
  [EmotionType.BURNOUT]: '#F6AD55',
  [EmotionType.CRASHOUT]: '#FF0033',
};

export const DEFAULT_SETTINGS = {
  micSensitivity: 1.0,
  highContrast: false,
  reducedMotion: false,
  theme: 'light' as const,
};

export const MOCK_HISTORY_DAYS = 14;

export const TASK_POOL = [
  "Take 3 deep, slow breaths",
  "Name 5 things you can see",
  "Stretch your neck and shoulders",
  "Drink a glass of water",
  "Write down one thing you're grateful for",
  "Listen to your favorite song",
  "Step outside for fresh air",
  "Compliment yourself",
  "Do a quick body scan meditation",
  "Unclench your jaw",
  "Roll your eyes in circles",
  "Text a friend just to say hi",
  "Clear your physical desktop",
  "Focus on a distant object for 20s",
  "Doodle on a piece of paper",
  "Sit in silence for 1 minute",
  "Rub your palms together firmly",
  "Look at a picture of nature",
  "Think of a happy memory",
  "Wiggle your toes for 10 seconds"
];

export const MOCK_TRANSCRIPTS_BY_EMOTION: Record<string, string[]> = {
  [EmotionType.JOY]: [
    "I felt really energetic this morning, got a lot done.",
    "That movie was hilarious, haven't laughed that hard in ages.",
    "Wow, I can't believe I actually won that contest!",
    "Had a lovely walk in the park, the birds were singing.",
    "So excited for the trip next weekend!",
    "Feeling grateful for my supportive family.",
    "I managed to fix the leak, feeling pretty proud."
  ],
  [EmotionType.ANGER]: [
    "Honestly, the traffic was a nightmare and I lost my cool.",
    "My boss was so rude today, I was fuming.",
    "I can't handle this level of incompetence anymore.",
    "I'm literally going to explode if this keeps happening!",
    "Why does everything have to be so complicated?",
    "They just cut me off in traffic, unbelievable."
  ],
  [EmotionType.SAD]: [
    "My friend cancelled on me, feeling a bit bummed out.",
    "Just feeling a bit under the weather and sad.",
    "I don't know, just feeling kind of empty today.",
    "I wish I had what they have, it's not fair.",
    "Missing my family a lot right now."
  ],
  [EmotionType.FEAR]: [
    "Saw a spider in the bath, absolutely terrified me.",
    "I'm so anxious about the presentation tomorrow.",
    "I heard a noise downstairs and froze."
  ],
  [EmotionType.ANXIETY]: [
    "Work is just piling up, I'm completely drained.",
    "Everything is just too loud and overwhelming right now.",
    "I'm so anxious about the presentation tomorrow.",
    "My heart is racing for no reason."
  ],
  [EmotionType.DISGUST]: [
    "The food at that new place was gross, never going back.",
    "The smell in the subway was absolutely revolting."
  ],
  [EmotionType.NEUTRAL]: [
    "Just a quiet day reading, felt pretty peaceful.",
    "Nothing really happened, just a standard day.",
    "Just doing some chores around the house.",
    "Went grocery shopping, pretty uneventful."
  ],
  [EmotionType.BURNOUT]: [
     "Work is just piling up, I'm completely drained.",
     "I just want to sleep for a week.",
     "I have zero energy to do anything."
  ],
  [EmotionType.CRASHOUT]: [
    "I'm done! I'm absolutely done with everything!",
    "This is complete garbage!",
    "I can't take it anymore!"
  ],
  [EmotionType.ENNUI]: [
    "Whatever, I don't really care.",
    "So bored, scrolling for hours.",
    "Everything feels so dull today."
  ],
  [EmotionType.EMBARRASSMENT]: [
    "I tripped in front of everyone, so embarrassing.",
    "I said the wrong thing and wanted to disappear."
  ],
  [EmotionType.ENVY]: [
    "They got the promotion and I didn't.",
    "Must be nice to have that kind of money."
  ],
  [EmotionType.SARCASM]: [
    "Oh great, another meeting that could have been an email.",
    "Yeah, because that's exactly what I needed today."
  ]
};

export const BADGES = [
  { id: 'streak_7', icon: '🔥', label: '7 Day Streak', desc: 'Consistent checking in' },
  { id: 'calm_master', icon: '🧘', label: 'Zen Master', desc: '100 minutes of calm' },
  { id: 'emotional_intelligence', icon: '🧠', label: 'EQ Pro', desc: 'Logged 10 different emotions' },
  { id: 'early_bird', icon: '🌅', label: 'Early Bird', desc: 'Logged before 8am' }
];