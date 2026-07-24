import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const plus_Jakarta_Sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600"],
});

const jetBrains_Mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "InVitro-Code",
  description:
    "Aprende IA y Machine Learning con Python — aprendizaje interactivo para estudiantes de biotecnología",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${plus_Jakarta_Sans.variable} ${sora.className} ${jetBrains_Mono.variable}`}
      >
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
