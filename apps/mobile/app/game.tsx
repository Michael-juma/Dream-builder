import { useGame } from '../hooks/use-game'
import { GameScreen } from '../components/game-screen'
import { OnboardingScreen } from '../components/onboarding-screen'

export default function GameRoute() {
  const { state, ready } = useGame()

  if (!ready) {
    return null
  }

  if (!state.profile.onboardingComplete) {
    return <OnboardingScreen />
  }

  return <GameScreen />
}
