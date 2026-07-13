"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { completeOnboardingAction } from "@/features/onboarding/actions/onboarding.actions";
import { initialOnboardingFormState } from "@/features/onboarding/types/onboarding";

const stepLabels = ["Welcome", "Your name", "Preferences", "Finish"];

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [textScale, setTextScale] = useState<"default" | "large">("default");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [state, action, pending] = useActionState(completeOnboardingAction, initialOnboardingFormState);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return <Card className="mx-auto max-w-lg"><CardHeader><p className="text-sm text-muted-foreground">Step {step + 1} of {stepLabels.length}: {stepLabels[step]}</p><ProgressBar label={`Onboarding progress: step ${step + 1} of ${stepLabels.length}`} value={((step + 1) / stepLabels.length) * 100} /><CardTitle className="pt-4">{step === 0 ? "Welcome to Health Decoded" : step === 1 ? "What would you like us to call you?" : step === 2 ? "Reading and motion preferences" : "Review your setup"}</CardTitle></CardHeader><CardContent><form action={action} className="space-y-5"><input name="displayName" type="hidden" value={displayName} /><input name="preferredTextScale" type="hidden" value={textScale} /><input name="reducedMotion" type="hidden" value={String(reducedMotion)} /><input name="locale" type="hidden" value="en" /><input name="timezone" type="hidden" value={timezone} />{step === 0 ? <p>Setup takes just a minute. We will guide you gradually, one small step at a time.</p> : null}{step === 1 ? <label className="grid gap-2 text-sm font-medium">Preferred name<Input autoComplete="name" onChange={(event) => setDisplayName(event.target.value)} required value={displayName} /></label> : null}{step === 2 ? <fieldset className="space-y-4"><legend className="font-medium">Choose what feels comfortable</legend><label className="flex items-center gap-3"><input checked={textScale === "large"} onChange={(event) => setTextScale(event.target.checked ? "large" : "default")} type="checkbox" />Use larger text</label><label className="flex items-center gap-3"><input checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} type="checkbox" />Reduce motion</label></fieldset> : null}{step === 3 ? <dl className="space-y-2"><div><dt className="text-sm text-muted-foreground">Name</dt><dd>{displayName || "Not provided"}</dd></div><div><dt className="text-sm text-muted-foreground">Text</dt><dd>{textScale === "large" ? "Larger" : "Standard"}</dd></div><div><dt className="text-sm text-muted-foreground">Motion</dt><dd>{reducedMotion ? "Reduced" : "Standard"}</dd></div></dl> : null}{state.message ? <p aria-live="polite" className="text-sm text-destructive">{state.message}</p> : null}<CardFooter>{step > 0 ? <Button fullWidth={false} onClick={() => setStep(step - 1)} type="button" variant="secondary">Back</Button> : null}{step < 3 ? <Button onClick={() => { if (step !== 1 || displayName.trim()) setStep(step + 1); }} type="button">Continue</Button> : <Button disabled={pending} type="submit">{pending ? "Saving…" : "Finish setup"}</Button>}</CardFooter></form></CardContent></Card>;
}
