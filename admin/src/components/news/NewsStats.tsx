'use client'

import { Card, Row, Col, Statistic, Tag } from 'antd'
import { FileTextOutlined, PictureOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons'

interface Block {
  _id?: string
  text?: string
  image?: string
}

interface NewsStatsProps {
  blocks: Block[]
  author: string
  createdAt: string
  updatedAt: string
}

const NewsStats = ({ blocks, author, createdAt, updatedAt }: NewsStatsProps) => {
  const textBlocks = blocks.filter(block => block.text && block.text.trim()).length
  const imageBlocks = blocks.filter(block => block.image && block.image.trim()).length
  const totalBlocks = blocks.length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card title="Thống kê bài đăng" className="my-6!">
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="Tổng khối nội dung"
            value={totalBlocks}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Khối text"
            value={textBlocks}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Khối hình ảnh"
            value={imageBlocks}
            prefix={<PictureOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Tác giả"
            value={author}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
      </Row>

      <div className="mt-6 space-y-2">
        <div className="flex items-center space-x-2">
          <ClockCircleOutlined className="text-gray-500" />
          <span className="text-sm text-gray-600">Tạo lúc: {formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ClockCircleOutlined className="text-gray-500" />
          <span className="text-sm text-gray-600">Cập nhật lúc: {formatDate(updatedAt)}</span>
        </div>
      </div>

      {totalBlocks > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Phân bố nội dung:</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Text</span>
              <Tag color="green">{textBlocks} khối</Tag>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Hình ảnh</span>
              <Tag color="orange">{imageBlocks} khối</Tag>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Khối trống</span>
              <Tag color="red">{totalBlocks - textBlocks - imageBlocks} khối</Tag>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default NewsStats 