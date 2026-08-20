import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="field-backdrop" aria-hidden="true" />
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center text-cream">
        <span className="grid h-16 w-16 place-items-center rounded-full crest-ring">
          <span className="font-display text-xl font-extrabold text-navy-deep">LN</span>
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold uppercase tracking-wide">Page Not Found</h1>
        <p className="mt-3 max-w-md text-muted">
          This page doesn&apos;t exist — or the match, team, or event you&apos;re looking for hasn&apos;t been added yet.
        </p>
        <Link href="/en" className="gold-pill mt-8 px-6 py-3 text-base">
          Back to Home
        </Link>
      </div>
    </>
  );
}
