import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { ThemeRoot } from "@/components/theme/ThemeRoot";
import { themeBootstrapScript } from "@/lib/theme-bootstrap-script";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className={`${nunito.className} antialiased`}>
        <ThemeRoot>{children}</ThemeRoot>
      </body>
    </html>
  );
}
