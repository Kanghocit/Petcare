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

interface NewsDetailWrapperProps {
  news: NewsData
  slug: string
}

const NewsDetailWrapper = ({ news, slug }: NewsDetailWrapperProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentNews, setCurrentNews] = useState(news)

  const handleSave = async (data: NewsData) => {
    try {
      await updateNewsAction(slug, data)
      setCurrentNews({ ...currentNews, ...data })
      setIsEditing(false)
      message.success('Cập nhật bài đăng thành công!')
    } catch (error) {
      console.error('Error updating news:', error)
      throw error
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
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
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