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
  title: "Botani Mart IPB — The One Stop Garden Shop",
  description:
    "Katalog & toko tanaman resmi Botani Mart IPB University: bibit tanaman buah, tanaman hias, tabulampot, aneka benih sayuran & varietas IPB, media tanam, pupuk, dan peralatan berkebun. Buka setiap hari 08.00-16.00 WIB di Kampus IPB Dramaga, Bogor.",
  keywords: [
    "Botani Mart",
    "Botani Mart IPB",
    "tanaman hias",
    "bibit tanaman buah",
    "tabulampot",
    "benih varietas IPB",
    "media tanam",
    "pupuk",
    "peralatan berkebun",
    "urban farming",
    "IPB University",
    "Bogor",
  ],
  authors: [{ name: "Botani Mart — DPUK IPB University" }],
  openGraph: {
    title: "Botani Mart IPB — The One Stop Garden Shop",
    description:
      "Koleksi tanaman pilihan, bibit unggul, benih varietas IPB, media tanam, dan peralatan berkebun. Langsung dari Kampus IPB Dramaga, Bogor.",
    siteName: "Botani Mart",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Botani Mart IPB — The One Stop Garden Shop",
    description: "Katalog & toko tanaman resmi Botani Mart IPB University.",
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
