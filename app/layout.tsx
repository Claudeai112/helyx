import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AmbientBackground } from "@/components/ambient-background";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LenisProvider } from "@/components/lenis-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { PageTransition } from "@/components/page-transition";
import { GlobalWebglBackground } from "@/components/webgl/global-background";
import { ScrollTimeline } from "@/components/webgl/scroll-timeline";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Helyx | Provider-Guided Peptide Therapy",
    template: "%s | Helyx",
  },
  description:
    "Premium, provider-guided peptide protocols. GLP-1, recovery, longevity and " +
    "performance peptides — prescribed and fulfilled through licensed partners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <GlobalWebglBackground />
        {/* Soft global dim — just a little lift so the scene doesn't
            blow out the darker page regions. No blur, no curtain. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-[9] bg-[#050510]/20"
        />
        <LenisProvider>
          <AmbientBackground />
          <Navbar />
          <main className="relative z-[2]">{children}</main>
          <Footer />
          <ScrollTimeline />
        </LenisProvider>
        {/* Page-wide edge vignette for copy legibility */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[3]"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 45%, rgba(5,5,16,0.55) 100%)",
          }}
        />
        <CustomCursor />
        <PageTransition />
      </body>
    </html>
  );
}
