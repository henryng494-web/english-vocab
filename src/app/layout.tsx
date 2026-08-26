import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { ThemeRoot } from "@/components/theme/ThemeRoot";
import { inter, nunito } from "@/lib/fonts";
import { viewportBootstrapScript } from "@/lib/viewport-bootstrap-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jungle Jokers",
  description: "Learn English vocabulary with the Jungle Jokers mascots",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jungle Jokers",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f8fafc",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${nunito.variable}`}
      style={
        {
          "--font-inter": inter.style.fontFamily,
          "--font-fredoka": nunito.style.fontFamily,
        } as CSSProperties
      }
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: viewportBootstrapScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeRoot>{children}</ThemeRoot>
      </body>
    </html>
  );
}
