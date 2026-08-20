import type { Metadata, Viewport } from "next";
import { Fredoka, Inter } from "next/font/google";
import { ThemeRoot } from "@/components/theme/ThemeRoot";
import { viewportBootstrapScript } from "@/lib/viewport-bootstrap-script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fredoka",
});

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
  themeColor: "#3b82f6",
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
        <script dangerouslySetInnerHTML={{ __html: viewportBootstrapScript }} />
      </head>
      <body className={`${inter.variable} ${fredoka.variable} font-sans antialiased`}>
        <ThemeRoot>{children}</ThemeRoot>
      </body>
    </html>
  );
}
