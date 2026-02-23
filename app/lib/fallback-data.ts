import type { CaseStudy, ReferenceItem, ServiceDomain } from "./types";

export const fallbackDomains: ServiceDomain[] = [
  {
    id: "formation-institutionnelle",
    slug: "formation-institutionnelle",
    name: "Formations professionnelles",
    shortDescription: "Montee en competence des equipes en contexte institutionnel.",
    description:
      "Conception et execution de programmes de formation techniques et manageriaux pour organismes publics et prives.",
    category: "Formations",
    audience: "Organisations",
    benefits: ["Plans pedagogiques sur mesure", "Sessions intra-entreprise", "Suivi post-formation"],
  },
  {
    id: "fourniture-montage",
    slug: "fourniture-montage",
    name: "Fourniture et montage",
    shortDescription: "Approvisionnement, acquisition et installation de solutions materiels.",
    description:
      "Pilotage de bout en bout des besoins en biens, equipements et installations pour operations critiques.",
    category: "Fourniture & montage",
    audience: "Organisations",
    benefits: ["Sourcing qualifie", "Coordination logistique", "Mise en service terrain"],
  },
  {
    id: "apport-affaires",
    slug: "apport-affaires",
    name: "Apport d'affaires et mise en relation",
    shortDescription: "Acceleration commerciale via un reseau cible.",
    description:
      "Structuration d'opportunites B2B, mise en relation qualifiee et accompagnement a la signature.",
    category: "Apport d'affaires",
    audience: "Organisations",
    benefits: ["Prospection ciblee", "Qualification des leads", "Suivi de conversion"],
  },
  {
    id: "sous-traitance-miniere",
    slug: "sous-traitance-miniere",
    name: "Sous-traitance miniere",
    shortDescription: "Prestations de support operationnel pour sites miniers.",
    description:
      "Accompagnement de projets miniers avec des services de terrain, fourniture et coordination d'execution.",
    category: "Mines",
    audience: "Organisations",
    benefits: ["Equipe dediee", "Respect des standards HSE", "Reporting d'avancement"],
  },
];

export const fallbackReferences: ReferenceItem[] = [
  {
    id: "ref-cfao",
    client: "CFAO Mobility",
    category: "Apport d'affaires",
    summary: "Apport d'affaires et mise en relation sur des opportunites multisectorielles.",
    location: "RDC",
  },
  {
    id: "ref-anapi",
    client: "ANAPI",
    category: "Formations",
    summary: "Programmes de formation cibles pour renforcement de capacites.",
    location: "Kinshasa",
  },
  {
    id: "ref-snel",
    client: "SNEL",
    category: "Formations",
    summary: "Sessions de formation operationnelle et accompagnement des equipes.",
    location: "RDC",
  },
  {
    id: "ref-regideso",
    client: "REGIDESO",
    category: "Fourniture & montage",
    summary: "Fourniture, acquisition et montage de solutions techniques.",
    location: "RDC",
  },
  {
    id: "ref-acgt",
    client: "ACGT",
    category: "Fourniture & montage",
    summary: "Interventions en tant que fournisseur et prestataire de services.",
    location: "RDC",
  },
  {
    id: "ref-sonal",
    client: "SONAL S.A.",
    category: "Apport d'affaires",
    summary: "Structuration d'opportunites commerciales et accompagnement business.",
    location: "RDC",
  },
  {
    id: "ref-kamoto",
    client: "Kamoto",
    category: "Mines",
    summary: "Sous-traitance miniere et support operationnel sur site.",
    location: "Katanga",
  },
  {
    id: "ref-kamoa",
    client: "Kamoa",
    category: "Mines",
    summary: "Prestations de sous-traitance et coordination d'execution terrain.",
    location: "Katanga",
  },
  {
    id: "ref-tenke",
    client: "Tenke Fungurume",
    category: "Mines",
    summary: "Appui operationnel et fourniture de services de support minier.",
    location: "Katanga",
  },
];

export const fallbackCaseStudies: CaseStudy[] = [
  {
    id: "cs-regideso-supply-rollout",
    slug: "regideso-supply-rollout",
    title: "Fourniture et montage pour un programme de deploiement technique",
    client: "REGIDESO",
    need: "Securiser un lot critique de fournitures et coordonner un montage multi-sites.",
    solution:
      "Pilotage du sourcing, planification logistique, supervision du montage et gouvernance d'avancement hebdomadaire.",
    result:
      "Execution cadree avec visibilite continue pour le client et reduction des interruptions operationnelles.",
    category: "Fourniture & montage",
  },
  {
    id: "cs-anapi-training-wave",
    slug: "anapi-training-wave",
    title: "Programme de formation institutionnelle sur plusieurs cohortes",
    client: "ANAPI",
    need: "Renforcer rapidement les competences d'equipes sur des enjeux metier prioritaires.",
    solution:
      "Construction d'un parcours sur mesure, sessions modules et evaluation continue des acquis.",
    result:
      "Amelioration mesurable des pratiques de travail et meilleure standardisation des processus internes.",
    category: "Formations",
  },
  {
    id: "cs-mining-subcontracting",
    slug: "mining-subcontracting-kamoa-kamoto-tenke",
    title: "Sous-traitance miniere a forte exigence de coordination",
    client: "Kamoa, Kamoto, Tenke Fungurume",
    need: "Delivrer des prestations terrain en environnement industriel avec contraintes severes.",
    solution:
      "Mise en place d'equipes dediees, routines HSE, reporting cadence et points de coordination operationnels.",
    result:
      "Stabilisation de l'execution terrain et meilleure predictibilite des interventions.",
    category: "Mines",
  },
];
