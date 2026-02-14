import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vox Mission Control",
  description: "Habits, tasks, and second brain for BAJI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-50`}
      >
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
          <header className="border-b border-white/10 bg-zinc-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300">
                  V
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Vox Mission Control
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    One place for habits, tasks, and your second brain.
                  </span>
                </div>
              </div>
              <nav className="flex items-center gap-2 text-xs md:gap-3">
                <a
                  href="/"
                  className="rounded-full bg-zinc-800/70 px-3 py-1 text-zinc-200 hover:bg-zinc-700"
                >
                  Dashboard
                </a>
                <a
                  href="/second-brain"
                  className="rounded-full bg-zinc-900/40 px-3 py-1 text-zinc-300 hover:bg-zinc-700/70"
                >
                  Second brain
                </a>
                <span className="rounded-full bg-zinc-900/40 px-3 py-1 text-zinc-500">
                  Habits (soon)
                </span>
                <span className="rounded-full bg-zinc-900/40 px-3 py-1 text-zinc-500">
                  Tasks (soon)
                </span>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
