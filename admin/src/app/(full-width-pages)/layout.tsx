import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kangdy Admin ",
  description: "Kangdy",
  // other metadata
};

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
