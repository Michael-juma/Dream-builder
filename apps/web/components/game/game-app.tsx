'use client'

import { OnboardingFlow } from '@/components/game/onboarding'
import { GameShell } from '@/components/game/game-shell'
import { useGame } from '@/hooks/use-game'

export function GameApp() {
  const { state, ready } = useGame()

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Awakening The Cradle...</p>
      </main>
    )
  }

  if (!state.profile.onboardingComplete) {
    return <OnboardingFlow />
  }

  return <GameShell />
}
