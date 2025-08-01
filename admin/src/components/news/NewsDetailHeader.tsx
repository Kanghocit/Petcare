'use client'

import { Typography, Tag } from 'antd'

const { Title } = Typography;

interface NewsDetailHeaderProps {
  title: string
  status: string
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

const NewsDetailHeader = ({ title, status }: NewsDetailHeaderProps) => {
  // Test component đơn giản trước
  return (
    <div className="flex justify-between items-start">
      <h2 className="text-2xl font-bold mb-0">{title}</h2>
      <span className={`px-2 py-1 rounded text-white ${
        status === 'active' ? 'bg-green-500' : 
        status === 'pending' ? 'bg-orange-500' : 
        status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
      }`}>
        {getStatusText(status)}
      </span>
    </div>
  )
}

export default NewsDetailHeader 