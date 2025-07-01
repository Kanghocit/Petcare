import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from "next/font/google";

export const metadata: Metadata = {
  title: "PetCare",
  description: "PetCare",
};

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className}>{children}</body>
    </html>
  );
}
