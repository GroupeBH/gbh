export function TrustComplianceBlock() {
  const items = [
    {
      title: "Confidentialite contractuelle",
      description:
        "Protection des donnees sensibles et engagement de non-divulgation adapte au contexte B2B.",
    },
    {
      title: "Conformite operationnelle",
      description:
        "Approche documentee, execution controlee et tracabilite des actions sur chaque mission.",
    },
    {
      title: "Gouvernance de mission",
      description:
        "Points de pilotage, responsabilites clarifiees et remontes d'information structurees.",
    },
  ];

  return (
    <section className="py-18 md:py-24 bg-[linear-gradient(180deg,#f6f1ff,#ecfffa,#f4eaff)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-300/20 bg-[radial-gradient(circle_at_top_right,rgba(236,121,255,0.24),transparent_28%),radial-gradient(circle_at_12%_84%,rgba(114,246,223,0.34),transparent_32%),radial-gradient(circle_at_82%_72%,rgba(114,246,223,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(123,51,255,0.2),transparent_30%),linear-gradient(135deg,#35235f,#6d47a1,#3ad3bf)] p-8 md:p-10 shadow-[0_24px_42px_rgba(45,12,96,0.45)]">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200">
              Conformite & confidentialite
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl text-white">
              Une execution fiable pour des environnements a forte exigence.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-purple-200/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(220,255,248,0.12))] p-5 backdrop-blur transition-all hover:border-[rgba(114,246,223,0.45)] hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.2),rgba(220,255,248,0.15))]"
              >
                <h3 className="text-lg text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-purple-100">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


