import type { Metadata } from "next";
import { Roboto, Exo_2 } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/themes-provider";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-exo2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowTube – Stream, Discover, Create",
  description:
    "FlowTube is a next-gen video platform to stream, upload, and discover content from creators around the world.",
  keywords: [
    "FlowTube",
    "video streaming",
    "upload videos",
    "video sharing",
    "content creator",
    "YouTube alternative",
    "watch videos",
  ],
  authors: [{ name: "FlowTube Team", url: "https://flowtube.app" }],
  creator: "FlowTube",
  metadataBase: new URL("https://flowtube.app"),
  openGraph: {
    title: "FlowTube – Stream, Discover, Create",
    description:
      "Join FlowTube – the next-gen video platform to share, explore, and create content with a global community.",
    url: "https://flowtube.app",
    siteName: "FlowTube",
    images: [
      {
        url: "https://flowtube.app/og-image.jpg", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "FlowTube – Stream and Discover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowTube – Stream, Discover, Create",
    description:
      "Next-gen video sharing platform. Upload, discover, and watch content from creators worldwide.",
    images: ["https://flowtube.app/og-image.jpg"], // Match OpenGraph image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${exo2.variable} scrollbar scrollbar-none`}
      suppressHydrationWarning
    >
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
