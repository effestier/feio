import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FEIO — Classic Digital Library",
  description:
    "Browse millions of free books. Read classics from Project Gutenberg, Internet Archive, and more. Download in any format. Your library, everywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-cream text-ink antialiased flex flex-col">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F3EE] via-[#FAF7F2] to-[#F0EAE0]" />
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, rgba(139,58,46,0.2) 0%, rgba(139,58,46,0.03) 40%, transparent 70%)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, #8B7355 40px, #8B7355 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #8B7355 40px, #8B7355 41px)`,
            }}
          />
        </div>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
