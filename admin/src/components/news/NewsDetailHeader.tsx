'use client'


interface NewsDetailHeaderProps {
  title: string
  status: string
}

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
      <span className={`px-2 py-1 text-sm rounded-md text-white ${
        status === 'active' ? 'border-green-500 border-1 bg-green-100/10  !text-green-400 ' : 
        status === 'pending' ? 'border-yellow-500 border-1 bg-yellow-100/10 !text-yellow-400 ' : 
        status === 'rejected' ? 'border-red-500 border-1 bg-red-100/10 !text-red-400 ' : 'border-gray-500 border-1 bg-gray-100/10 !text-gray-400 '
      }`}>
        {getStatusText(status)}
      </span>
    </div>
  )
}

export default NewsDetailHeader 