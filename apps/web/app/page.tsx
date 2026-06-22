import Link from 'next/link'

import { Button } from '@/components/button'

export default function Page() {
  return (
    <div className="page-bg bg-landing">
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Life-growth civilization game
          </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Dream Builder
        </h1>
        <p className="mt-4 text-muted-foreground">
          Transform real-world progress into a living civilization on The Cradle.
          Set goals, earn Dream Energy, meet citizens, grow the World Tree, and
          rebuild a fractured world — one real-life achievement at a time.
        </p>
      </div>

      <div className="grid max-w-3xl gap-3 text-left sm:grid-cols-3">
        <FeatureCard emoji="🎯" title="Real-life goals" body="Learning, creativity, wellness, connection, and purpose." />
        <FeatureCard emoji="🏝" title="The Cradle" body="Build Dream Hall, Library, Workshop, and more on your starting island." />
        <FeatureCard emoji="🌳" title="World Tree" body="Your balanced growth makes the tree — and your world — flourish." />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/game" />} size="lg">
          Play on web
        </Button>
        <Button nativeButton={false} render={<Link href="/game" />} variant="outline" size="lg">
          Continue civilization
        </Button>
      </div>

      <p className="max-w-lg text-center text-sm text-muted-foreground">
        Mobile app scaffold is included in this repo. Run{' '}
        <code className="rounded bg-muted px-1.5 py-0.5">npm run dev:mobile</code>{' '}
        from the project root to launch the Expo app.
      </p>
      </main>
    </div>
  )
}

function FeatureCard({
  emoji,
  title,
  body,
}: {
  emoji: string
  title: string
  body: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <p className="text-2xl">{emoji}</p>
      <h2 className="mt-2 font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  )
}
