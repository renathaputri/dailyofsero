import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyButton from "@/components/EmergencyButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MindSpace | Platform Kesehatan Mental & Komunitas",
  description: "Platform safe space kesehatan mental untuk bertumbuh, refleksi diri melalui jurnal terenkripsi, galeri karya Brand Ambassador, dan akses konseling resmi AwareMind.",
  keywords: ["mental health", "mindspace", "mind space", "tim serotonin batch 5", "tim serotonin", "self-care", "mindful journaling", "awaremind"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col relative selection:bg-sero-purple-200 selection:text-sero-purple-900">
        {/* Soft background ambient gradient */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-sero-blue-200/40 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-sero-purple-200/35 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-sero-blue-100/50 rounded-full blur-3xl opacity-50" />
        </div>

        <Navbar />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
        <EmergencyButton />
      </body>
    </html>
  );
}
