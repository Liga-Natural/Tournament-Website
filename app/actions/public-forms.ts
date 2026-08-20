"use server";

import { addContactSubmission, addPartnerEnquiry, addJoinSubmission } from "@/lib/store";
import type { ContactSubmission, JoinSubmission } from "@/lib/types";

export type FormState = { status: "idle" | "success" | "error" };

export async function submitPartnerEnquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name || !email) return { status: "error" };
  await addPartnerEnquiry({
    name,
    company: String(formData.get("company") ?? "").trim() || null,
    email,
    phone: String(formData.get("phone") ?? "").trim() || null,
    interest: String(formData.get("interest") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  });
  return { status: "success" };
}

export async function submitContactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "general") as ContactSubmission["reason"];
  if (!name || !email) return { status: "error" };
  await addContactSubmission({
    name,
    email,
    phone: String(formData.get("phone") ?? "").trim() || null,
    reason,
    message: String(formData.get("message") ?? "").trim(),
  });
  return { status: "success" };
}

export async function submitJoinAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const type = String(formData.get("type") ?? "team") as JoinSubmission["type"];
  if (!name || !email) return { status: "error" };
  await addJoinSubmission({
    type,
    name,
    email,
    phone: String(formData.get("phone") ?? "").trim() || null,
    details: String(formData.get("details") ?? "").trim(),
  });
  return { status: "success" };
}
