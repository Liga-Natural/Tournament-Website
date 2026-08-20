"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitRefereeResultAction } from "@/app/actions/referee";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Crest } from "./crest";

export function ScoreStepperForm({
  fixtureId,
  homeName,
  awayName,
  homeCrest,
  awayCrest,
  initialHome,
  initialAway,
  dict,
}: {
  fixtureId: string;
  homeName: string;
  awayName: string;
  homeCrest?: string | null;
  awayCrest?: string | null;
  initialHome: number;
  initialAway: number;
  dict: Dictionary;
}) {
  const [home, setHome] = useState(initialHome);
  const [away, setAway] = useState(initialAway);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  if (done) {
    return (
      <div className="rounded-xl border border-gold/30 bg-navy-raised/60 p-8 text-center">
        <p className="font-display text-2xl font-bold text-gold-light">{dict.referee.submitted}</p>
        <p className="mt-2 font-display tabular text-4xl font-extrabold text-cream">
          {home}–{away}
        </p>
      </div>
    );
  }

  async function handleConfirm() {
    setSubmitting(true);
    const fd = new FormData();
    fd.set("fixtureId", fixtureId);
    fd.set("homeScore", String(home));
    fd.set("awayScore", String(away));
    await submitRefereeResultAction(fd);
    setSubmitting(false);
    setDone(true);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <TeamStepper label={homeName} crest={homeCrest} value={home} onChange={setHome} />
      <TeamStepper label={awayName} crest={awayCrest} value={away} onChange={setAway} />

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="gold-pill w-full justify-center py-4 text-lg"
        >
          {dict.referee.submitResult}
        </button>
      ) : (
        <div className="rounded-xl border border-gold/40 bg-navy-raised/70 p-5 text-center">
          <p className="mb-3 text-sm text-muted">
            {homeName} {home} – {away} {awayName}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-full border border-gold/40 py-3.5 text-base font-semibold text-cream/85"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirm}
              className="gold-pill flex-1 justify-center py-3.5 text-base disabled:opacity-60"
            >
              {submitting ? dict.common.sending : dict.referee.confirmSubmit}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamStepper({
  label,
  crest,
  value,
  onChange,
}: {
  label: string;
  crest?: string | null;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-xl border border-gold/25 bg-navy-raised/50 p-5">
      <div className="flex items-center gap-3">
        <Crest name={label} crestUrl={crest} size={44} />
        <span className="flex-1 text-lg font-semibold text-cream">{label}</span>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label={`Decrease ${label} score`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="grid h-16 w-16 place-items-center rounded-full border-2 border-gold/50 text-3xl font-bold text-gold-light active:bg-gold/15"
        >
          −
        </button>
        <span className="font-display tabular text-6xl font-extrabold text-cream" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label} score`}
          onClick={() => onChange(value + 1)}
          className="grid h-16 w-16 place-items-center rounded-full border-2 border-gold bg-gold/10 text-3xl font-bold text-gold-light active:bg-gold/25"
        >
          +
        </button>
      </div>
    </div>
  );
}
