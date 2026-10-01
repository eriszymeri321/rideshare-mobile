import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare",
  description: "Udhëtimet për AAB",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
