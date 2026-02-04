import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const headingFont = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Groupe B-Holding Sarl",
  description:
    "Entreprise multiservices en RDC : conseil, intelligence, numérique, fourniture et accompagnement sur mesure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
