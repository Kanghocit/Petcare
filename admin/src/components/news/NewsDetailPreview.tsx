'use client'

import React from 'react'
import { Button, Modal, Typography, Image, Tag, Space } from 'antd'
import { EyeOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const { Title, Paragraph, Text } = Typography

interface Block {
  _id?: string
  text?: string
  image?: string
}

interface NewsDetailPreviewProps {
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
  disabled?: boolean
}

const NewsDetailPreview: React.FC<NewsDetailPreviewProps> = ({ news, disabled = false }) => {
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
      <Button
        type="primary"
        icon={<EyeOutlined />}
        size="large"
        onClick={showModal}
        disabled={disabled || news.status !== 'active'}
        className="w-full"
      >
        Xem Preview Bài Viết
      </Button>

      <Modal
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Preview Bài Viết</span>
            <Button 
              icon={<ArrowLeftOutlined />} 
              size="small"
              onClick={handleCancel}
            >
              Đóng
            </Button>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        <div className="space-y-6">
          {/* Header giống như trang web thật */}
          <div className="text-center border-b pb-8">
            <Title level={1} className="mb-6 text-4xl font-bold text-gray-900 leading-tight">
              {news.title}
            </Title>
            <Space className="text-gray-600 text-xl" size="large">
              <Text>
                <UserOutlined className="mr-2" />
                {news.author}
              </Text>
              <Text>
                <CalendarOutlined className="mr-2" />
                {formatDate(news.createdAt)}
              </Text>
              <Tag color="green" className="text-base px-3 py-1">{news.status}</Tag>
            </Space>
          </div>

          {/* Hình ảnh chính */}
          {news.image && (
            <div className="text-center">
              <Image
                src={news.image}
                alt={news.title}
                width="100%"
                style={{ maxHeight: '600px', objectFit: 'cover' }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </div>
          )}

          {/* Nội dung tóm tắt */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <Title level={2} className="mb-4 text-2xl font-semibold text-gray-800">
              Tóm tắt
            </Title>
            <Paragraph className="text-gray-700 text-xl leading-relaxed">
              {news.content}
            </Paragraph>
          </div>

          {/* Nội dung chi tiết */}
          {news.blocks && news.blocks.length > 0 && (
            <div className="space-y-8">
              <Title level={2} className="text-2xl font-semibold border-b pb-4">
                Nội dung chi tiết
              </Title>
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
                        width="100%"
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer với thông tin bổ sung */}
          <div className="bg-gray-100 p-8 rounded-lg mt-12">
            <Title level={3} className="mb-6 text-xl font-semibold">
              Thông tin bài viết
            </Title>
            <div className="grid grid-cols-2 gap-6 text-base">
              <div>
                <Text strong className="text-lg">Tác giả:</Text>
                <br />
                <Text className="text-gray-700 text-lg">{news.author}</Text>
              </div>
              <div>
                <Text strong className="text-lg">Ngày tạo:</Text>
                <br />
                <Text className="text-gray-700 text-lg">{formatDate(news.createdAt)}</Text>
              </div>
              {news.publishTime && (
                <div>
                  <Text strong className="text-lg">Thời gian xuất bản:</Text>
                  <br />
                  <Text className="text-gray-700 text-lg">{news.publishTime}</Text>
                </div>
              )}
              <div>
                <Text strong className="text-lg">Trạng thái:</Text>
                <br />
                <Tag color="green" className="text-base px-3 py-1">{news.status}</Tag>
              </div>
            </div>
          </div>

          {/* Thông báo đây là preview */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <InfoCircleOutlined className="!text-blue-400" />
              </div>
              <div className="ml-4 flex gap-2">
                <Text className="text-blue-800 font-semibold text-lg">
                  Đây là preview của bài viết
                </Text>
                <Text className="text-blue-700 text-base">
                  Cách bài viết sẽ hiển thị trên trang web sau khi được sắp xếp và hiển thị cho người dùng
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default NewsDetailPreview 