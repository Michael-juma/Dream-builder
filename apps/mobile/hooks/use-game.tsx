import {
  buildStructure,
  completeGoal,
  completeOnboarding,
  createGoal,
  createInitialState,
  type BuildingId,
  type GameState,
  type GoalCategory,
  type GoalDifficulty,
  type PlayerProfile,
} from '@dream-builder/game-core'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { loadGameState, resetGameState, saveGameState } from '../lib/storage'

type GameContextValue = {
  state: GameState
  ready: boolean
  finishOnboarding: (input: {
    name: string
    civilizationName: string
    firstDream: string
    district: NonNullable<PlayerProfile['districtChoice']>
  }) => void
  addGoal: (input: {
    title: string
    description: string
    category: GoalCategory
    difficulty: GoalDifficulty
  }) => void
  markGoalComplete: (goalId: string) => void
  constructBuilding: (buildingId: BuildingId) => void
  resetGame: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => createInitialState())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadGameState().then((loaded) => {
      setState(loaded)
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (!ready) {
      return
    }
    void saveGameState(state)
  }, [state, ready])

  const finishOnboarding = useCallback(
    (input: {
      name: string
      civilizationName: string
      firstDream: string
      district: NonNullable<PlayerProfile['districtChoice']>
    }) => {
      setState((current) => completeOnboarding(current, input))
    },
    [],
  )

  const addGoal = useCallback(
    (input: {
      title: string
      description: string
      category: GoalCategory
      difficulty: GoalDifficulty
    }) => {
      setState((current) => createGoal(current, input))
    },
    [],
  )

  const markGoalComplete = useCallback((goalId: string) => {
    setState((current) => completeGoal(current, goalId))
  }, [])

  const constructBuilding = useCallback((buildingId: BuildingId) => {
    setState((current) => buildStructure(current, buildingId))
  }, [])

  const resetGame = useCallback(() => {
    void resetGameState().then(setState)
  }, [])

  const value = useMemo(
    () => ({
      state,
      ready,
      finishOnboarding,
      addGoal,
      markGoalComplete,
      constructBuilding,
      resetGame,
    }),
    [
      state,
      ready,
      finishOnboarding,
      addGoal,
      markGoalComplete,
      constructBuilding,
      resetGame,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
