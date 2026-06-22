import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  STORAGE_KEY,
  createInitialState,
  parseGameState,
  type GameState,
} from '@dream-builder/game-core'

export async function loadGameState(): Promise<GameState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialState()
    }
    return parseGameState(JSON.parse(raw))
  } catch {
    return createInitialState()
  }
}

export async function saveGameState(state: GameState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export async function resetGameState(): Promise<GameState> {
  await AsyncStorage.removeItem(STORAGE_KEY)
  return createInitialState()
}
