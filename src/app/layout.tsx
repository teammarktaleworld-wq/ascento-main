// // import type { Metadata } from "next";
// // import { Lexend } from "next/font/google";
// // import "./globals.css";

// // const lexend = Lexend({
// //   variable: "--font-lexend",
// //   subsets: ["latin"],
// //   display: "swap",
// // });

// // export const metadata: Metadata = {
// //   title: "Ascento Abacus - Unlock Your Child's Brain Power",
// //   description: "Advanced abacus training, mental arithmetic, brain gym, and related programs for children. Join our franchise family and start your own learning center.",
// //   keywords: "abacus training, mental arithmetic, brain gym, Vedic maths, handwriting improvement, calligraphy, children education, franchise opportunities",
// // };

// // import AuthGuard from "../components/AuthGuard";

// // export default function RootLayout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode;
// // }>) {
// //   return (
// //     <html lang="en">
// //       <head>
// //         <link
// //           href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
// //           rel="stylesheet"
// //         />
// //         <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
// //       </head>
// //       <body
// //         className={`${lexend.variable} antialiased font-sans`}
// //       >
// //         <AuthGuard>
// //           {children}
// //         </AuthGuard>
// //       </body>
// //     </html>
// //   );
// // }

// import type { Metadata } from "next";
// import { Lexend } from "next/font/google";
// import "./globals.css";

// import NavbarWrapper from "@/components/Navbarwrapper";
// import Footer from "@/components/Footer";

// const lexend = Lexend({
//   variable: "--font-lexend",
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Ascento Abacus - Unlock Your Child's Brain Power",
//   description:
//     "Advanced abacus training, mental arithmetic, brain gym, and related programs for children.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/icon?family=Material+Icons"
//           rel="stylesheet"
//         />
//       </head>

//       <body className={`${lexend.variable} antialiased font-sans`}>
//         {/* NavbarWrapper is "use client" — owns auth state, renders Navbar */}
//         <NavbarWrapper />

//         <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
//           {children}
//         </main>

//         {/* Footer has no client hooks — can stay a server component */}
//         <Footer />
//       </body>
//     </html>
//   );
// }







// // app/layout.tsx
// import type { Metadata } from "next";
// import { Lexend } from "next/font/google";
// import "./globals.css";

// import { AuthProvider } from "@/context/AuthContext";
// import NavbarWrapper from "@/components/Navbarwrapper";
// import Footer from "@/components/Footer";

// const lexend = Lexend({
//   variable: "--font-lexend",
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Ascento Abacus - Unlock Your Child's Brain Power",
//   description: "Advanced abacus training, mental arithmetic, brain gym, and related programs for children.",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
//         <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" rel="stylesheet" />
//       </head>
//       <body className={`${lexend.variable} antialiased font-sans`}>
//         <AuthProvider>
//           <NavbarWrapper />
//           <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
//             {children}
//           </main>
//           <Footer />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }







// app/layout.tsx
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/Navbarwrapper";
import FooterWrapper from "@/components/FooterWrapper"; // ← changed

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={`${lexend.variable} antialiased font-sans`}>
        <AuthProvider>
          <NavbarWrapper />
          <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
            {children}
          </main>
          <FooterWrapper /> {/* ← changed */}
        </AuthProvider>
      </body>
    </html>
  );
}