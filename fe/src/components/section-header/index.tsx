import Link from "next/link";
import React from "react";

type SectionHeaderProps = {
  title: string;
  hasImg?: boolean;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  hasImg = true,
}) => {
  return (
    <Link href={`/category/${title}`}>
      <div className="flex items-center justify-center space-x-2 my-10 font-national-park">
        <h2 className="text-6xl font-semibold text-center text-orange-500">
          {title}
        </h2>
        {hasImg && (
          <img
            src="/images/icon-header.webp" // Chỉ đường dẫn ảnh cần chỉnh sửa
            alt="arrow-right"
            loading="lazy"
            className="w-10 h-10"
          />
        )}
      </div>
    </Link>
  );
};

export default SectionHeader;
