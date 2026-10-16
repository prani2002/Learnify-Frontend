import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-lg font-semibold text-ink">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
        <GraduationCap size={18} aria-hidden />
      </span>
      Learnify
    </Link>
  );
}
