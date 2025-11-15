import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Liên hệ",
  description: "Liên hệ với Kangdy PetShop - Cửa hàng thú cưng uy tín tại Nghệ An. Địa chỉ, số điện thoại và bản đồ.",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

