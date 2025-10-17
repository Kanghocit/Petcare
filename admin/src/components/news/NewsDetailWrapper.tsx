'use client'

import { useState } from 'react'
import { Button, Space, message } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import NewsDetailHeader from './NewsDetailHeader'
import NewsMainImage from './NewsMainImage'
import NewsBasicInfo from './NewsBasicInfo'
import NewsSummary from './NewsSummary'
import NewsContentBlocks from './NewsContentBlocks'
import NewsEditForm from './NewsEditForm'
import NewsStats from './NewsStats'
import { updateNewsAction } from '@/action'
import NewsArticlePreview from './NewsArticlePreview'
import { useUserStore } from '@/store/user-store'

interface Block {
  _id?: string
  text?: string
  image?: string
}

interface NewsData {
  title: string
  content: string
  author: string
  status: string
  image?: string
  createdAt: string
  updatedAt: string
  publishTime: string
  slug: string
  _id: string
  blocks: Block[]
}

interface NewsFormData {
  title: string
  content: string
  author: string
  status: string
  image?: string
  blocks: Block[]
}

interface NewsDetailWrapperProps {
  news: NewsData
  slug: string
}

const NewsDetailWrapper = ({ news, slug }: NewsDetailWrapperProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentNews, setCurrentNews] = useState(news)
  const { user } = useUserStore()

  const handleSave = async (data: NewsFormData) => {
    try {
      await updateNewsAction(slug, data)
      setCurrentNews({ ...currentNews, ...data })
      setIsEditing(false)
      message.success('Cập nhật bài đăng thành công!')
    } catch {
      message.error('Có lỗi xảy ra khi cập nhật bài đăng!')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chỉnh sửa bài đăng</h1>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setIsEditing(false)}
          >
            Xem chi tiết
          </Button>
        </div>
        <NewsEditForm
          news={currentNews}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chi tiết bài đăng</h1>
        <Space>
          {user?.role === "admin" &&
            <Button
              className="!color-blue-500 !border-blue-500 hover:!text-blue-400 hover:!border-blue-400"
              size="middle"
              variant="outlined"
              icon={<EditOutlined className="!text-blue-400 " />}
              onClick={() => setIsEditing(true)}
            />
          }

          <NewsArticlePreview news={news} size="middle" shape="default" />
        </Space>
      </div>

      <div className="space-y-6">
        {/* Header với tiêu đề và trạng thái */}
        <NewsDetailHeader
          title={currentNews.title}
          status={currentNews.status}
        />

        {/* Hình ảnh chính */}
        {currentNews.image && (
          <NewsMainImage
            imageUrl={currentNews.image}
            title={currentNews.title}
          />
        )}

        {/* Thông tin cơ bản */}
        <NewsBasicInfo
          author={currentNews.author}
          status={currentNews.status}
          createdAt={currentNews.createdAt}
          updatedAt={currentNews.updatedAt}
          publishTime={currentNews.publishTime}
          slug={currentNews.slug}
          _id={currentNews._id}
        />

        {/* Thống kê bài đăng */}
        <NewsStats
          blocks={currentNews.blocks || []}
          author={currentNews.author}
          createdAt={currentNews.createdAt}
          updatedAt={currentNews.updatedAt}
        />

        {/* Nội dung tóm tắt */}
        <NewsSummary content={currentNews.content} />

        {/* Nội dung chi tiết */}
        <NewsContentBlocks blocks={currentNews.blocks || []} />
      </div>
    </div>
  )
}

export default NewsDetailWrapper 