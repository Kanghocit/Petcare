"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import Language from "./Language";
import { Avatar, Badge, Dropdown, MenuProps } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";

import { App } from "antd";
import { useRouter } from "next/navigation";
import CartDrawer from "@/components/cart-drawer";
import useCartStore from "@/store/cart-store";

interface HeaderProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { message } = App.useApp();
  const router = useRouter();
  const cartCount = useCartStore((s) => s.cart.length);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success(data.message);
        router.push("/login");
      } else {
        message.error(data.message || "Đăng xuất thất bại");
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error?.message || "Đăng xuất thất bại");
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="/profile">Trang cá nhân</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: (
        <a rel="noopener noreferrer" onClick={handleLogout}>
          Đăng xuất
        </a>
      ),
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const itemsAuth: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="/login">Đăng nhập</Link>,
      icon: <LoginOutlined />,
    },
    {
      key: "2",
      label: <Link href="/register">Đăng ký</Link>,
      icon: <UserAddOutlined />,
    },
  ];

  return (
    <header className="flex items-center justify-center bg-white px-3 py-2 gap-8 sticky top-0 z-[100] w-full shadow-sm min-h-[80px]">
      <Link href="/" className="!ms-5 gap-2 flex-shrink-0">
        <Image src="/images/logo.webp" alt="logo" width={150} height={100} priority />
      </Link>
      <SearchBar />
      <div className="flex items-center justify-around gap-2 flex-shrink-0">
        <Language />

        {user ? (
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar size="large" style={{ backgroundColor: "#f56a00" }}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>

              <div className="flex flex-col items-start text-sm">
                <p>Tài khoản</p>
                <p className="font-semibold">{user.name || "User"}</p>
              </div>
            </div>
          </Dropdown>
        ) : (
          <Dropdown menu={{ items: itemsAuth }} placement="bottomRight" arrow>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar size="large">
                <UserOutlined />
              </Avatar>

              <div className="flex flex-col items-start text-sm">
                <p>Tài khoản</p>
                <p className="font-semibold">Đăng nhập</p>
              </div>
            </div>
          </Dropdown>
        )}

        <CartDrawer>
          <button className="text-xl flex items-center gap-2 cursor-pointer rounded-xl p-3">
            <Badge count={cartCount}>
              <ShoppingCartOutlined style={{ fontSize: 24 }} />
            </Badge>
            <p className="text-[16px]">Giỏ hàng</p>
          </button>
        </CartDrawer>
      </div>
    </header>
  );
};

export default Header;
