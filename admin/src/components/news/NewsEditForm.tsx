'use client'

import { useState } from 'react'
import { Form, Input, Button, Select, message, Space, Card, Typography, Image } from 'antd'
import { SaveOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title } = Typography
const { Option } = Select

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
  blocks: Block[]
}

interface NewsEditFormProps {
  news: NewsData
  onSave: (data: NewsData) => Promise<void>
  onCancel: () => void
}

const NewsEditForm = ({ news, onSave, onCancel }: NewsEditFormProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [blocks, setBlocks] = useState<Block[]>(news.blocks || [])

  const handleSave = async (values: NewsData) => {
    try {
      setLoading(true)
      const updatedData = {
        ...values,
        blocks: blocks
      }
      await onSave(updatedData)
      message.success('Cập nhật bài đăng thành công!')
      } catch {
      message.error('Có lỗi xảy ra khi cập nhật bài đăng!')
    } finally {
      setLoading(false)
    }
  }

  const addBlock = () => {
    const newBlock: Block = {
      _id: `block_${Date.now()}`,
      text: '',
      image: ''
    }
    setBlocks([...blocks, newBlock])
  }

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    setBlocks(newBlocks)
  }

  const updateBlock = (index: number, field: 'text' | 'image', value: string) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], [field]: value }
    setBlocks(newBlocks)
  }

  const validateImageUrl = (url: string) => {
    if (!url) return true
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <Card title="Chỉnh sửa bài đăng" className="mb-6">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: news.title,
          content: news.content,
          author: news.author,
          status: news.status
        }}
        onFinish={handleSave}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề!' },
            { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tiêu đề bài đăng" />
        </Form.Item>

        <Form.Item
          label="Tóm tắt"
          name="content"
          rules={[
            { required: true, message: 'Vui lòng nhập tóm tắt!' },
            { min: 20, message: 'Tóm tắt phải có ít nhất 20 ký tự!' }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập tóm tắt bài đăng"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Tác giả"
          name="author"
          rules={[
            { required: true, message: 'Vui lòng nhập tác giả!' },
            { min: 2, message: 'Tên tác giả phải có ít nhất 2 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="active">Đã duyệt</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
        </Form.Item>

        {/* Quản lý các khối nội dung */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Nội dung chi tiết</Title>
            <Button type="dashed" onClick={addBlock} icon={<EditOutlined />}>
              Thêm khối nội dung
            </Button>
          </div>

          {blocks.map((block, index) => (
            <Card 
              key={block._id || index} 
              size="small" 
              className="mb-3"
              title={`Khối ${index + 1}`}
              extra={
                <Button 
                  type="text" 
                  danger 
                  size="small"
                  onClick={() => removeBlock(index)}
                >
                  <CloseOutlined />
                </Button>
              }
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Nội dung text:</label>
                  <TextArea
                    rows={3}
                    value={block.text || ''}
                    onChange={(e) => updateBlock(index, 'text', e.target.value)}
                    placeholder="Nhập nội dung text..."
                    showCount
                    maxLength={1000}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL hình ảnh:</label>
                  <Input
                    value={block.image || ''}
                    onChange={(e) => updateBlock(index, 'image', e.target.value)}
                    placeholder="Nhập URL hình ảnh..."
                    status={block.image && !validateImageUrl(block.image) ? 'error' : ''}
                  />
                  {block.image && validateImageUrl(block.image) && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">Preview:</label>
                      <Image
                        src={block.image}
                        alt={`Preview khối ${index + 1}`}
                        width={200}
                        height={150}
                        style={{ objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có khối nội dung nào. Hãy thêm khối nội dung đầu tiên!</p>
            </div>
          )}
        </div>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              Lưu thay đổi
            </Button>
            <Button onClick={onCancel}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default NewsEditForm 