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

type Page =
  | "home"
  | "particuliers"
  | "organisations"
  | "domaines"
  | "rdv"
  | "contact"
  | "admin";

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
