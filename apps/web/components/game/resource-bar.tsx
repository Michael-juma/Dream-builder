import type { Resources } from '@dream-builder/game-core'

const items: { key: keyof Resources; label: string; emoji: string }[] = [
  { key: 'dreamEnergy', label: 'Dream Energy', emoji: '✨' },
  { key: 'knowledge', label: 'Knowledge', emoji: '📚' },
  { key: 'creativity', label: 'Creativity', emoji: '🎨' },
  { key: 'influence', label: 'Influence', emoji: '🤝' },
]

export function ResourceBar({ resources }: { resources: Resources }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-xl border bg-card px-3 py-2 shadow-sm"
        >
          <p className="text-xs text-muted-foreground">
            {item.emoji} {item.label}
          </p>
          <p className="text-lg font-semibold tabular-nums">
            {resources[item.key]}
          </p>
        </div>
      ))}
    </div>
  )
}
