"use client";

import { Footer } from "./Footer";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";
import { Header } from "./Header";
import { StickyRfpCta } from "./StickyRfpCta";

type RouteShellProps = {
  children: React.ReactNode;
  currentPage?: string;
  whatsappContext?: string;
  hideStickyCta?: boolean;
};

const navigateToHashPage = (page: string) => {
  if (typeof window === "undefined") return;

  if (window.location.pathname === "/") {
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  window.location.href = `/#${page}`;
};

export function RouteShell({
  children,
  currentPage = "",
  whatsappContext = "home",
  hideStickyCta = false,
}: RouteShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f2ff,#ecfffa,#f2e9ff)]">
      <Header currentPage={currentPage} onNavigate={navigateToHashPage} />
      <main>{children}</main>
      <Footer onNavigate={navigateToHashPage} />
      {!hideStickyCta && <StickyRfpCta />}
      <FloatingWhatsAppButton context={whatsappContext} />
    </div>
  );
}

