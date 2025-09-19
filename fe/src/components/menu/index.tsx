import { CAT_MENU, DOG_MENU } from "@/constants/menu";
import { PhoneOutlined, ShopOutlined } from "@ant-design/icons";
import MegaMenu from "./MegaMenu";
import Link from "next/link";

const Menu = () => {
  return (
    <ul className="bg-[#ff8662] flex items-center justify-center gap-20 px-3 text-[18px]  font-semibold">
      <li className="flex items-center justify-end gap-2 cursor-pointer ">
        <Link className="hover:!text-[#ffc902] !text-white" href="/">
          Trang chủ
        </Link>
      </li>
      <li className="flex items-center justify-end gap-2 cursor-pointer ">
        <Link className="hover:!text-[#ffc902] !text-white" href="/products">
          Sản phẩm
        </Link>
      </li>
      <MegaMenu label="Mua cho chó" menuData={DOG_MENU} />
      <MegaMenu label="Mua cho mèo" menuData={CAT_MENU} />
      <li className="flex items-center justify-center gap-2 cursor-pointer ">
        <Link
          className="hover:!text-[#ffc902] !text-white"
          href="/products?isSaleProduct=1"
        >
          <ShopOutlined /> Khuyễn mãi
        </Link>
      </li>
      <li className="flex items-center justify-center gap-2 cursor-pointer ">
        <Link className="hover:!text-[#ffc902] !text-white" href="/brands">
          Thương hiệu
        </Link>
      </li>
      <li className="flex items-center justify-center gap-2 cursor-pointer ">
        <Link className="hover:!text-[#ffc902] !text-white" href="/news">
          Blog thú cưng
        </Link>
      </li>
      <li className="flex items-center justify-center gap-2 cursor-pointer  ">
        <Link className="hover:!text-[#ffc902] !text-white" href="/contact">
          <PhoneOutlined /> Liên hệ
        </Link>
      </li>
    </ul>
  );
};
export default Menu;
