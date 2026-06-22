'use client'

import {
  BUILDING_CATALOG,
  CITIZEN_CATALOG,
  GOAL_CATEGORIES,
  WORLD_TREE_STAGES,
  canBuild,
  getActiveGoals,
  getCompletedGoals,
  getWelcomeMessage,
  sortJournal,
  summarizeJourney,
  type BuildingId,
  type GoalCategory,
  type GoalDifficulty,
} from '@dream-builder/game-core'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Button } from '@/components/button'
import { ResourceBar } from '@/components/game/resource-bar'
import { useGame } from '@/hooks/use-game'
import { cn } from '@/lib/utils'

type Tab = 'home' | 'goals' | 'island' | 'citizens' | 'reflection' | 'journal'

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: 'home', label: 'Home', emoji: '🏝' },
  { id: 'goals', label: 'Goals', emoji: '🎯' },
  { id: 'island', label: 'Build', emoji: '🏗' },
  { id: 'citizens', label: 'Citizens', emoji: '👥' },
  { id: 'reflection', label: 'Reflect', emoji: '🌙' },
  { id: 'journal', label: 'Journal', emoji: '📓' },
]

export function GameShell() {
  const { state, addGoal, markGoalComplete, constructBuilding, resetGame } = useGame()
  const [tab, setTab] = useState<Tab>('home')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GoalCategory>('learning')
  const [difficulty, setDifficulty] = useState<GoalDifficulty>('medium')

  const summary = useMemo(() => summarizeJourney(state), [state])
  const activeGoals = useMemo(() => getActiveGoals(state), [state])
  const completedGoals = useMemo(() => getCompletedGoals(state), [state])
  const journal = useMemo(() => sortJournal(state.journal), [state.journal])
  const treeStage = WORLD_TREE_STAGES.find((item) => item.stage === state.worldTreeStage)

  const createNewGoal = () => {
    if (!title.trim()) {
      return
    }
    addGoal({ title, description, category, difficulty })
    setTitle('')
    setDescription('')
    setTab('goals')
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{getWelcomeMessage(state)}</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {state.profile.civilizationName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Level {state.profile.level} · Dream Architect {state.profile.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link href="/" />} variant="outline">
            Landing
          </Button>
          <Button variant="outline" onClick={resetGame}>
            New game
          </Button>
        </div>
      </header>

      <ResourceBar resources={state.resources} />

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              tab === item.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'bg-card hover:bg-muted',
            )}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </nav>

      {tab === 'home' && (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="dream-sky rounded-2xl border p-6 shadow-sm">
            <p className="text-sm text-white/70">The Cradle Island</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              Your civilization grows with you
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {state.buildings.map((building) => {
                const meta = BUILDING_CATALOG[building.id]
                return (
                  <div
                    key={building.id}
                    className="rounded-xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm"
                  >
                    <p className="text-2xl">{meta.emoji}</p>
                    <p className="mt-2 font-medium">{meta.name}</p>
                    <p className="text-sm text-white/70">Level {building.level}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">World Tree</p>
              <p className="mt-1 text-4xl">🌳</p>
              <p className="mt-2 text-lg font-semibold">{treeStage?.label}</p>
              <p className="text-sm text-muted-foreground">{treeStage?.requirement}</p>
            </div>
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Journey summary</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>{summary.completedGoals} goals completed</li>
                <li>{summary.buildings} buildings on The Cradle</li>
                <li>{summary.unlockedCitizens} citizens met</li>
                <li>{summary.achievements} achievements earned</li>
              </ul>
            </div>
            {state.profile.firstDreamChosen && (
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">First dream</p>
                <p className="mt-1 font-medium">{state.profile.firstDreamChosen}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === 'goals' && (
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Create a real-life goal</h2>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-lg border bg-background px-3 py-2"
                placeholder="Goal title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <textarea
                className="min-h-24 w-full rounded-lg border bg-background px-3 py-2"
                placeholder="What will you do in the real world?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {GOAL_CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm',
                      category === item.id && 'border-primary bg-primary/10',
                    )}
                  >
                    {item.emoji} {item.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as GoalDifficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm capitalize',
                      difficulty === level && 'border-primary bg-primary/10',
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <Button onClick={createNewGoal}>Add to Dream Board</Button>
            </div>
          </div>

          <div className="space-y-4">
            <GoalList
              title="Active goals"
              empty="No active goals yet. Create one from real life."
              goals={activeGoals}
              onComplete={markGoalComplete}
            />
            <GoalList
              title="Completed goals"
              empty="Completed goals appear here with their rewards."
              goals={completedGoals}
            />
          </div>
        </section>
      )}

      {tab === 'island' && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(BUILDING_CATALOG) as BuildingId[]).map((buildingId) => {
            const meta = BUILDING_CATALOG[buildingId]
            const existing = state.buildings.find((building) => building.id === buildingId)
            const check = canBuild(state, buildingId)

            return (
              <div key={buildingId} className="rounded-2xl border bg-card p-5 shadow-sm">
                <p className="text-3xl">{meta.emoji}</p>
                <h3 className="mt-2 text-lg font-semibold">{meta.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Pillar: {meta.pillar}
                  {existing ? ` · Level ${existing.level}/${meta.maxLevel}` : ''}
                </p>
                {!check.ok && (
                  <p className="mt-3 text-sm text-muted-foreground">{check.reason}</p>
                )}
                <Button
                  className="mt-4 w-full"
                  disabled={!check.ok}
                  onClick={() => constructBuilding(buildingId)}
                >
                  {existing ? 'Upgrade' : 'Build'}
                </Button>
              </div>
            )
          })}
        </section>
      )}

      {tab === 'citizens' && (
        <section className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(CITIZEN_CATALOG) as import('@dream-builder/game-core').CitizenId[]).map(
            (citizenId) => {
              const meta = CITIZEN_CATALOG[citizenId]
              const citizen = state.citizens.find((item) => item.id === citizenId)

              return (
                <div key={citizenId} className="rounded-2xl border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-3xl">{meta.emoji}</p>
                      <h3 className="mt-2 text-lg font-semibold">{meta.name}</h3>
                      <p className="text-sm text-muted-foreground">{meta.role}</p>
                    </div>
                    <span className="rounded-full border px-3 py-1 text-xs">
                      {citizen?.unlocked ? 'Met' : 'Locked'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm">{meta.dream}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Happiness: {citizen?.happiness ?? 0}%
                  </p>
                  {!citizen?.unlocked && (
                    <p className="mt-2 text-sm text-muted-foreground">{meta.unlockHint}</p>
                  )}
                  <ul className="mt-4 space-y-2">
                    {meta.quests.map((quest) => {
                      const progress = citizen?.quests.find(
                        (item) => item.questId === quest.id,
                      )
                      return (
                        <li
                          key={quest.id}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm',
                            progress?.completed && 'border-primary/30 bg-primary/5',
                          )}
                        >
                          <p>{quest.title}</p>
                          <p className="text-xs text-muted-foreground">{quest.reward}</p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            },
          )}
        </section>
      )}

      {tab === 'reflection' && (
        <section className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <p className="text-4xl">🌙</p>
          <h2 className="mt-4 text-2xl font-semibold">Reflection Mode</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Walk through your growing civilization. No timers. No pressure. No
            failure. Just progress you can be proud of.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            <ReflectionCard label="Goals completed" value={summary.completedGoals} />
            <ReflectionCard label="Buildings" value={summary.buildings} />
            <ReflectionCard label="Achievements" value={summary.achievements} />
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            The civilization grew because you grew.
          </p>
        </section>
      )}

      {tab === 'journal' && (
        <section className="space-y-3">
          {journal.map((entry) => (
            <article key={entry.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium">{entry.title}</h3>
                <span className="text-xs text-muted-foreground capitalize">
                  {entry.type}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{entry.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

function GoalList({
  title,
  empty,
  goals,
  onComplete,
}: {
  title: string
  empty: string
  goals: import('@dream-builder/game-core').Goal[]
  onComplete?: (goalId: string) => void
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      {goals.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {goals.map((goal) => (
            <li key={goal.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{goal.title}</p>
                  {goal.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{goal.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground capitalize">
                    {goal.category} · {goal.difficulty}
                  </p>
                </div>
                {onComplete && (
                  <Button size="sm" onClick={() => onComplete(goal.id)}>
                    Complete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ReflectionCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border px-4 py-5">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
