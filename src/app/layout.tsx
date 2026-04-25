import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Lupon-Bot v2.0 | Barangay AI Assistant",
  description: "AI-driven platform translating citizen narratives into Katarungang Pambarangay reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-gray-100 min-h-screen antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 bg-[#050505]/70 backdrop-blur-2xl border-b border-white/[0.05] transition-all">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all shrink-0">
                LB
              </div>
              <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Lupon-Bot
              </span>
            </a>
            <div className="flex gap-6 items-center">
               <span className="text-sm font-medium text-gray-500">Local Mode</span>
            </div>
          </div>
        </nav>
        <main className="pt-28 pb-12 px-6 max-w-5xl mx-auto min-h-screen flex flex-col relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          {children}
        </main>
      </body>
    </html>
  );
}
