"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import { SpeechVoiceWarmup } from "@/components/layout/SpeechVoiceWarmup";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SpeechVoiceWarmup />
      <MobileShell>{children}</MobileShell>
    </>
  );
}
