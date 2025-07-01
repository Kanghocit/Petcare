import { CAT_MENU, SALE_MENU } from "@/constants/menu";
import { PhoneOutlined, ShopOutlined } from "@ant-design/icons";
import MegaMenu from "./MegaMenu";
import Link from "next/link";

const Menu = () => {
  return (
    <ul className="bg-[#ff8662] flex items-center justify-center gap-20 px-3 text-xl text-white font-semibold ">
      <ul className="flex items-center justify-end gap-2 cursor-pointer hover:text-[#ffc902]">
        <Link href="/">Trang chủ</Link>
      </ul>
      <ul className="flex items-center justify-end gap-2 cursor-pointer hover:text-[#ffc902]">
        <Link href="/products">Sản phẩm</Link>
      </ul>
      <MegaMenu label="Mua cho chó" menuData={SALE_MENU} />
      <MegaMenu label="Mua cho mèo" menuData={CAT_MENU} />
      <li className="flex items-center justify-center gap-2 cursor-pointer hover:text-[#ffc902]">
        <ShopOutlined /> Today&apos;s Sale
      </li>
      <li className="flex items-center justify-center gap-2 cursor-pointer hover:text-[#ffc902]">
        Dịch vụ
      </li>
      <li className="flex items-center justify-center gap-2 cursor-pointer hover:text-[#ffc902]">
        Blog
      </li>
      <li className="flex items-center justify-center gap-2 cursor-pointer  hover:text-[#ffc902]">
        <Link href="/contact">
          <PhoneOutlined /> Liên hệ
        </Link>
      </li>
    </ul>
  );
};
export default Menu;
