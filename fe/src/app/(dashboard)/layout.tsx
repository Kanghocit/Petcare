import "@/app/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Menu from "@/components/menu";
import { cookies } from "next/headers";
import { App } from "antd";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let userData = null;
  if (accessToken) {
    try {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          // headers: {
          //   // Dùng Authorization header, đây là tiêu chuẩn
          //   Authorization: `Bearer ${accessToken}`,
          // },
          credentials: "include",
        }
      );

      if (userRes.ok) {
        const data = await userRes.json();

        userData = data.user;
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  return (
    <App>
      <Header user={userData} />
      <Menu />
      {children}
      <Footer />
    </App>
  );
}
