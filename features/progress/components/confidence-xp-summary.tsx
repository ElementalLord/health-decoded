import { Card } from "@/components/ui/card";

export function ConfidenceXpSummary({ total }: { total: number }) {
  return (
    <Card className="space-y-2">
      <h2 className="text-[length:var(--text-section-title)] font-semibold tracking-tight">
        Confidence XP
      </h2>
      <p className="text-2xl font-semibold tracking-tight">{total} earned</p>
      <p className="text-sm leading-6 text-muted-foreground">
        Confidence XP reflects learning progress, not medical progress.
      </p>
    </Card>
  );
}
