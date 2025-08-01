'use client'

import { Descriptions, Typography } from 'antd'

const { Paragraph } = Typography;

interface NewsSummaryProps {
  content: string
}

const NewsSummary = ({ content }: NewsSummaryProps) => {
  return (
    <Descriptions title="Nội dung tóm tắt" bordered>
      <Descriptions.Item label="Tóm tắt" span={3}>
        <Paragraph className="text-gray-700">
          {content}
        </Paragraph>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default NewsSummary 