import Link from "next/link";

type StickyRfpCtaProps = {
  href?: string;
};

export function StickyRfpCta({ href = "/organisations" }: StickyRfpCtaProps) {
  return (
    <Link
      href={href}
      className="fixed right-4 bottom-20 z-[60] inline-flex items-center rounded-full border border-purple-300/30 bg-[linear-gradient(135deg,#5f27d8,#8d4eff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(79,31,186,0.46)] transition-all hover:-translate-y-1 hover:brightness-110"
    >
      Demander une proposition
    </Link>
  );
}

