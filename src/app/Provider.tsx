// app/provider.tsx
"use client"; // این خط را اضافه کنید

import { SessionProvider } from "next-auth/react";
import { PrimeReactProvider } from "primereact/api";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PrimeReactProvider>{children}</PrimeReactProvider>
    </SessionProvider>
  );
}
