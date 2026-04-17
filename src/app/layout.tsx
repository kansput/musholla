import type { Metadata } from "next";
import { El_Messiri } from "next/font/google";
import "./globals.css";

// Inisialisasi Font El Messiri
const elMessiri = El_Messiri({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
});

export const metadata: Metadata = {
  title: "Display Musholla Al-Huda",
  description: "Jadwal Shalat PRM Rambutan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={elMessiri.variable}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-family-messiri)' }}>
        {children}
      </body>
    </html>
  );
}