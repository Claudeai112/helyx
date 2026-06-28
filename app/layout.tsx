import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart/cart-provider";
import { AgeGate } from "@/components/age-gate";
import { AGE_COOKIE } from "@/lib/age";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Helyx Peptides — Peptide Research Supplies", template: "%s | Helyx Peptides" },
  description:
    "Helyx Peptides is a professional peptide research supply company offering high purity research peptides for laboratory and research use.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ageVerified = (await cookies()).get(AGE_COOKIE)?.value === "1";
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        {!ageVerified && <AgeGate />}
      </body>
    </html>
  );
}
