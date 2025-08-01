'use client'

import { Descriptions, Tag, Image, Typography } from 'antd'

const { Paragraph } = Typography;

interface Block {
  _id?: string
  text?: string
  image?: string
}

interface NewsContentBlocksProps {
  blocks: Block[]
}

const NewsContentBlocks = ({ blocks }: NewsContentBlocksProps) => {
  return (
    <Descriptions title="Nội dung chi tiết" bordered className='mt-6!'>
      <Descriptions.Item label="Số khối nội dung" span={3}>
        <Tag color="blue">{blocks?.length || 0} khối</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Nội dung đầy đủ" span={3}>
        <div className="space-y-4 max-h-96 overflow-y-auto border p-4 rounded">
          {blocks?.map((block: Block, index: number) => (
            <div key={block._id || index} className="border-b pb-2 last:border-b-0">
              {block.text && (
                <Paragraph className="mb-2">
                  <strong>Khối {index + 1}:</strong> {block.text}
                </Paragraph>
              )}
              {block.image && (
                <div className="mt-2">
                  <Image
                    src={block.image}
                    alt={`Hình ảnh khối ${index + 1}`}
                    width={200}
                    height={150}
                    style={{ objectFit: 'cover' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default NewsContentBlocks 