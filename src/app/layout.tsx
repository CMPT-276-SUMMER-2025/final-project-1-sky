import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/ui/footer";
import { Providers } from "./heroUI/providers";
import Navbar from "../components/ui/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travelytics",
  description: "Discover Canadian cities with real-time weather and detailed analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}