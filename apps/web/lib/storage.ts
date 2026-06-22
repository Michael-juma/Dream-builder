import { STORAGE_KEY, createInitialState, parseGameState, type GameState } from '@dream-builder/game-core'

export function loadGameState(): GameState {
  if (typeof window === 'undefined') {
    return createInitialState()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialState()
    }
    return parseGameState(JSON.parse(raw))
  } catch {
    return createInitialState()
  }
}

export function saveGameState(state: GameState) {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetGameState() {
  if (typeof window === 'undefined') {
    return createInitialState()
  }
  window.localStorage.removeItem(STORAGE_KEY)
  return createInitialState()
}
