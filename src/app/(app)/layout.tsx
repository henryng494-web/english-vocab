"use client";

import { MobileShell } from "@/components/layout/MobileShell";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MobileShell>{children}</MobileShell>;
}
