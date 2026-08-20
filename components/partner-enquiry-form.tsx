"use client";

import { useActionState } from "react";
import { submitPartnerEnquiryAction, type FormState } from "@/app/actions/public-forms";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Field } from "./form-field";

const initialState: FormState = { status: "idle" };

export function PartnerEnquiryForm({ dict }: { dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitPartnerEnquiryAction, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-gold/30 bg-navy-raised/60 p-8 text-center">
        <p className="font-display text-xl font-bold text-gold-light">{dict.common.thankYou}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.partnersPage.formName} name="name" required />
        <Field label={dict.partnersPage.formCompany} name="company" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.partnersPage.formEmail} name="email" type="email" required />
        <Field label={dict.partnersPage.formPhone} name="phone" type="tel" />
      </div>
      <Field label={dict.partnersPage.formInterest} name="interest" placeholder="Title sponsor, season partner, matchday…" />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-cream/90">{dict.partnersPage.formMessage}</label>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-md border border-gold/30 bg-navy-deep px-3.5 py-2.5 text-cream placeholder:text-muted focus:border-gold focus:outline-none"
        />
      </div>
      {state.status === "error" && <p className="text-sm text-red-300">Please fill in your name and email.</p>}
      <button type="submit" disabled={pending} className="btn btn-gold w-full text-sm sm:w-auto">
        {pending ? dict.common.sending : dict.partnersPage.formSubmit}
      </button>
    </form>
  );
}
