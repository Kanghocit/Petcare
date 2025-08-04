'use client'

import React from 'react'
import { Typography, Image, Tag, Space, Button, Modal } from 'antd'
import { EyeOutlined, CalendarOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const { Title, Paragraph, Text } = Typography

interface Block {
  _id?: string
  text?: string
  image?: string
}

interface NewsArticlePreviewProps {
  news: {
    _id: string
    title: string
    content: string
    image?: string
    author: string
    publishTime: string
    blocks: Block[]
    slug: string
    createdAt: string
    status: string
  }
  shape?: "circle" | "default"
  size?: "small" | "middle" | "large"
}

const NewsArticlePreview: React.FC<NewsArticlePreviewProps> = ({ news , shape = "circle" , size = "small" }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi })
    } catch {
      return dateString
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button className="!color-blue-500 !border-blue-500 hover:!text-blue-400 hover:!border-blue-400"
          size={size}
          shape={shape}
          variant="outlined"
          icon={<EyeOutlined className="!text-blue-400 " />}
          onClick={showModal}
      />

      <Modal
        title={
          <div className="flex items-center justify-between">
            <span>Preview Bài Viết</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <div className="space-y-6">
          {/* Header giống như trang web thật */}
          <div className="text-center border-b pb-6">
            <Title level={1} className="mb-4 text-3xl font-bold text-gray-900">
              {news.title}
            </Title>
            <Space className="text-gray-600 text-lg">
              <Text>
                <UserOutlined className="mr-2" />
                {news.author}
              </Text>
              <Text>
                <CalendarOutlined className="mr-2" />
                {formatDate(news.createdAt)}
              </Text>
              <Tag color={news.status === "active" ? "green" : news.status === "pending" ? "orange" : "red"} className="text-sm">{news.status}</Tag>
            </Space>
          </div>

          {/* Hình ảnh chính */}
          {news.image && (
            <div className="text-center">
              <Image
                src={news.image}
                alt={news.title}
                width="100%"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </div>
          )}

          {/* Nội dung tóm tắt */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Title level={3} className="mb-3 text-xl font-semibold">
              Tóm tắt
            </Title>
            <Paragraph className="text-gray-700 text-lg leading-relaxed">
              {news.content}
            </Paragraph>
          </div>

          {/* Nội dung chi tiết */}
          {news.blocks && news.blocks.length > 0 && (
            <div className="space-y-6">
              <Title level={3} className="text-xl font-semibold border-b pb-2">
                Nội dung chi tiết
              </Title>
              {news.blocks.map((block, index) => (
                <div key={block._id || index} className="space-y-4">
                  {block.text && (
                    <Paragraph className="text-gray-800 text-lg leading-relaxed">
                      {block.text}
                    </Paragraph>
                  )}
                  {block.image && (
                    <div className="text-center my-6">
                      <Image
                        src={block.image}
                        alt={`Hình ảnh ${index + 1}`}
                        width="100%"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer với thông tin bổ sung */}
          <div className="bg-gray-100 p-6 rounded-lg mt-8">
            <Title level={4} className="mb-4 text-lg font-semibold">
              Thông tin bài viết
            </Title>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Text strong>Tác giả:</Text>
                <br />
                <Text className="text-gray-700">{news.author}</Text>
              </div>
              <div>
                <Text strong>Ngày tạo:</Text>
                <br />
                <Text className="text-gray-700">{formatDate(news.createdAt)}</Text>
              </div>
              {news.publishTime && (
                <div>
                  <Text strong>Thời gian xuất bản:</Text>
                  <br />
                  <Text className="text-gray-700">{news.publishTime}</Text>
                </div>
              )}
              <div>
                <Text strong>Trạng thái:</Text>
                <br />
                <Tag color={news.status === "active" ? "green" : news.status === "pending" ? "orange" : "red"} className="text-sm">{news.status}</Tag>
              </div>
            </div>
          </div>

          {/* Thông báo đây là preview */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
              <InfoCircleOutlined className="!text-blue-400" />
              </div>
              <div className="ml-3 flex gap-2">
                <Text className="text-blue-800 font-medium">
                  Đây là preview của bài viết
                </Text>
                <Text className="text-blue-700 text-sm">
                  Cách bài viết sẽ hiển thị trên trang web sau khi được sắp xếp và hiển thị
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default NewsArticlePreview 