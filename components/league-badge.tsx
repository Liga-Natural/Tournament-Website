import Image from "next/image";

export function LeagueBadge({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/league-badge.png"
      alt="Liga Natural Tournaments badge"
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      priority={size >= 56}
    />
  );
}
