import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { ThemeRoot } from "@/components/theme/ThemeRoot";
import { inter, nunito } from "@/lib/fonts";
import { viewportBootstrapScript } from "@/lib/viewport-bootstrap-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Vocab",
  description: "English vocabulary learning app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "English Vocab",
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
  themeColor: "#18c8b8",
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
