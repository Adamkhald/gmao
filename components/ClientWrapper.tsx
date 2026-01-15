"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/components/UserProvider";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <Header />
        <main className="pt-20">{children}</main>
      </UserProvider>
    </ThemeProvider>
  );
}