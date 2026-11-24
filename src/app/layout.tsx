import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Botani Mart — Katalog & Informasi Produk Pertanian",
  description:
    "Temukan benih, pupuk, pestisida nabati, dan alat pertanian lengkap dengan informasi penggunaannya. Asisten AI siap bantu rekomendasi.",
  keywords: [
    "Botani Mart",
    "pertanian",
    "benih",
    "pupuk",
    "pestisida nabati",
    "alat pertanian",
    "katalog produk",
    "asisten AI pertanian",
  ],
  authors: [{ name: "Botani Mart" }],
  openGraph: {
    title: "Botani Mart — Katalog Produk Pertanian",
    description:
      "Semua kebutuhan pertanian dalam satu tempat. Benih, pupuk, pestisida nabati, alat, & media tanam.",
    siteName: "Botani Mart",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Botani Mart",
    description: "Katalog & informasi produk pertanian.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
