type CompanyLogoEntry = {
  aliases: string[];
  logoSrc: string;
};

const logoEntries: CompanyLogoEntry[] = [
  {
    aliases: ["cfao mobility", "cfao"],
    logoSrc: "/cfao.png",
  },
  {
    aliases: ["anapi"],
    logoSrc: "/anapi.png",
  },
  {
    aliases: ["snel"],
    logoSrc: "/snel.jpg",
  },
  {
    aliases: ["regideso"],
    logoSrc: "/regideso.webp",
  },
  {
    aliases: ["acgt"],
    logoSrc: "/acgt.png",
  },
  {
    aliases: ["sonal s.a.", "sonal sa", "sonal"],
    logoSrc: "/sonal.png",
  },
  {
    aliases: ["kamoto"],
    logoSrc: "/kamoto.svg",
  },
  {
    aliases: ["kamoa"],
    logoSrc: "/kamoa.png",
  },
  {
    aliases: ["tenke fungurume", "tenke"],
    logoSrc: "/tenkefungurume.png",
  },
];

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");

export const getCompanyLogo = (companyName?: string): string | undefined => {
  if (!companyName) return undefined;
  const normalizedName = normalizeName(companyName);

  for (const entry of logoEntries) {
    const hasMatch = entry.aliases.some((alias) => {
      const normalizedAlias = normalizeName(alias);
      return (
        normalizedName === normalizedAlias ||
        normalizedName.includes(normalizedAlias)
      );
    });

    if (hasMatch) return entry.logoSrc;
  }

  return undefined;
};

export const getCompanyInitials = (companyName: string): string => {
  const words = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) return "GBH";
  return words.map((word) => word[0]?.toUpperCase() || "").join("");
};

export type TrustedCompany = {
  name: string;
  logoSrc?: string;
};

export const trustedCompanies: TrustedCompany[] = [
  { name: "CFAO Mobility", logoSrc: getCompanyLogo("CFAO Mobility") },
  { name: "ANAPI", logoSrc: getCompanyLogo("ANAPI") },
  { name: "SNEL", logoSrc: getCompanyLogo("SNEL") },
  { name: "REGIDESO", logoSrc: getCompanyLogo("REGIDESO") },
  { name: "ACGT", logoSrc: getCompanyLogo("ACGT") },
  { name: "SONAL S.A.", logoSrc: getCompanyLogo("SONAL S.A.") },
  { name: "Kamoto", logoSrc: getCompanyLogo("Kamoto") },
  { name: "Kamoa", logoSrc: getCompanyLogo("Kamoa") },
  { name: "Tenke Fungurume", logoSrc: getCompanyLogo("Tenke Fungurume") },
];
