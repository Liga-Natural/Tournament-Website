import Image from "next/image";
import Link from "next/link";

export function MomentCard({
  href,
  photoUrl,
  eyebrow,
  name,
  meta,
  objectPosition = "center 22%",
}: {
  href: string;
  photoUrl: string | null;
  eyebrow: string;
  name: string;
  meta: string;
  objectPosition?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] w-[62vw] max-w-64 shrink-0 snap-start overflow-hidden rounded-xl border border-gold/20 bg-navy-raised transition-colors duration-300 hover:border-gold sm:w-full sm:max-w-none"
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="(min-width: 640px) 24vw, 60vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ objectPosition }}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-navy-raised to-navy-deep font-display text-4xl font-extrabold text-gold/40">
          {name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/10 to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-light">{eyebrow}</p>
        <p className="mt-1 font-display text-lg font-extrabold leading-tight text-cream">{name}</p>
        <p className="mt-0.5 text-xs text-cream/75">{meta}</p>
      </div>
    </Link>
  );
}
