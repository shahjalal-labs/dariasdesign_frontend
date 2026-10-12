"use client";

import { AuthSync } from "@/components/Auth/AuthSync";
import ReduxProvider from "@/redux/ReduxProvider";
// import ReduxProvider from "@/redux/ReduxProvider";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <AuthSync />
        {children}
        <Toaster />
      </ReduxProvider>
    </SessionProvider>
  );
}
