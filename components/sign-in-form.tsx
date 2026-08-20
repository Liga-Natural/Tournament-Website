"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "@/app/actions/auth";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const initialState: SignInState = { error: null };

export function SignInForm({ locale, dict }: { locale: string; dict: Dictionary }) {
  const action = signInAction.bind(null, locale);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-cream/90">
          {dict.signinPage.codeLabel}
        </label>
        <input
          id="code"
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          className="w-full rounded-md border border-gold/30 bg-navy-deep px-4 py-3.5 text-center text-2xl font-display tracking-[0.3em] text-cream placeholder:text-muted focus:border-gold focus:outline-none"
          placeholder="••••••"
        />
      </div>
      {state.error === "code-empty" && <p className="text-sm text-red-300">{dict.signinPage.errorEmpty}</p>}
      {state.error === "code-invalid" && <p className="text-sm text-red-300">{dict.signinPage.errorInvalid}</p>}
      <button type="submit" disabled={pending} className="btn btn-gold w-full text-sm">
        {pending ? dict.common.loading : dict.signinPage.submit}
      </button>
    </form>
  );
}
