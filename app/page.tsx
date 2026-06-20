import { Button } from '@/components/button'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Dream Builder</h1>
        <p className="mt-2 text-muted-foreground">
          Start building something great.
        </p>
      </div>
      <Button>Get started</Button>
    </main>
  )
}
