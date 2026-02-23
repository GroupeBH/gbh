type FloatingWhatsAppButtonProps = {
  context?: string;
};

const messageByContext: Record<string, string> = {
  home: "Bonjour GBH, je souhaite discuter d'une mission B2B.",
  organisations: "Bonjour GBH, je souhaite demander une proposition pour mon organisation.",
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
      className="fixed left-4 bottom-4 z-[60] inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-[linear-gradient(135deg,#3f1a9b,#6b32ea)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(54,23,129,0.5)] transition-all hover:-translate-y-1 hover:brightness-110"
      aria-label="Contacter GBH sur WhatsApp"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] tracking-wide">
        WA
      </span>
      WhatsApp
    </a>
  );
}

