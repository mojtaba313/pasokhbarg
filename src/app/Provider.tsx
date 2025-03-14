"use client";

import { SessionProvider } from "next-auth/react";
import { PrimeReactProvider } from "primereact/api";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document.querySelectorAll(".blob").forEach((blob) => {
        (blob as unknown as HTMLElement).style.animation = "none";
      });
    }
  }, []);

  return (
    <SessionProvider>
      <PrimeReactProvider>{children}</PrimeReactProvider>
    </SessionProvider>
  );
}
