'use client'

import { STARTER_DREAMS } from '@dream-builder/game-core'
import { useState } from 'react'

import { Button } from '@/components/button'
import { useGame } from '@/hooks/use-game'

const districts = [
  { id: 'knowledge', label: 'Knowledge District', emoji: '📚' },
  { id: 'engineering', label: 'Engineering District', emoji: '⚙️' },
  { id: 'creativity', label: 'Creativity District', emoji: '🎨' },
  { id: 'wellness', label: 'Wellness District', emoji: '🌿' },
] as const

export function OnboardingFlow() {
  const { finishOnboarding } = useGame()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [civilizationName, setCivilizationName] = useState('')
  const [firstDream, setFirstDream] = useState(STARTER_DREAMS[0])
  const [customDream, setCustomDream] = useState('')
  const [district, setDistrict] =
    useState<(typeof districts)[number]['id']>('knowledge')

  const chosenDream = firstDream === 'Create My Own Goal' ? customDream : firstDream

  const canContinue =
    (step === 0 && name.trim() && civilizationName.trim()) ||
    (step === 1 && chosenDream.trim()) ||
    step === 2

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-6 px-6 py-10">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-muted-foreground">Chapter 1</p>
        <h1 className="text-3xl font-semibold tracking-tight">The First Spark</h1>
        <p className="text-muted-foreground">
          The world was fractured when dreams were abandoned. You are the first
          Dream Architect in centuries.
        </p>
      </div>

      {step === 0 && (
        <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Your name</span>
            <input
              className="w-full rounded-lg border bg-background px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Dream Architect"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Civilization name</span>
            <input
              className="w-full rounded-lg border bg-background px-3 py-2"
              value={civilizationName}
              onChange={(event) => setCivilizationName(event.target.value)}
              placeholder="Cradle of Hope"
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium">Choose your first dream</p>
          <div className="grid gap-2">
            {[...STARTER_DREAMS, 'Create My Own Goal'].map((dream) => (
              <button
                key={dream}
                type="button"
                onClick={() => setFirstDream(dream)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  firstDream === dream
                    ? 'border-primary bg-primary/10'
                    : 'hover:bg-muted'
                }`}
              >
                {dream}
              </button>
            ))}
          </div>
          {firstDream === 'Create My Own Goal' && (
            <input
              className="w-full rounded-lg border bg-background px-3 py-2"
              value={customDream}
              onChange={(event) => setCustomDream(event.target.value)}
              placeholder="Describe your dream"
            />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium">Which district do you awaken first?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {districts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDistrict(item.id)}
                className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                  district === item.id
                    ? 'border-primary bg-primary/10'
                    : 'hover:bg-muted'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="mt-2 text-sm font-medium">{item.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((current) => current - 1)}
        >
          Back
        </Button>
        {step < 2 ? (
          <Button disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={() =>
              finishOnboarding({
                name,
                civilizationName,
                firstDream: chosenDream,
                district,
              })
            }
          >
            Awaken The Cradle
          </Button>
        )}
      </div>
    </div>
  )
}
