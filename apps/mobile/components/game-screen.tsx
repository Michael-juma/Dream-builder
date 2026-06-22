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
  type CitizenId,
  type GoalCategory,
  type GoalDifficulty,
} from '@dream-builder/game-core'
import { useMemo, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { useGame } from '../hooks/use-game'

type Tab = 'home' | 'goals' | 'build' | 'citizens' | 'journal'

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'goals', label: 'Goals' },
  { id: 'build', label: 'Build' },
  { id: 'citizens', label: 'Citizens' },
  { id: 'journal', label: 'Journal' },
]

export function GameScreen() {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>{getWelcomeMessage(state)}</Text>
        <Text style={styles.title}>{state.profile.civilizationName}</Text>
        <Text style={styles.subtitle}>
          Level {state.profile.level} · {state.profile.name}
        </Text>
        <Pressable style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>New game</Text>
        </Pressable>
      </View>

      <View style={styles.resourceRow}>
        <Resource label="Energy" value={state.resources.dreamEnergy} />
        <Resource label="Knowledge" value={state.resources.knowledge} />
        <Resource label="Creativity" value={state.resources.creativity} />
        <Resource label="Influence" value={state.resources.influence} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {tabs.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.tab, tab === item.id && styles.tabActive]}
            onPress={() => setTab(item.id)}
          >
            <Text style={[styles.tabText, tab === item.id && styles.tabTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {tab === 'home' && (
        <View style={styles.section}>
          <View style={styles.skyCard}>
            <Text style={styles.skyTitle}>The Cradle Island</Text>
            <Text style={styles.skyBody}>Your civilization grows with you.</Text>
            {state.buildings.map((building) => {
              const meta = BUILDING_CATALOG[building.id]
              return (
                <Text key={building.id} style={styles.buildingLine}>
                  {meta.emoji} {meta.name} · Lv {building.level}
                </Text>
              )
            })}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>World Tree · {treeStage?.label}</Text>
            <Text style={styles.cardBody}>{treeStage?.requirement}</Text>
            <Text style={styles.cardBody}>
              {summary.completedGoals} goals · {summary.buildings} buildings ·{' '}
              {summary.unlockedCitizens} citizens
            </Text>
          </View>
        </View>
      )}

      {tab === 'goals' && (
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Goal title"
              placeholderTextColor="#7a7a90"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What will you do in real life?"
              placeholderTextColor="#7a7a90"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {GOAL_CATEGORIES.map((item) => (
                <Pressable
                  key={item.id}
                  style={[styles.chip, category === item.id && styles.chipActive]}
                  onPress={() => setCategory(item.id)}
                >
                  <Text style={styles.chipText}>
                    {item.emoji} {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.chipRow}>
              {(['easy', 'medium', 'hard'] as GoalDifficulty[]).map((level) => (
                <Pressable
                  key={level}
                  style={[styles.chip, difficulty === level && styles.chipActive]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text style={styles.chipText}>{level}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                if (!title.trim()) return
                addGoal({ title, description, category, difficulty })
                setTitle('')
                setDescription('')
              }}
            >
              <Text style={styles.primaryButtonText}>Add to Dream Board</Text>
            </Pressable>
          </View>

          <GoalSection
            title="Active goals"
            goals={activeGoals}
            onComplete={markGoalComplete}
          />
          <GoalSection title="Completed goals" goals={completedGoals} />
        </View>
      )}

      {tab === 'build' && (
        <View style={styles.section}>
          {(Object.keys(BUILDING_CATALOG) as BuildingId[]).map((buildingId) => {
            const meta = BUILDING_CATALOG[buildingId]
            const existing = state.buildings.find((building) => building.id === buildingId)
            const check = canBuild(state, buildingId)
            return (
              <View key={buildingId} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {meta.emoji} {meta.name}
                </Text>
                <Text style={styles.cardBody}>{meta.description}</Text>
                {!check.ok && <Text style={styles.muted}>{check.reason}</Text>}
                <Pressable
                  style={[styles.primaryButton, !check.ok && styles.buttonDisabled]}
                  disabled={!check.ok}
                  onPress={() => constructBuilding(buildingId)}
                >
                  <Text style={styles.primaryButtonText}>
                    {existing ? 'Upgrade' : 'Build'}
                  </Text>
                </Pressable>
              </View>
            )
          })}
        </View>
      )}

      {tab === 'citizens' && (
        <View style={styles.section}>
          {(Object.keys(CITIZEN_CATALOG) as CitizenId[]).map((citizenId) => {
            const meta = CITIZEN_CATALOG[citizenId]
            const citizen = state.citizens.find((item) => item.id === citizenId)
            return (
              <View key={citizenId} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {meta.emoji} {meta.name} · {meta.role}
                </Text>
                <Text style={styles.cardBody}>{meta.dream}</Text>
                <Text style={styles.muted}>
                  {citizen?.unlocked ? 'Met' : meta.unlockHint} · Happiness{' '}
                  {citizen?.happiness ?? 0}%
                </Text>
              </View>
            )
          })}
        </View>
      )}

      {tab === 'journal' && (
        <View style={styles.section}>
          {journal.map((entry) => (
            <View key={entry.id} style={styles.card}>
              <Text style={styles.cardTitle}>{entry.title}</Text>
              <Text style={styles.cardBody}>{entry.body}</Text>
              <Text style={styles.muted}>
                {new Date(entry.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

function Resource({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.resourceCard}>
      <Text style={styles.resourceLabel}>{label}</Text>
      <Text style={styles.resourceValue}>{value}</Text>
    </View>
  )
}

function GoalSection({
  title,
  goals,
  onComplete,
}: {
  title: string
  goals: import('@dream-builder/game-core').Goal[]
  onComplete?: (goalId: string) => void
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {goals.length === 0 ? (
        <Text style={styles.muted}>Nothing here yet.</Text>
      ) : (
        goals.map((goal) => (
          <View key={goal.id} style={styles.goalItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.muted}>
                {goal.category} · {goal.difficulty}
              </Text>
            </View>
            {onComplete && (
              <Pressable style={styles.smallButton} onPress={() => onComplete(goal.id)}>
                <Text style={styles.smallButtonText}>Complete</Text>
              </Pressable>
            )}
          </View>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: '#0f0f18',
  },
  header: {
    gap: 4,
  },
  welcome: {
    color: '#a1a1b5',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#c7c7d5',
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2d2d45',
  },
  resetButtonText: {
    color: '#ffffff',
  },
  resourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resourceCard: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 12,
  },
  resourceLabel: {
    color: '#a1a1b5',
    fontSize: 12,
  },
  resourceValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  tabs: {
    flexGrow: 0,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2d2d45',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#7c6cff',
    borderColor: '#7c6cff',
  },
  tabText: {
    color: '#ffffff',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  skyCard: {
    backgroundColor: '#1f2a66',
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  skyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  skyBody: {
    color: '#d7dcff',
  },
  buildingLine: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    color: '#c7c7d5',
    lineHeight: 21,
  },
  muted: {
    color: '#8d8da3',
    fontSize: 13,
  },
  input: {
    backgroundColor: '#12121f',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2d2d45',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2d2d45',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#2a2550',
    borderColor: '#7c6cff',
  },
  chipText: {
    color: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#7c6cff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  goalItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2d2d45',
  },
  goalTitle: {
    color: '#ffffff',
    fontWeight: '600',
  },
  smallButton: {
    backgroundColor: '#7c6cff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
})
