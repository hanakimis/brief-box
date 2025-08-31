import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold">🐱📦 BriefBox</h1>
      <p className="text-muted-foreground">
        Digest your newsletters into simple summaries
      </p>
      <Button>Placeholder Button</Button>
    </main>
  );
}
