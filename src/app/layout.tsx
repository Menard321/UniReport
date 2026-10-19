import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { StartupLoader } from "@/components/ui/StartupLoader";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://unireport.tz"),
  title: "UniReportTZ | Academic Reports, Built Around Your University",
  description: "AI-powered academic research, reporting, writing assistance, and data analysis tailored for modern Tanzanian and global academic standards.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <StartupLoader />
        {children}
      </body>
    </html>
  );
}
