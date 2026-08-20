import Link from "next/link";
import { LeagueBadge } from "@/components/league-badge";

export default function NotFound() {
  return (
    <>
      <div className="field-backdrop" aria-hidden="true" />
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center text-cream">
        <LeagueBadge size={72} />
        <h1 className="mt-6 font-display text-4xl font-extrabold uppercase tracking-wide">Page Not Found</h1>
        <p className="mt-3 max-w-md text-muted">
          This page doesn&apos;t exist — or the match, team, or event you&apos;re looking for hasn&apos;t been added yet.
        </p>
        <Link href="/en" className="btn btn-gold mt-8 text-sm">
          Back to Home
        </Link>
      </div>
    </>
  );
}
