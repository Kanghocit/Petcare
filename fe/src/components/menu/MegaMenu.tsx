"use client";

import { useState } from "react";
import Link from "next/link";
import { DownOutlined } from "@ant-design/icons";

type MenuCategory = {
  title: string;
  path: string;
};

interface MegaMenuProps {
  label: string;
  menuData: MenuCategory[];
}

const MegaMenu: React.FC<MegaMenuProps> = ({ label, menuData }) => {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="relative flex items-center cursor-pointer py-4 px-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="flex items-center">
        {label} <DownOutlined className="ms-1 text-[15px]" />
      </span>

      {/* Menu dropdown */}
      <div
        className={`absolute top-full left-0 bg-white text-black shadow-xl p-6 gap-4 z-50 rounded-lg transition-all duration-500 ease-in-out transform ${
          open
            ? "translate-y-0 opacity-100 visible"
            : "translate-y-4 opacity-0 invisible"
        }`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(1, 1fr)`,
          width: `30vh`,
        }}
      >
        {menuData.map((category, idx) => (
          <div key={idx} className="ms-25">
            <Link href={category?.path} className="hover:text-orange-600">
              <h4 className="font-semibold text-[20px] mb-3 hover:text-orange-600">
                {category.title} 🐈
              </h4>
            </Link>
          </div>
        ))}
      </div>
    </li>
  );
};

export default MegaMenu;
