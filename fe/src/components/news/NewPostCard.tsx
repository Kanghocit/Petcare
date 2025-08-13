"use client";

import { CalendarOutlined } from "@ant-design/icons";
import Image from "next/image";
import React from "react";
import Button from "../button";
import { useRouter } from "next/navigation";

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  publishTime: string;
  slug: string;
}

const NewPostCard = ({
  isCard = false,
  data,
}: {
  isCard: boolean;
  data?: News;
}) => {
  const { title, content, image, publishTime, slug } = data || {};
  const router = useRouter();
  return (
    <div className={`${isCard ? "flex flex-col" : "flex gap-4 w-full"}`}>
      <div
        className={`${
          isCard
            ? "w-full h-[200px] overflow-hidden rounded-t-lg"
            : "w-1/6 h-full flex-shrink-0"
        }`}
        onClick={() => {
          router.push(`/news/${slug}`);
        }}
      >
        <Image
          src={image || ""}
          alt="new-post-card"
          width={300}
          height={200}
          className="min-w-[250px] object-cover cursor-pointer hover:scale-105 transition-all duration-300 rounded-lg object-center"
        />
      </div>
      <div className={`pe-8 ${!isCard && "flex-1"}`}>
        <h2 className="font-bold text-lg mb-2 hover:text-primary cursor-pointer transition-all duration-300 line-clamp-1">
          {title}
        </h2>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{content}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-400 text-sm gap-2">
            <CalendarOutlined />
            {new Date(publishTime || "").toLocaleDateString("vi-VN")}
          </div>
          {isCard && (
            <Button
              className="bg-primary text-white"
              onClick={() => {
                router.push(`/news/${slug}`);
              }}
            >
              Xem chi tiết
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPostCard;
