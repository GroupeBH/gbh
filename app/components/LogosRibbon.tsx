import Image from "next/image";
import {
  getCompanyInitials,
  getCompanyLogo,
  trustedCompanies,
  type TrustedCompany,
} from "../lib/company-logos";

type LogosRibbonProps = {
  logos?: TrustedCompany[];
};

export function LogosRibbon({ logos = trustedCompanies }: LogosRibbonProps) {
  return (
    <section className="py-8 bg-[radial-gradient(circle_at_20%_110%,rgba(114,246,223,0.32),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(114,246,223,0.25),transparent_30%),linear-gradient(130deg,#35235f,#6d47a1,#36d2be)] border-y border-purple-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-purple-200">
          Ils nous font confiance
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {logos.map((company) => {
            const logoSrc = company.logoSrc || getCompanyLogo(company.name);
            return (
              <article
                key={company.name}
                className="flex items-center gap-3 rounded-full border border-purple-300/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(114,246,223,0.16))] px-4 py-2 backdrop-blur"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={`Logo ${company.name}`}
                      width={26}
                      height={26}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-purple-800">
                      {getCompanyInitials(company.name)}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-purple-50">{company.name}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


