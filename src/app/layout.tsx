import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { CreatorFooter } from "@/components/CreatorLinks";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "DSA Tracker",
  description: "Track your progress through Kunal Kushwaha's and Pratyush's DSA sheets.",
};

export const viewport: Viewport = {
  themeColor: "#0a0c0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <Nav />
          <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col px-4 pb-28 pt-8 md:px-6 md:pb-10 md:pt-12">
            <div className="mb-16">{children}</div>
            <CreatorFooter />
          </main>
        </Providers>
      </body>
    </html>
  );
}
