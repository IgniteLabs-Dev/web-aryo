import type { Metadata } from "next";
import { DataProvider } from "@/lib/data-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aryo Portfolio",
  description: "Web Developer, Financial Analyst, Property Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030c17] text-slate-100 antialiased">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
