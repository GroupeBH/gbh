const defaultLogos = [
  "CFAO Mobility",
  "ANAPI",
  "SNEL",
  "REGIDESO",
  "ACGT",
  "SONAL S.A.",
  "Kamoto",
  "Kamoa",
  "Tenke Fungurume",
];

type LogosRibbonProps = {
  logos?: string[];
};

export function LogosRibbon({ logos = defaultLogos }: LogosRibbonProps) {
  return (
    <section className="py-8 bg-[linear-gradient(130deg,#12092f,#2a1164)] border-y border-purple-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-purple-200">
          Ils nous font confiance
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {logos.map((logo) => (
            <span
              key={logo}
              className="rounded-full border border-purple-300/30 bg-white/10 px-4 py-2 text-sm font-medium text-purple-50 backdrop-blur"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

