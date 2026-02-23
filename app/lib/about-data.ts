export type CompanyMilestone = {
  period: string;
  title: string;
  description: string;
};

export type StrategicObjective = {
  title: string;
  description: string;
};

export type TeamProfile = {
  role: string;
  focus: string;
  description: string;
};

export const companyHistory: CompanyMilestone[] = [
  {
    period: "2017",
    title: "Lancement des activites",
    description:
      "GBH structure ses premiers services multisectoriels avec un positionnement qualite et execution terrain.",
  },
  {
    period: "2019",
    title: "Acceleration des partenariats",
    description:
      "Les collaborations avec institutions publiques et acteurs prives renforcent la credibilite B2B.",
  },
  {
    period: "2022",
    title: "Consolidation B2B",
    description:
      "Mise en place d'un flux de cadrage et reporting pour securiser les projets grands comptes.",
  },
  {
    period: "Aujourd'hui",
    title: "Croissance maitrisee",
    description:
      "GBH combine activites B2C recurrentes et contrats B2B structurants a forte valeur.",
  },
];

export const companyMission =
  "Accompagner les organisations et les particuliers avec des services fiables, traces et mesurables, tout en respectant la confidentialite et les engagements contractuels.";

export const strategicObjectives: StrategicObjective[] = [
  {
    title: "Executer sans rupture",
    description:
      "Maintenir un niveau de service stable, du cadrage initial au reporting final.",
  },
  {
    title: "Renforcer la confiance B2B",
    description:
      "Transformer les besoins en dossiers clairs, pour accelerer la decision et la contractualisation.",
  },
  {
    title: "Capitaliser sur les references",
    description:
      "Valoriser les missions realisees pour prouver la capacite de delivery sur des contextes exigeants.",
  },
  {
    title: "Faire evoluer la plateforme",
    description:
      "Digitaliser progressivement les parcours clients sans casser les flux deja en production.",
  },
];

export const teamProfiles: TeamProfile[] = [
  {
    role: "Direction generale",
    focus: "Vision et pilotage",
    description:
      "Definit les axes strategiques, arbitre les priorites et garantit la qualite des engagements.",
  },
  {
    role: "Operations",
    focus: "Execution terrain",
    description:
      "Coordonne les equipes, suit les livrables et assure la continuite des interventions.",
  },
  {
    role: "Partenariats & business",
    focus: "Developpement B2B",
    description:
      "Structure les opportunites, maintient la relation client et accompagne les consultations.",
  },
  {
    role: "Support & conformite",
    focus: "Qualite et securite",
    description:
      "Cadre les processus, protege les donnees sensibles et suit la conformite documentaire.",
  },
];

