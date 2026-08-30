"use client";

import { MobileShell } from "@/components/layout/MobileShell";
import { PronounceAudio } from "@/components/layout/PronounceAudio";
import { SpeechVoiceWarmup } from "@/components/layout/SpeechVoiceWarmup";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PronounceAudio />
      <SpeechVoiceWarmup />
      <MobileShell>{children}</MobileShell>
    </>
  );
}
