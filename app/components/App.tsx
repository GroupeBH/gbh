"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HomePage } from "./HomePage";
import { ParticuliersPage } from "./ParticuliersPage";
import { OrganisationsPage } from "./OrganisationsPage";
import { DomainesPage } from "./DomainesPage";
import { RdvPage } from "./RdvPage";
import { ContactPage } from "./ContactPage";
import { AdminPage } from "./AdminPage";
import { AdminRegisterPage } from "./AdminRegisterPage";
import { LegalNoticePage } from "./LegalNoticePage";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";
import { TermsPage } from "./TermsPage";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";
import { StickyRfpCta } from "./StickyRfpCta";
import { PushNotificationsManager } from "./PushNotificationsManager";

type Page =
  | "home"
  | "particuliers"
  | "organisations"
  | "domaines"
  | "rdv"
  | "contact"
  | "admin"
  | "register"
  | "mentions-legales"
  | "politique-confidentialite"
  | "conditions-utilisation";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (typeof window !== "undefined") {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const pages: Page[] = [
      "home",
      "particuliers",
      "organisations",
      "domaines",
      "rdv",
      "contact",
      "admin",
      "register",
      "mentions-legales",
      "politique-confidentialite",
      "conditions-utilisation",
    ];

    const readHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (pages.includes(hash as Page)) {
        setCurrentPage(hash as Page);
      }
    };

    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "particuliers":
        return <ParticuliersPage onNavigate={handleNavigate} />;
      case "organisations":
        return <OrganisationsPage onNavigate={handleNavigate} />;
      case "domaines":
        return <DomainesPage onNavigate={handleNavigate} />;
      case "rdv":
        return <RdvPage onNavigate={handleNavigate} />;
      case "contact":
        return <ContactPage />;
      case "admin":
        return <AdminPage onNavigate={handleNavigate} />;
      case "register":
        return <AdminRegisterPage onNavigate={handleNavigate} />;
      case "mentions-legales":
        return <LegalNoticePage onNavigate={handleNavigate} />;
      case "politique-confidentialite":
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case "conditions-utilisation":
        return <TermsPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f2ff,#ecfffa,#f2e9ff)]">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
      <StickyRfpCta />
      <FloatingWhatsAppButton context={currentPage} />
      <PushNotificationsManager />
    </div>
  );
}

