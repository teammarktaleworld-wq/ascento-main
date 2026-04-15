import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ascento Abacus - Unlock Your Child's Brain Power",
  description: "Advanced abacus training, mental arithmetic, brain gym, and related programs for children. Join our franchise family and start your own learning center.",
  keywords: "abacus training, mental arithmetic, brain gym, Vedic maths, handwriting improvement, calligraphy, children education, franchise opportunities",
};

import AuthGuard from "./components/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body
        className={`${lexend.variable} antialiased font-sans`}
      >
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
