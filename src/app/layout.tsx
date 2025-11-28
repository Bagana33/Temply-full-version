import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Temply - Дизайнаа хурдан, гоё болго",
  description: "Мэргэжилтэн дизайнчилсан Canva загваруудыг таны гар хүрэхэд. Дизайнаа хурдан, гоё болго.",
  keywords: ["Temply", "Canva", "загвар", "дизайн", "Монгол", "template"],
  authors: [{ name: "Temply Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Temply - Дизайнаа хурдан, гоё болго",
    description: "Мэргэжилтэн дизайнчилсан Canva загваруудыг таны гар хүрэхэд",
    url: "https://temply.mn",
    siteName: "Temply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temply - Дизайнаа хурдан, гоё болго",
    description: "Мэргэжилтэн дизайнчилсан Canva загваруудыг таны гар хүрэхэд",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
