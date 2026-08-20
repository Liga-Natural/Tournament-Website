import Image from "next/image";

function initials(name: string): string {
  const words = name.replace(/FC$/i, "").trim().split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "");
  return letters.join("") || name.slice(0, 2).toUpperCase();
}

export function Crest({
  name,
  crestUrl,
  size = 56,
}: {
  name: string;
  crestUrl?: string | null;
  size?: number;
}) {
  return (
    <span
      className="crest-ring grid shrink-0 place-items-center overflow-hidden"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${name} crest`}
    >
      {crestUrl ? (
        <Image
          src={crestUrl}
          alt={`${name} crest`}
          width={size}
          height={size}
          className="h-[86%] w-[86%] object-contain"
        />
      ) : (
        <span className="font-display font-extrabold text-navy-deep" style={{ fontSize: size * 0.34 }}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
