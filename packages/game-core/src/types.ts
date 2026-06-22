export type GoalCategory =
  | 'learning'
  | 'creativity'
  | 'wellness'
  | 'connection'
  | 'purpose'

export type GoalDifficulty = 'easy' | 'medium' | 'hard'

export type GoalStatus = 'active' | 'completed'

export type BuildingId =
  | 'dream-hall'
  | 'library'
  | 'workshop'
  | 'creative-studio'
  | 'reflection-garden'
  | 'community-hall'

export type CitizenId = 'orion' | 'atlas' | 'lyra' | 'mira'

export type WorldTreeStage = 'seed' | 'sapling' | 'young' | 'mature'

export type GameScreen =
  | 'onboarding'
  | 'home'
  | 'goals'
  | 'island'
  | 'buildings'
  | 'citizens'
  | 'reflection'
  | 'journal'

export type Resources = {
  dreamEnergy: number
  knowledge: number
  creativity: number
  influence: number
}

export type Goal = {
  id: string
  title: string
  description: string
  category: GoalCategory
  difficulty: GoalDifficulty
  reward: Partial<Resources>
  status: GoalStatus
  createdAt: string
  completedAt?: string
}

export type Building = {
  id: BuildingId
  level: number
  builtAt: string
}

export type QuestProgress = {
  questId: string
  completed: boolean
}

export type Citizen = {
  id: CitizenId
  unlocked: boolean
  happiness: number
  quests: QuestProgress[]
}

export type JournalEntry = {
  id: string
  type: 'goal' | 'building' | 'citizen' | 'milestone' | 'story'
  title: string
  body: string
  createdAt: string
}

export type AchievementId =
  | 'first-step'
  | 'builder'
  | 'scholar'
  | 'creator'
  | 'architect'

export type PlayerProfile = {
  name: string
  civilizationName: string
  level: number
  experience: number
  onboardingComplete: boolean
  firstDreamChosen?: string
  districtChoice?: 'knowledge' | 'engineering' | 'creativity' | 'wellness'
}

export type GameState = {
  version: 1
  profile: PlayerProfile
  resources: Resources
  goals: Goal[]
  buildings: Building[]
  citizens: Citizen[]
  worldTreeStage: WorldTreeStage
  achievements: AchievementId[]
  journal: JournalEntry[]
  storyChapter: number
  storyBeat: number
  lastPlayedAt: string
  streakDays: number
}
