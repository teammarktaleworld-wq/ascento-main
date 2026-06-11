

import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/mainpagecomponents/Navbarwrapper";
import FooterWrapper from "@/components/mainpagecomponents/FooterWrapper";
import MainWrapper from "@/components/mainpagecomponents/MainWrapper";
import AscentoChatbot from "@/components/AscentoChatbot/Ascentochatbot";

export const metadata: Metadata = {
  title: "Ascento Abacus - Unlock Your Child's Brain Power",
  description: "Advanced abacus training, mental arithmetic, brain gym, and related programs for children.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>
          <NavbarWrapper />
          <MainWrapper>{children}</MainWrapper>
          <FooterWrapper />
          <AscentoChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}