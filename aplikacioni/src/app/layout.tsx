import type { Metadata } from "next";
import "./globals.css";
import Pwa from "@/components/Pwa";

export const metadata: Metadata = {
  title: "RideShare",
  description: "Udhëtimet për AAB",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq">
      <body><Pwa />{children}</body>
    </html>
  );
}
