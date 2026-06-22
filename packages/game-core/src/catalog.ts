import type {
  BuildingId,
  CitizenId,
  GoalCategory,
  GoalDifficulty,
  Resources,
} from './types'

export const STORAGE_KEY = 'dream-builder-save-v1'

export const GOAL_CATEGORIES: {
  id: GoalCategory
  label: string
  emoji: string
  resource: keyof Resources
}[] = [
  { id: 'learning', label: 'Learning', emoji: '📚', resource: 'knowledge' },
  { id: 'creativity', label: 'Creativity', emoji: '🎨', resource: 'creativity' },
  { id: 'wellness', label: 'Wellness', emoji: '🌿', resource: 'dreamEnergy' },
  { id: 'connection', label: 'Connection', emoji: '🤝', resource: 'influence' },
  { id: 'purpose', label: 'Purpose', emoji: '✨', resource: 'dreamEnergy' },
]

export const DIFFICULTY_REWARDS: Record<
  GoalDifficulty,
  Partial<Resources>
> = {
  easy: { dreamEnergy: 10, knowledge: 5, creativity: 5, influence: 5 },
  medium: { dreamEnergy: 25, knowledge: 10, creativity: 10, influence: 10 },
  hard: { dreamEnergy: 50, knowledge: 25, creativity: 25, influence: 25 },
}

export const STARTER_DREAMS = [
  'Learn Programming',
  'Improve Fitness',
  'Read More Books',
  'Become an Artist',
  'Build a Business',
]

export const BUILDING_CATALOG: Record<
  BuildingId,
  {
    name: string
    emoji: string
    description: string
    pillar: string
    cost: Partial<Resources>
    maxLevel: number
    unlockRequirement?: string
  }
> = {
  'dream-hall': {
    name: 'Dream Hall',
    emoji: '🏛',
    description: 'Heart of your civilization. Access goals and track progress.',
    pillar: 'Purpose',
    cost: {},
    maxLevel: 3,
  },
  library: {
    name: 'Library',
    emoji: '📖',
    description: 'Generates Knowledge and accelerates learning rewards.',
    pillar: 'Knowledge',
    cost: { dreamEnergy: 40, knowledge: 10 },
    maxLevel: 3,
    unlockRequirement: 'Complete your first learning goal',
  },
  workshop: {
    name: 'Workshop',
    emoji: '⚙️',
    description: 'Generates Innovation through building and making.',
    pillar: 'Knowledge',
    cost: { dreamEnergy: 50 },
    maxLevel: 3,
    unlockRequirement: 'Complete your first project goal',
  },
  'creative-studio': {
    name: 'Creative Studio',
    emoji: '🎨',
    description: 'Generates Creativity through art and expression.',
    pillar: 'Creativity',
    cost: { dreamEnergy: 45, creativity: 10 },
    maxLevel: 3,
    unlockRequirement: 'Complete your first creative goal',
  },
  'reflection-garden': {
    name: 'Reflection Garden',
    emoji: '🌳',
    description: 'Unlocks Reflection Mode and boosts citizen happiness.',
    pillar: 'Wellness',
    cost: { dreamEnergy: 35 },
    maxLevel: 3,
    unlockRequirement: 'Complete your first wellness goal',
  },
  'community-hall': {
    name: 'Community Hall',
    emoji: '🤝',
    description: 'Unlocks service quests and generates Influence.',
    pillar: 'Connection',
    cost: { dreamEnergy: 55, influence: 15 },
    maxLevel: 3,
    unlockRequirement: 'Reach 25 Influence',
  },
}

export const CITIZEN_CATALOG: Record<
  CitizenId,
  {
    name: string
    role: string
    emoji: string
    dream: string
    personality: string
    unlockHint: string
    quests: { id: string; title: string; reward: string }[]
  }
> = {
  orion: {
    name: 'Orion',
    role: 'Scholar',
    emoji: '📚',
    dream: 'Build a library where every dreamer can learn.',
    personality: 'Curious, patient, thoughtful',
    unlockHint: 'Complete your first goal',
    quests: [
      { id: 'orion-1', title: 'Complete a learning goal', reward: 'Knowledge bonus' },
      { id: 'orion-2', title: 'Build a Library', reward: 'Unlock Academy blueprint' },
      { id: 'orion-3', title: 'Reach 100 Knowledge', reward: 'Scholar achievement' },
    ],
  },
  atlas: {
    name: 'Atlas',
    role: 'Inventor',
    emoji: '⚙️',
    dream: 'Build machines that help society flourish.',
    personality: 'Determined, practical, inventive',
    unlockHint: 'Build a Workshop',
    quests: [
      { id: 'atlas-1', title: 'Complete a purpose goal', reward: 'Dream Energy bonus' },
      { id: 'atlas-2', title: 'Build a Workshop', reward: 'Engineering unlock' },
      { id: 'atlas-3', title: 'Upgrade any building to level 2', reward: 'Innovation path' },
    ],
  },
  lyra: {
    name: 'Lyra',
    role: 'Artist',
    emoji: '🎨',
    dream: 'Create art that inspires people to dream again.',
    personality: 'Imaginative, warm, expressive',
    unlockHint: 'Build a Creative Studio',
    quests: [
      { id: 'lyra-1', title: 'Complete a creative goal', reward: 'Creativity bonus' },
      { id: 'lyra-2', title: 'Build a Creative Studio', reward: 'Cultural unlock' },
      { id: 'lyra-3', title: 'Reach 100 Creativity', reward: 'Creator achievement' },
    ],
  },
  mira: {
    name: 'Mira',
    role: 'Healer',
    emoji: '🌿',
    dream: 'Help people live healthier, balanced lives.',
    personality: 'Gentle, wise, nurturing',
    unlockHint: 'Build a Reflection Garden',
    quests: [
      { id: 'mira-1', title: 'Complete a wellness goal', reward: 'Happiness boost' },
      { id: 'mira-2', title: 'Build a Reflection Garden', reward: 'Reflection Mode' },
      { id: 'mira-3', title: 'Keep all citizens above 70% happiness', reward: 'Wellness mastery' },
    ],
  },
}

export const WORLD_TREE_STAGES: {
  stage: import('./types').WorldTreeStage
  label: string
  requirement: string
}[] = [
  { stage: 'seed', label: 'Seed', requirement: 'Begin your journey' },
  { stage: 'sapling', label: 'Sapling', requirement: 'Complete 3 goals' },
  { stage: 'young', label: 'Young Tree', requirement: 'Complete 8 goals and build 3 buildings' },
  { stage: 'mature', label: 'Mature Tree', requirement: 'Finish Chapter 1' },
]

export const STORY_BEATS = [
  {
    chapter: 1,
    beat: 0,
    title: 'The First Spark',
    message:
      'The world was fractured when dreams were abandoned. You awaken on The Cradle with a glowing Dream Core.',
  },
  {
    chapter: 1,
    beat: 1,
    title: 'Astra Speaks',
    message:
      'The world was not destroyed by war. It was destroyed when people stopped believing their dreams mattered.',
  },
  {
    chapter: 1,
    beat: 2,
    title: 'Orion Arrives',
    message:
      "I've spent years searching for a place where dreams still grow. Your progress gives me hope.",
  },
  {
    chapter: 1,
    beat: 3,
    title: 'World Tree Awakens',
    message: 'The world changes when you do.',
  },
]
