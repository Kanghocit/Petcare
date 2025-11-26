import "@/app/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Menu from "@/components/menu";
import { getUser } from "@/actions";
import { App } from "antd";
import FloatingActionButton from "@/components/brands/FloatingActionButton";


// Force dynamic vì layout cần user data từ cookies
export const dynamic = "force-dynamic";

// Metadata will be overridden by child pages
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Xử lý error để tránh crash layout
  let userData = { user: null };
  try {
    userData = await getUser();
  } catch (error) {
    // Nếu getUser fail, vẫn render layout với user = null
    console.error("Failed to get user:", error);
  }

  return (
    <App>
      <div className="flex flex-col min-h-screen">
        <Header user={userData?.user || null} />
        <Menu />

        <main className="flex-grow">{children}</main>
        {/* Floating Action Buttons */}
        <FloatingActionButton />
        <Footer />
      </div>
    </App>
  );
}
