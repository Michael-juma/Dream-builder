import {
  BUILDING_CATALOG,
  CITIZEN_CATALOG,
  DIFFICULTY_REWARDS,
  GOAL_CATEGORIES,
} from './catalog'
import type {
  AchievementId,
  BuildingId,
  CitizenId,
  GameState,
  Goal,
  GoalCategory,
  GoalDifficulty,
  JournalEntry,
  PlayerProfile,
  Resources,
  WorldTreeStage,
} from './types'

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function addResources(base: Resources, delta: Partial<Resources>): Resources {
  return {
    dreamEnergy: base.dreamEnergy + (delta.dreamEnergy ?? 0),
    knowledge: base.knowledge + (delta.knowledge ?? 0),
    creativity: base.creativity + (delta.creativity ?? 0),
    influence: base.influence + (delta.influence ?? 0),
  }
}

function canAfford(resources: Resources, cost: Partial<Resources>) {
  return (
    resources.dreamEnergy >= (cost.dreamEnergy ?? 0) &&
    resources.knowledge >= (cost.knowledge ?? 0) &&
    resources.creativity >= (cost.creativity ?? 0) &&
    resources.influence >= (cost.influence ?? 0)
  )
}

function spendResources(resources: Resources, cost: Partial<Resources>): Resources {
  return {
    dreamEnergy: resources.dreamEnergy - (cost.dreamEnergy ?? 0),
    knowledge: resources.knowledge - (cost.knowledge ?? 0),
    creativity: resources.creativity - (cost.creativity ?? 0),
    influence: resources.influence - (cost.influence ?? 0),
  }
}

function createCitizens(): GameState['citizens'] {
  return (Object.keys(CITIZEN_CATALOG) as CitizenId[]).map((id) => ({
    id,
    unlocked: id === 'orion' ? false : false,
    happiness: 60,
    quests: CITIZEN_CATALOG[id].quests.map((quest) => ({
      questId: quest.id,
      completed: false,
    })),
  }))
}

export function createInitialState(): GameState {
  const now = new Date().toISOString()
  return {
    version: 1,
    profile: {
      name: '',
      civilizationName: '',
      level: 1,
      experience: 0,
      onboardingComplete: false,
    },
    resources: {
      dreamEnergy: 0,
      knowledge: 0,
      creativity: 0,
      influence: 0,
    },
    goals: [],
    buildings: [
      {
        id: 'dream-hall',
        level: 1,
        builtAt: now,
      },
    ],
    citizens: createCitizens(),
    worldTreeStage: 'seed',
    achievements: [],
    journal: [
      {
        id: uid('journal'),
        type: 'story',
        title: 'The First Spark',
        body: 'The world was fractured when dreams were abandoned. Your Dream Core awaits on The Cradle.',
        createdAt: now,
      },
    ],
    storyChapter: 1,
    storyBeat: 0,
    lastPlayedAt: now,
    streakDays: 1,
  }
}

export function completeOnboarding(
  state: GameState,
  input: {
    name: string
    civilizationName: string
    firstDream: string
    district: PlayerProfile['districtChoice']
  },
): GameState {
  const now = new Date().toISOString()
  return {
    ...state,
    profile: {
      ...state.profile,
      name: input.name.trim(),
      civilizationName: input.civilizationName.trim(),
      firstDreamChosen: input.firstDream,
      districtChoice: input.district,
      onboardingComplete: true,
    },
    journal: [
      ...state.journal,
      {
        id: uid('journal'),
        type: 'milestone',
        title: 'Dream Architect Awakens',
        body: `${input.name} chose "${input.firstDream}" as their first dream on The Cradle.`,
        createdAt: now,
      },
    ],
    lastPlayedAt: now,
  }
}

export function createGoal(
  state: GameState,
  input: {
    title: string
    description: string
    category: GoalCategory
    difficulty: GoalDifficulty
  },
): GameState {
  const reward = { ...DIFFICULTY_REWARDS[input.difficulty] }
  const goal: Goal = {
    id: uid('goal'),
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    difficulty: input.difficulty,
    reward,
    status: 'active',
    createdAt: new Date().toISOString(),
  }

  return {
    ...state,
    goals: [goal, ...state.goals],
  }
}

function grantAchievement(state: GameState, id: AchievementId): GameState {
  if (state.achievements.includes(id)) {
    return state
  }
  return {
    ...state,
    achievements: [...state.achievements, id],
    journal: [
      ...state.journal,
      {
        id: uid('journal'),
        type: 'milestone',
        title: `Achievement unlocked: ${id}`,
        body: 'Your civilization celebrates this milestone.',
        createdAt: new Date().toISOString(),
      },
    ],
  }
}

function updateWorldTree(state: GameState): WorldTreeStage {
  const completedGoals = state.goals.filter((goal) => goal.status === 'completed').length
  const builtCount = state.buildings.length

  if (state.storyBeat >= 3) {
    return 'mature'
  }
  if (completedGoals >= 8 && builtCount >= 3) {
    return 'young'
  }
  if (completedGoals >= 3) {
    return 'sapling'
  }
  return 'seed'
}

function updateCitizenQuests(state: GameState): GameState['citizens'] {
  const completedGoals = state.goals.filter((goal) => goal.status === 'completed')
  const hasLearning = completedGoals.some((goal) => goal.category === 'learning')
  const hasCreative = completedGoals.some((goal) => goal.category === 'creativity')
  const hasWellness = completedGoals.some((goal) => goal.category === 'wellness')
  const hasPurpose = completedGoals.some((goal) => goal.category === 'purpose')
  const hasLibrary = state.buildings.some((building) => building.id === 'library')
  const hasWorkshop = state.buildings.some((building) => building.id === 'workshop')
  const hasStudio = state.buildings.some((building) => building.id === 'creative-studio')
  const hasGarden = state.buildings.some((building) => building.id === 'reflection-garden')
  const upgraded = state.buildings.some((building) => building.level >= 2)

  return state.citizens.map((citizen) => {
    const quests = citizen.quests.map((quest) => {
      if (quest.completed) {
        return quest
      }

      let completed = false
      switch (quest.questId) {
        case 'orion-1':
          completed = hasLearning
          break
        case 'orion-2':
          completed = hasLibrary
          break
        case 'orion-3':
          completed = state.resources.knowledge >= 100
          break
        case 'atlas-1':
          completed = hasPurpose
          break
        case 'atlas-2':
          completed = hasWorkshop
          break
        case 'atlas-3':
          completed = upgraded
          break
        case 'lyra-1':
          completed = hasCreative
          break
        case 'lyra-2':
          completed = hasStudio
          break
        case 'lyra-3':
          completed = state.resources.creativity >= 100
          break
        case 'mira-1':
          completed = hasWellness
          break
        case 'mira-2':
          completed = hasGarden
          break
        case 'mira-3':
          completed = state.citizens.every((c) => c.happiness >= 70)
          break
      }

      return { ...quest, completed }
    })

    return { ...citizen, quests }
  })
}

function unlockCitizens(state: GameState): GameState['citizens'] {
  const completedCount = state.goals.filter((goal) => goal.status === 'completed').length
  const hasWorkshop = state.buildings.some((building) => building.id === 'workshop')
  const hasStudio = state.buildings.some((building) => building.id === 'creative-studio')
  const hasGarden = state.buildings.some((building) => building.id === 'reflection-garden')

  return state.citizens.map((citizen) => {
    let unlocked = citizen.unlocked
    if (citizen.id === 'orion' && completedCount >= 1) {
      unlocked = true
    }
    if (citizen.id === 'atlas' && hasWorkshop) {
      unlocked = true
    }
    if (citizen.id === 'lyra' && hasStudio) {
      unlocked = true
    }
    if (citizen.id === 'mira' && hasGarden) {
      unlocked = true
    }
    return { ...citizen, unlocked }
  })
}

function bumpHappiness(state: GameState): GameState['citizens'] {
  const hasGarden = state.buildings.some((building) => building.id === 'reflection-garden')
  const boost = hasGarden ? 5 : 2

  return state.citizens.map((citizen) => ({
    ...citizen,
    happiness: citizen.unlocked
      ? Math.min(100, citizen.happiness + boost)
      : citizen.happiness,
  }))
}

export function completeGoal(state: GameState, goalId: string): GameState {
  const goal = state.goals.find((item) => item.id === goalId)
  if (!goal || goal.status === 'completed') {
    return state
  }

  const now = new Date().toISOString()
  let next: GameState = {
    ...state,
    goals: state.goals.map((item) =>
      item.id === goalId
        ? { ...item, status: 'completed' as const, completedAt: now }
        : item,
    ),
    resources: addResources(state.resources, goal.reward),
    profile: {
      ...state.profile,
      experience: state.profile.experience + 20,
      level: Math.floor((state.profile.experience + 20) / 100) + 1,
    },
    journal: [
      ...state.journal,
      {
        id: uid('journal'),
        type: 'goal',
        title: `Goal completed: ${goal.title}`,
        body: `Earned ${goal.reward.dreamEnergy ?? 0} Dream Energy and pillar resources.`,
        createdAt: now,
      },
    ],
    lastPlayedAt: now,
  }

  next = grantAchievement(next, 'first-step')
  if (next.resources.knowledge >= 100) {
    next = grantAchievement(next, 'scholar')
  }
  if (next.resources.creativity >= 100) {
    next = grantAchievement(next, 'creator')
  }

  const completedCount = next.goals.filter((item) => item.status === 'completed').length
  if (completedCount === 1) {
    next = {
      ...next,
      storyBeat: Math.max(next.storyBeat, 2),
      journal: [
        ...next.journal,
        {
          id: uid('journal'),
          type: 'citizen',
          title: 'Orion arrives',
          body: CITIZEN_CATALOG.orion.dream,
          createdAt: now,
        },
      ],
    }
  }

  let updated: GameState = {
    ...next,
    citizens: updateCitizenQuests(next),
  }
  updated = {
    ...updated,
    citizens: unlockCitizens(updated),
  }
  updated = {
    ...updated,
    citizens: bumpHappiness(updated),
  }

  next = {
    ...updated,
    worldTreeStage: updateWorldTree(updated),
  }

  if (
    next.buildings.length >= 4 &&
    completedCount >= 5 &&
    next.storyBeat < 3
  ) {
    next = {
      ...next,
      storyBeat: 3,
      journal: [
        ...next.journal,
        {
          id: uid('journal'),
          type: 'story',
          title: 'World Tree Awakens',
          body: 'The world changes when you do.',
          createdAt: now,
        },
      ],
    }
    next = { ...next, worldTreeStage: updateWorldTree(next) }
  }

  return next
}

export function canBuild(state: GameState, buildingId: BuildingId): {
  ok: boolean
  reason?: string
} {
  const catalog = BUILDING_CATALOG[buildingId]
  const existing = state.buildings.find((building) => building.id === buildingId)

  if (existing && existing.level >= catalog.maxLevel) {
    return { ok: false, reason: 'Building is at max level' }
  }

  const cost = existing
    ? {
        dreamEnergy: (catalog.cost.dreamEnergy ?? 20) * existing.level,
        knowledge: (catalog.cost.knowledge ?? 0) * existing.level,
        creativity: (catalog.cost.creativity ?? 0) * existing.level,
        influence: (catalog.cost.influence ?? 0) * existing.level,
      }
    : catalog.cost

  if (!canAfford(state.resources, cost)) {
    return { ok: false, reason: 'Not enough resources' }
  }

  if (buildingId === 'library') {
    const hasLearning = state.goals.some(
      (goal) => goal.category === 'learning' && goal.status === 'completed',
    )
    if (!hasLearning) {
      return { ok: false, reason: catalog.unlockRequirement }
    }
  }

  if (buildingId === 'workshop') {
    const hasProject = state.goals.some(
      (goal) =>
        (goal.category === 'purpose' || goal.category === 'learning') &&
        goal.status === 'completed',
    )
    if (!hasProject) {
      return { ok: false, reason: catalog.unlockRequirement }
    }
  }

  if (buildingId === 'creative-studio') {
    const hasCreative = state.goals.some(
      (goal) => goal.category === 'creativity' && goal.status === 'completed',
    )
    if (!hasCreative) {
      return { ok: false, reason: catalog.unlockRequirement }
    }
  }

  if (buildingId === 'reflection-garden') {
    const hasWellness = state.goals.some(
      (goal) => goal.category === 'wellness' && goal.status === 'completed',
    )
    if (!hasWellness) {
      return { ok: false, reason: catalog.unlockRequirement }
    }
  }

  if (buildingId === 'community-hall' && state.resources.influence < 25) {
    return { ok: false, reason: catalog.unlockRequirement }
  }

  return { ok: true }
}

export function buildStructure(state: GameState, buildingId: BuildingId): GameState {
  const check = canBuild(state, buildingId)
  if (!check.ok) {
    return state
  }

  const catalog = BUILDING_CATALOG[buildingId]
  const existing = state.buildings.find((building) => building.id === buildingId)
  const cost = existing
    ? {
        dreamEnergy: (catalog.cost.dreamEnergy ?? 20) * existing.level,
        knowledge: (catalog.cost.knowledge ?? 0) * existing.level,
        creativity: (catalog.cost.creativity ?? 0) * existing.level,
        influence: (catalog.cost.influence ?? 0) * existing.level,
      }
    : catalog.cost

  const now = new Date().toISOString()
  const buildings = existing
    ? state.buildings.map((building) =>
        building.id === buildingId
          ? { ...building, level: building.level + 1 }
          : building,
      )
    : [...state.buildings, { id: buildingId, level: 1, builtAt: now }]

  let next: GameState = {
    ...state,
    resources: spendResources(state.resources, cost),
    buildings,
    journal: [
      ...state.journal,
      {
        id: uid('journal'),
        type: 'building',
        title: existing
          ? `${catalog.name} upgraded to level ${existing.level + 1}`
          : `${catalog.name} constructed`,
        body: catalog.description,
        createdAt: now,
      },
    ],
    lastPlayedAt: now,
  }

  if (!existing) {
    next = grantAchievement(next, 'builder')
  }

  const mvpBuildings: BuildingId[] = [
    'dream-hall',
    'library',
    'workshop',
    'creative-studio',
    'reflection-garden',
    'community-hall',
  ]
  if (mvpBuildings.every((id) => next.buildings.some((building) => building.id === id))) {
    next = grantAchievement(next, 'architect')
  }

  let updated: GameState = {
    ...next,
    citizens: updateCitizenQuests(next),
  }
  updated = {
    ...updated,
    citizens: unlockCitizens(updated),
  }
  updated = {
    ...updated,
    citizens: bumpHappiness(updated),
  }

  return {
    ...updated,
    worldTreeStage: updateWorldTree(updated),
  }
}

export function getWelcomeMessage(state: GameState) {
  if (!state.profile.onboardingComplete) {
    return 'Welcome, Dream Architect.'
  }
  return `Welcome back, ${state.profile.name}.`
}

export function getCompletedGoalCount(state: GameState) {
  return state.goals.filter((goal) => goal.status === 'completed').length
}

export function getActiveGoals(state: GameState) {
  return state.goals.filter((goal) => goal.status === 'active')
}

export function getCompletedGoals(state: GameState) {
  return state.goals.filter((goal) => goal.status === 'completed')
}

export function getCategoryMeta(category: GoalCategory) {
  return GOAL_CATEGORIES.find((item) => item.id === category)!
}

export function summarizeJourney(state: GameState) {
  const completedGoals = getCompletedGoalCount(state)
  const unlockedCitizens = state.citizens.filter((citizen) => citizen.unlocked).length

  return {
    completedGoals,
    buildings: state.buildings.length,
    unlockedCitizens,
    level: state.profile.level,
    worldTreeStage: state.worldTreeStage,
    achievements: state.achievements.length,
  }
}

export function parseGameState(raw: unknown): GameState {
  if (!raw || typeof raw !== 'object') {
    return createInitialState()
  }

  const candidate = raw as GameState
  if (candidate.version !== 1 || !candidate.profile) {
    return createInitialState()
  }

  return candidate
}

export function sortJournal(entries: JournalEntry[]) {
  return [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
