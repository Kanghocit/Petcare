'use client'

import { Descriptions, Tag } from 'antd'
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, GlobalOutlined } from '@ant-design/icons'

interface NewsBasicInfoProps {
  author: string
  status: string
  createdAt: string
  updatedAt: string
  publishTime: string
  slug: string
  _id: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'pending':
      return 'orange';
    case 'rejected':
      return 'red';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Đã duyệt';
    case 'pending':
      return 'Chờ duyệt';
    case 'rejected':
      return 'Từ chối';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const NewsBasicInfo = ({ 
  author, 
  status, 
  createdAt, 
  updatedAt, 
  publishTime, 
  slug, 
  _id 
}: NewsBasicInfoProps) => {
  return (
    <Descriptions title="Thông tin cơ bản" bordered column={2}>
      <Descriptions.Item label="Tác giả" span={1}>
        <UserOutlined className="mr-2" />
        {author}
      </Descriptions.Item>
      <Descriptions.Item label="Trạng thái" span={1}>
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian tạo" span={1}>
        <CalendarOutlined className="mr-2" />
        {formatDate(createdAt)}
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian cập nhật" span={1}>
        <ClockCircleOutlined className="mr-2" />
        {formatDate(updatedAt)}
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian xuất bản" span={2}>
        <GlobalOutlined className="mr-2" />
        {publishTime}
      </Descriptions.Item>
      <Descriptions.Item label="Slug" span={2}>
        <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
      </Descriptions.Item>
      <Descriptions.Item label="ID" span={2}>
        <code className="bg-gray-100 px-2 py-1 rounded">{_id}</code>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default NewsBasicInfo 