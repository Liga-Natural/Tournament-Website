"use client";

import { useActionState, useState } from "react";
import { submitContactAction, type FormState } from "@/app/actions/public-forms";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Field } from "./form-field";
import type { ContactSubmission } from "@/lib/types";

const initialState: FormState = { status: "idle" };

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);
  const [reason, setReason] = useState<ContactSubmission["reason"]>("general");

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-gold/30 bg-navy-raised/60 p-8 text-center">
        <p className="font-display text-xl font-bold text-gold-light">{dict.common.thankYou}</p>
      </div>
    );
  }

  const reasons: { value: ContactSubmission["reason"]; label: string }[] = [
    { value: "sponsorship", label: dict.contactPage.reasonSponsorship },
    { value: "team-registration", label: dict.contactPage.reasonTeam },
    { value: "referee", label: dict.contactPage.reasonReferee },
    { value: "general", label: dict.contactPage.reasonGeneral },
  ];

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-cream/90">{dict.contactPage.formReason}</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {reasons.map((r) => (
            <label
              key={r.value}
              className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors ${
                reason === r.value ? "border-gold bg-gold/15 text-gold-light" : "border-gold/25 text-muted hover:text-cream"
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.contactPage.formName} name="name" required />
        <Field label={dict.contactPage.formEmail} name="email" type="email" required />
      </div>
      <Field label={dict.contactPage.formPhone} name="phone" type="tel" />
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-cream/90">
          {dict.contactPage.formMessage}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full rounded-md border border-gold/30 bg-navy-deep px-3.5 py-2.5 text-cream placeholder:text-muted focus:border-gold focus:outline-none"
        />
      </div>
      {state.status === "error" && <p className="text-sm text-red-300">Please fill in your name and email.</p>}
      <button type="submit" disabled={pending} className="btn btn-gold w-full text-sm sm:w-auto">
        {pending ? dict.common.sending : dict.contactPage.formSubmit}
      </button>
    </form>
  );
}
