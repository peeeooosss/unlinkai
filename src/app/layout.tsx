import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniLinkAI - Your Bridge to Global Education",
  description: "Streamline international admissions with AI-powered matching, document handling, and visa intelligence. One platform for students, agents, and universities.",
  keywords: ["education agents", "study abroad", "university applications", "student visa", "international education", "AI education platform"],
  authors: [{ name: "UniLinkAI" }],
  creator: "UniLinkAI",
  publisher: "UniLinkAI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://unilinkai.com",
    title: "UniLinkAI - Your Bridge to Global Education",
    description: "Streamline international admissions with AI-powered matching, document handling, and visa intelligence. One platform for students, agents, and universities.",
    siteName: "UniLinkAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniLinkAI - Your Bridge to Global Education",
    description: "Streamline international admissions with AI-powered matching, document handling, and visa intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-neutral-900">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
