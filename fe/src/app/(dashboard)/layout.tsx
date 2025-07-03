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
      <div className="flex flex-col min-h-screen">
        <Header user={userData.user} />
        <Menu />

        <main className="flex-grow">{children}</main>

        <Footer />
      </div>
    </App>
  );
}
