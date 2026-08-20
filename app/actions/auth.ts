"use server";

import { redirect } from "next/navigation";
import { verifyCode, setOrganizerCode as storeSetOrganizerCode } from "@/lib/store";
import { setSessionCookie, clearSessionCookie, getSession } from "@/lib/session";

export type SignInState = { error: string | null };

export async function signInAction(locale: string, _prev: SignInState, formData: FormData): Promise<SignInState> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "code-empty" };
  const session = await verifyCode(code);
  if (!session) return { error: "code-invalid" };
  await setSessionCookie(session);
  redirect(session.role === "organizer" ? `/${locale}/admin` : `/${locale}/referee`);
}

export async function signOutAction(locale: string): Promise<void> {
  await clearSessionCookie();
  redirect(`/${locale}`);
}

export type ChangeCodeState = { status: "idle" | "success" | "error"; error: string | null };

export async function changeOrganizerCodeAction(
  locale: string,
  _prev: ChangeCodeState,
  formData: FormData
): Promise<ChangeCodeState> {
  const session = await getSession();
  if (!session || session.role !== "organizer") return { status: "error", error: "not-authorized" };
  const newCode = String(formData.get("newCode") ?? "").trim();
  if (newCode.length < 6) return { status: "error", error: "code-too-short" };
  await storeSetOrganizerCode(newCode);
  return { status: "success", error: null };
}
