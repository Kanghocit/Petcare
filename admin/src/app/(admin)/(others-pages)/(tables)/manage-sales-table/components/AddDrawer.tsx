"use client";

import React, { useMemo, useState } from "react";
import { Drawer, Image, Input, Table } from "antd";
import type { TableProps } from "antd";
import { Product } from "@/interface/Products";
import TablePagination from "@/components/tables/TablePagination";

interface AddDrawerProps {
  page: number;
  children: React.ReactNode;
  onSelect: (products: Product[]) => void;
  selected: Product[];
  search: string;
  onChangeSearch: (value: string) => void;
  products: Product[];
  total: number;
  action?: "create" | "update";
}

type RowType = Product & { key: string };

const AddDrawer: React.FC<AddDrawerProps> = ({
  children,
  onSelect,
  selected,
  search,
  onChangeSearch,
  products,
  total,
  action,
}) => {
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const selectedSlugs = useMemo(
    () => new Set(selected.map((p) => p.slug)),
    [selected],
  );

  const columns: TableProps<RowType>["columns"] = [
    { title: "Tên sản phẩm", dataIndex: "title", key: "title" },
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      render: (imgs: string[] | string) => {
        const first = Array.isArray(imgs)
          ? imgs[0]
          : (imgs || "").split(",")[0];
        if (!first) return null;
        const baseUrl = "http://localhost:8000";
        const url = first.startsWith("http")
          ? first
          : `${baseUrl}${first.startsWith("/") ? first : `/${first}`}`;
        return (
          <Image
            src={url}
            height={60}
            width={60}
            alt="product"
            preview={true}
          />
        );
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (v: number) => `${v.toLocaleString()}đ`,
    },
    { title: "Tồn kho", dataIndex: "quantity", key: "quantity" },
  ];

  const showDrawer = async () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const filtered = (products || []).filter((p) =>
    search ? p.title.toLowerCase().includes(search.toLowerCase()) : true,
  );
  const dataSource: RowType[] = filtered.map((p) => ({
    ...p,
    key: p.slug,
  }));

  return (
    <>
      <div onClick={showDrawer}>{children}</div>
      <Drawer
        title="Chọn sản phẩm"
        closable={true}
        onClose={onClose}
        open={open}
        width={640}
      >
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
          />
        </div>
        <Table<RowType>
          rowSelection={{
            selectedRowKeys: dataSource
              .filter((d) => selectedSlugs.has(d.slug))
              .map((d) => d.key),
            onChange: (_, rows) => onSelect(rows),
          }}
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
        <TablePagination
          total={total || 0}
          link={
            action === "update"
              ? `/manage-sales-table/edit`
              : "/manage-sales-table/add"
          }
          limit={10}
        />
      </Drawer>
    </>
  );
};

export default AddDrawer;
