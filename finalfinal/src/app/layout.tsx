import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solar Harmonics - Cosmic Music Weaver",
  description: "Transform your emotions into cosmic soundscapes with solar-powered musical intelligence. Powered by advanced AI and Spotify.",
  keywords: ["Solar Harmonics", "AI Music", "Spotify", "Playlist", "Cosmic Music", "Emotional Intelligence", "Gemini AI", "Solar Energy"],
  authors: [{ name: "Solar Harmonics Team" }],
  openGraph: {
    title: "Solar Harmonics - Cosmic Music Weaver",
    description: "Transform your emotions into cosmic soundscapes with solar-powered musical intelligence.",
    url: "https://chat.z.ai",
    siteName: "Solar Harmonics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Harmonics - Cosmic Music Weaver",
    description: "Transform your emotions into cosmic soundscapes with solar-powered musical intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="solar-dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="music-app-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
