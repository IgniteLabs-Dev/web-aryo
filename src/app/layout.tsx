import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/data-provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Web Aryo - Portfolio Landing Page",
  description: "Hi, I'm Aryo. Multi-disciplinary professional in Web Development, Finance & Accounting, and Property Management.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#030c17] text-slate-100 selection:bg-brand-yellow selection:text-[#030c17]">
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
