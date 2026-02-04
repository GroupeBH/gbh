"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HomePage } from "./HomePage";
import { ParticuliersPage } from "./ParticuliersPage";
import { OrganisationsPage } from "./OrganisationsPage";
import { DomainesPage } from "./DomainesPage";
import { RdvPage } from "./RdvPage";
import { ContactPage } from "./ContactPage";

type Page =
  | "home"
  | "particuliers"
  | "organisations"
  | "domaines"
  | "rdv"
  | "contact";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}
