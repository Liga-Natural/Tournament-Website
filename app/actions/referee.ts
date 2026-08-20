"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { getFixture, submitResult } from "@/lib/store";

export async function submitRefereeResultAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "referee") throw new Error("Not authorized");

  const fixtureId = String(formData.get("fixtureId") ?? "");
  const fixture = await getFixture(fixtureId);
  if (!fixture || fixture.refereeId !== session.refereeId) {
    throw new Error("This match is not assigned to you");
  }

  const homeScore = Number(formData.get("homeScore") ?? 0);
  const awayScore = Number(formData.get("awayScore") ?? 0);
  await submitResult(fixtureId, { homeScore, awayScore });

  revalidatePath("/[locale]/referee", "page");
  revalidatePath("/[locale]/referee/match/[id]", "page");
}
