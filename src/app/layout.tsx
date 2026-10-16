import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { LoggerProvider } from "@/providers/logger-provider";
import { FaultProvider } from "@/components/system/fault-panel";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Learnify | Learning management system",
  description: "Courses, learning paths, and analytics for modern teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">
        <svg width="0" height="0" aria-hidden className="absolute">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <LoggerProvider>
          <ThemeProvider>
            <AuthProvider>
              <FaultProvider>{children}</FaultProvider>
            </AuthProvider>
          </ThemeProvider>
        </LoggerProvider>
      </body>
    </html>
  );
}
