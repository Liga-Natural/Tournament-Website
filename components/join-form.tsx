"use client";

import { useActionState, useState } from "react";
import { submitJoinAction, type FormState } from "@/app/actions/public-forms";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Field } from "./form-field";

const initialState: FormState = { status: "idle" };

export function JoinForm({ dict }: { dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitJoinAction, initialState);
  const [type, setType] = useState<"team" | "player" | "referee">("team");

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-gold/30 bg-navy-raised/60 p-8 text-center">
        <p className="font-display text-xl font-bold text-gold-light">{dict.common.thankYou}</p>
      </div>
    );
  }

  const options: { value: "team" | "player" | "referee"; label: string }[] = [
    { value: "team", label: dict.joinPage.typeTeam },
    { value: "player", label: dict.joinPage.typePlayer },
    { value: "referee", label: dict.joinPage.typeReferee },
  ];

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer rounded-lg border px-4 py-3.5 text-center text-sm font-semibold uppercase tracking-wide transition-colors ${
              type === opt.value ? "border-gold bg-gold/15 text-gold-light" : "border-gold/25 text-muted hover:text-cream"
            }`}
          >
            <input
              type="radio"
              name="type"
              value={opt.value}
              checked={type === opt.value}
              onChange={() => setType(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>

      <Field label={dict.joinPage.formName} name="name" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.joinPage.formEmail} name="email" type="email" required />
        <Field label={dict.joinPage.formPhone} name="phone" type="tel" />
      </div>
      <div>
        <label htmlFor="details" className="mb-1.5 block text-sm font-medium text-cream/90">
          {dict.joinPage.formDetails}
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          className="w-full rounded-md border border-gold/30 bg-navy-deep px-3.5 py-2.5 text-cream placeholder:text-muted focus:border-gold focus:outline-none"
        />
      </div>
      {state.status === "error" && <p className="text-sm text-red-300">Please fill in your name and email.</p>}
      <button
        type="submit"
        disabled={pending}
        className="gold-pill w-full justify-center px-6 py-3.5 text-base disabled:opacity-60 sm:w-auto"
      >
        {pending ? dict.common.sending : dict.joinPage.formSubmit}
      </button>
    </form>
  );
}
