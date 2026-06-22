import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { GameProvider } from '../hooks/use-game'

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#12121f' },
          headerTintColor: '#f5f5f5',
          contentStyle: { backgroundColor: '#0f0f18' },
        }}
      />
    </GameProvider>
  )
}
