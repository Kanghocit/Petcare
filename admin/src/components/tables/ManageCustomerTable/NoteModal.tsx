"use client"

import React, { useState } from 'react';
import {  App, Modal } from 'antd';
import { Input } from 'antd';
import { useRouter } from 'next/navigation';
import { UpdateUserAction } from '@/app/(admin)/(others-pages)/(tables)/manage-customer-table/action';
const { TextArea } = Input;

const NoteModal: React.FC <{children: React.ReactNode,id: string}> = ({ children, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const {message} = App.useApp();
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
        const res = await UpdateUserAction(id, { note });
        if (res.ok) {
          message.success('Thêm note thành công');
          router.refresh();
          setIsModalOpen(false);
        } else {
          message.error(res.message || 'Thêm note không thành công');
        }
    } catch {
        message.error('Thêm note không thành công');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showModal();
      }}>
        {children}
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Modal
          title="Thêm ghi chú"
          closable={true}
          open={isModalOpen}
          okText='Thêm'
          cancelText="Hủy"
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <TextArea 
            rows={4} 
            placeholder="Thêm ghi chú cho khách hàng này"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Modal>
      </div>
    </>
  );
};

export default NoteModal;