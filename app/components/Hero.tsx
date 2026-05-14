import { Button } from "./ui/button";

type HeroProps = {
  onRequestProposal: () => void;
  onBookAppointment: () => void;
};

export function Hero({ onRequestProposal, onBookAppointment }: HeroProps) {
  const goToDigitalProjects = () => {
    if (typeof window === "undefined") return;
    window.location.href = "/#projets-numeriques";
  };

  return (
    <section className="relative overflow-hidden border-b border-purple-200/70 bg-[linear-gradient(140deg,#fff2ff_0%,#f6eeff_36%,#e8fffa_70%,#efd2ff_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(123,51,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(123,51,255,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-purple-400/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-fuchsia-300/35 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-24 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />
      <p className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[150px] font-semibold uppercase tracking-[0.1em] text-purple-200/55 md:block">
        GBH
      </p>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-purple-300 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-purple-700 uppercase">
              Services + startups numeriques
            </p>
            <h1 className="mt-6 text-4xl md:text-6xl text-[var(--gbh-violet-900)] leading-tight">
              Transformez vos besoins en execution mesurable.
            </h1>
            <p className="mt-6 text-lg text-[var(--gbh-gray-text)] max-w-2xl">
              Groupe B-Holding combine services B2B, execution terrain et promotion
              de startups numeriques comme Uty, Zwanga, Afya et BPAC.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {/* <Button
                onClick={goToDigitalProjects}
                size="lg"
                className="rounded-full px-8"
              >
                Voir les projets numeriques
              </Button> */}
              <Button
                onClick={onRequestProposal}
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
              >
                Lancer une consultation B2B
              </Button>
              <Button
                onClick={onBookAppointment}
                size="lg"
                variant="outline"
                className="rounded-full px-8"
              >
                Prendre rendez-vous
              </Button>
            </div>
          </div>

          <div className="relative rounded-3xl border border-purple-200 bg-white/75 p-8 shadow-[0_20px_44px_rgba(58,23,143,0.18)] backdrop-blur">
            <div className="pointer-events-none absolute right-6 top-6 h-28 w-28 rounded-full border border-purple-200 bg-purple-100/70" />
            <p className="text-xs uppercase tracking-[0.22em] text-purple-600">Capabilites</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <article className="rounded-2xl bg-[linear-gradient(135deg,#5b1db4,#b34cff,#30d2bd)] p-5 text-white shadow-[0_10px_24px_rgba(100,37,196,0.42)]">
                <p className="text-3xl font-semibold">4</p>
                <p className="text-sm text-white/85">Startups numeriques mises en avant</p>
              </article>
              <article className="rounded-2xl border border-purple-200 bg-white p-5">
                <p className="text-3xl font-semibold text-purple-800">BPAC</p>
                <p className="text-sm text-purple-700">Banque numerique en conception</p>
              </article>
              <article className="rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,rgba(248,236,255,0.95),rgba(228,255,250,0.88))] p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-purple-600">
                  Uty + Afya
                </p>
                <p className="mt-2 text-purple-900">Commerce numerique et sante connectee.</p>
              </article>
              <article className="rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,rgba(249,237,255,0.95),rgba(229,255,251,0.84))] p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-purple-600">
                  Zwanga
                </p>
                <p className="mt-2 text-purple-900">Mobilite partagee via application dediee.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

