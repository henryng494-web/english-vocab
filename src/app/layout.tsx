import type { Metadata, Viewport } from "next";
import { ThemeRoot } from "@/components/theme/ThemeRoot";
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
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#7c3aed",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: viewportBootstrapScript }} />
      </head>
      <body className="antialiased">
        <ThemeRoot>{children}</ThemeRoot>
      </body>
    </html>
  );
}
