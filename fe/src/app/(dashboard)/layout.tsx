import "@/app/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Menu from "@/components/menu";
import { getUser } from "@/action";
import { App } from "antd";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUser();

  return (
    <App>
      <Header user={userData.user} />
      <Menu />
      {children}
      <Footer />
    </App>
  );
}
