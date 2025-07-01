import { CalendarOutlined } from "@ant-design/icons";
import Image from "next/image";
import React from "react";
import Button from "../button";

const NewPostCard = () => {
  return (
    <div className="">
      <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
        <Image
          src="/images/news-img.webp"
          alt="new-post-card"
          width={300}
          height={200}
          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-300"
        />
      </div>
      <div className="p-4">
        <h2 className="font-bold text-lg mb-2 hover:text-primary cursor-pointer transition-all duration-300">
          7 Lợi Ích Cỏ Lúa Mì Cho Mèo Bạn Không Nên Bỏ Qua
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Cỏ lúa mì là gì? Vì sao bạn phải nên cho mèo cưng dùng cỏ lúa mì cho
          mèo? Bài viết này, hãy để Paddy...
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-400 text-sm gap-2">
            <CalendarOutlined />
            09/10/2024
          </div>
          <Button className="bg-primary text-white">Xem chi tiết</Button>
        </div>
      </div>
    </div>
  );
};

export default NewPostCard;
