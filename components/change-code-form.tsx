"use client";

import { useActionState } from "react";
import { changeOrganizerCodeAction, type ChangeCodeState } from "@/app/actions/auth";

const initialState: ChangeCodeState = { status: "idle", error: null };

export function ChangeCodeForm({ locale }: { locale: string }) {
  const action = changeOrganizerCodeAction.bind(null, locale);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">New organizer access code</label>
        <input
          name="newCode"
          minLength={6}
          required
          className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2.5 text-cream focus:border-gold focus:outline-none"
        />
      </div>
      {state.error === "code-too-short" && <p className="text-sm text-red-300">Code must be at least 6 characters.</p>}
      {state.status === "success" && <p className="text-sm text-gold-light">Saved.</p>}
      <button type="submit" disabled={pending} className="gold-pill px-5 py-2.5 text-sm disabled:opacity-60">
        {pending ? "Saving…" : "Update Code"}
      </button>
    </form>
  );
}
