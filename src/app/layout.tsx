import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Providers } from "@/components/Providers";
import { CreatorFooter, CreatorHeader } from "@/components/CreatorLinks";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DSA Tracker | Kunal Kushwaha",
  description: "A beautifully designed DSA practice tracker based on Kunal Kushwaha's curriculum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex bg-background text-foreground transition-colors duration-300 relative overflow-x-hidden`}>
        {/* Decorative background glows */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-screen opacity-50" />
        </div>
        
        <Providers>
          <Sidebar />
          <main className="flex-1 lg:pl-64 flex flex-col min-h-screen z-10 relative">
            <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
              <CreatorHeader />
              {children}
              <CreatorFooter />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
