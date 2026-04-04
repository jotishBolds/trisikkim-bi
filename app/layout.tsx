import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutShell from "@/components/LayoutShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tribal Research Institute & Training Centre – Government of Sikkim",
  description:
    "Official website of the Tribal Research Institute & Training Centre, Social Welfare Department, Government of Sikkim.",
  icons: [
    { rel: "icon", url: "/favicon/favicon.ico" },
    { rel: "icon", url: "/favicon/favicon-16x16.png", sizes: "16x16" },
    { rel: "icon", url: "/favicon/favicon-32x32.png", sizes: "32x32" },
    { rel: "apple-touch-icon", url: "/favicon/apple-touch-icon.png" },
    {
      rel: "icon",
      url: "/favicon/android-chrome-192x192.png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      url: "/favicon/android-chrome-512x512.png",
      sizes: "512x512",
    },
  ],
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
