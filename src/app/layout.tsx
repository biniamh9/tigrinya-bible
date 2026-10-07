import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tigrinya Bible", template: "%s | Tigrinya Bible" },
  description: "Read the Bible. Grow daily. Grow together.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ti">
      <body>
        <main className="mx-auto min-h-dvh max-w-2xl px-5 pb-28 pt-8">{children}</main>
        <MobileNavigation />
      </body>
    </html>
  );
}
