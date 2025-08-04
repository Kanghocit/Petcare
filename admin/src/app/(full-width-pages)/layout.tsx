import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Petcare Admin ",
  description: "Petcare",
  // other metadata
};

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
