'use client'

import React, { useState } from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { useRouter } from 'next/navigation';

const TablePagination: React.FC<{ total: number , link: string }> = ({ total, link }) => {
  const [current, setCurrent] = useState(1);
  const router = useRouter();

  const onChange: PaginationProps['onChange'] = (page) => {
    router.push(`${link}?page=${page}`);
    setCurrent(page);
  };

  return (
    <div className='flex justify-center my-4'>
      <Pagination current={current} onChange={onChange} total={total} />
    </div>
  );
};

export default TablePagination;