"use client";

import { Typography, Image, Space } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import dayjs from "dayjs";
const { Title, Paragraph, Text } = Typography;

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  publishTime: string;
  author: string;
  createdAt: string;
  status: string;
  blocks: {
    _id?: string;
    text?: string;
    image?: string;
  }[];
}

const NewDescription = ({ news }: { news: News }) => {
  return (
    <div className="space-y-6">
      {/* Header giống như trang web thật */}
      <div className="text-center border-b pb-8">
        <Title
          level={1}
          className="mb-6 text-4xl font-bold text-gray-900 leading-tight"
        >
          {news.title}
        </Title>
        <Space className="text-gray-600 text-xl" size="large">
          <Text>
            <UserOutlined className="mr-2" />
            {news.author}
          </Text>
          <Text>
            <CalendarOutlined className="mr-2" />
            {dayjs(news.createdAt).format("DD/MM/YYYY")}
          </Text>
        </Space>
      </div>

      {/* Hình ảnh chính */}
      {news.image && (
        <div className="text-center">
          <Image
            src={news.image}
            alt={news.title}
            width={800}
            height={300}
            style={{ objectFit: "contain", maxHeight: "500px" }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        </div>
      )}

      {/* Nội dung chi tiết */}
      {news.blocks && news.blocks.length > 0 && (
        <div className="space-y-8">
          {news.blocks.map((block, index) => (
            <div key={block._id || index} className="space-y-6">
              {block.text && (
                <Paragraph className="text-gray-800 text-xl leading-relaxed">
                  {block.text}
                </Paragraph>
              )}
              {block.image && (
                <div className="text-center my-8">
                  <Image
                    src={block.image}
                    alt={`Hình ảnh ${index + 1}`}
                    width={800}
                    height={300}
                    style={{ objectFit: "contain", maxHeight: "500px" }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewDescription;
