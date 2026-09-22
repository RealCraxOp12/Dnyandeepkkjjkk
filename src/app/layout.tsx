import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { GlobalLayoutWrapper } from "@/components/layout/GlobalLayoutWrapper";

export const metadata: Metadata = {
  title: "Dnyandeep School Management",
  description: "School management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex h-screen bg-[#f4f7fe] dark:bg-[#0f172a] overflow-hidden print:h-auto print:overflow-visible print:bg-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GlobalLayoutWrapper>
            {children}
          </GlobalLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
