import Image from "next/image";

type FloatingWhatsAppButtonProps = {
  context?: string;
};

const messageByContext: Record<string, string> = {
  home: "Bonjour GBH, je souhaite discuter d'une consultation B2B.",
  organisations: "Bonjour GBH, je souhaite lancer une consultation B2B pour mon organisation.",
  about: "Bonjour GBH, je souhaite en savoir plus sur votre entreprise et vos services.",
  "a-propos": "Bonjour GBH, je souhaite en savoir plus sur votre entreprise et vos services.",
  references: "Bonjour GBH, je souhaite des informations complementaires sur vos references.",
  "case-study": "Bonjour GBH, je souhaite echanger sur une etude de cas.",
  rdv: "Bonjour GBH, j'ai besoin d'aide pour ma reservation de rendez-vous.",
};

export function FloatingWhatsAppButton({ context = "home" }: FloatingWhatsAppButtonProps) {
  const message =
    messageByContext[context] || "Bonjour GBH, je souhaite des informations sur vos services.";
  const href = `https://wa.me/243999403012?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed left-4 bottom-4 z-[60] inline-flex items-center gap-2 rounded-full border border-cyan-100/80 bg-[linear-gradient(135deg,#93ffe9,#ddfff8,#f2e2ff)] px-4 py-3 text-sm font-semibold text-[var(--gbh-violet-900)] shadow-[0_16px_30px_rgba(59,201,180,0.35)] transition-all hover:-translate-y-1 hover:brightness-105"
      aria-label="Contacter GBH sur WhatsApp"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/85">
        <Image
          src="/whatsapp.png"
          alt="WhatsApp"
          width={16}
          height={16}
          className="h-4 w-4 object-contain"
        />
      </span>
      WhatsApp
    </a>
  );
}

