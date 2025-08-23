import { getUser } from "@/actions";
import "@/app/globals.css";
import ProfileLayoutWrapper from "./ProfileLayoutWrapper";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUser();

  return (
    <ProfileLayoutWrapper user={userData.user}>{children}</ProfileLayoutWrapper>
  );
}
