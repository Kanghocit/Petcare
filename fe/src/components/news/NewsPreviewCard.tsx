"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "antd";
import dayjs from "dayjs";

interface Block {
  _id?: string;
  text?: string;
  image?: string;
}

interface NewsPreviewCardProps {
  news: {
    _id: string;
    title: string;
    content: string;
    image?: string;
    author: string;
    publishTime: string;
    blocks: Block[];
    slug: string;
    createdAt: string;
    status: string;
  };
}

const NewsPreviewCard: React.FC<NewsPreviewCardProps> = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Hình ảnh */}
      {news.image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Nội dung */}
      <div className="p-6">
        {/* Tiêu đề */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link href={`/news/${news.slug}`}>{news.title}</Link>
        </h3>

        {/* Tóm tắt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{news.content}</p>

        {/* Thông tin tác giả và thời gian */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{news.author}</span>
            <span>•</span>
            <span>{dayjs(news.createdAt).format("DD/MM/YYYY")}</span>
          </div>

          {/* Badge trạng thái */}
          <Tag
            color={
              news.status === "active"
                ? "green"
                : news.status === "pending"
                ? "orange"
                : "red"
            }
            className="text-sm"
          >
            {news.status}
          </Tag>
        </div>

        {/* Số khối nội dung */}
        {news.blocks && news.blocks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {news.blocks.length} khối nội dung
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPreviewCard;
