"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { App, Button, Tag } from "antd";
import Badge from "@/components/ui/badge/Badge";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Category } from "@/interface/Category";
import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/(admin)/(others-pages)/(tables)/manage-category-table/action";
import ModalAddCategory from "@/app/(admin)/(others-pages)/(tables)/manage-category-table/ModalAddCategory";

function flattenCategories(categories: Category[]): Category[] {
  const rows: Category[] = [];
  categories.forEach((c) => {
    rows.push(c);
    if (Array.isArray(c.children)) {
      c.children.forEach((child) => rows.push(child));
    }
  });
  return rows;
}

const ManageCategoryTable = ({
  categories = [] as Category[],
}: {
  categories?: Category[];
}) => {
  const router = useRouter();
  const { modal, message } = App.useApp();

  const rows = flattenCategories(categories);
  console.log(rows);

  const findParentName = (parentId?: string | null) => {
    if (!parentId) return "--";
    const found = categories.find((c) => c._id === parentId);
    return found?.name || "--";
  };

  const handleToggleActive = async (
    slug: string,
    current: boolean | undefined,
  ) => {
    const res = await updateCategoryAction(slug, {
      isActive: !current,
    } as Category);
    if (res?.ok) {
      message.success("Cập nhật trạng thái thành công");
      router.refresh();
    } else {
      message.error(res?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (slug: string) => {
    modal.confirm({
      title: "Xoá danh mục",
      content: "Bạn có chắc chắn muốn xoá danh mục này không?",
      onOk: async () => {
        const res = await deleteCategoryAction(slug);
        if (res?.ok) {
          message.success("Xoá danh mục thành công");
          router.refresh();
        } else {
          message.error(res?.message || "Có lỗi xảy ra");
        }
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1024px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Tên danh mục
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Danh mục cha
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Cấp
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Sản phẩm
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Ngày tạo
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {rows.map((cat) => (
                <TableRow
                  key={cat._id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-800 dark:text-white/90">
                    {cat.name}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {findParentName(cat.parentId as string | null)}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <Tag bordered={false} color="processing">
                      {cat.level || 1}
                    </Tag>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {cat.productCount ?? 0}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        cat.isActive
                          ? "success"
                          : cat.isActive === null
                            ? "warning"
                            : "error"
                      }
                    >
                      {cat.isActive
                        ? "Hoạt động"
                        : cat.isActive === null
                          ? "Tạm dừng"
                          : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString("vi-VN")
                      : "--"}
                  </TableCell>
                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    <ModalAddCategory
                      action="update"
                      initialValues={{
                        name: cat.name,
                        parentId: cat.parentId ?? undefined,
                        slug: cat.slug,
                      }}
                      categories={categories}
                    >
                      <Button
                        size="small"
                        shape="circle"
                        color="blue"
                        variant="outlined"
                        icon={<EditOutlined />}
                        title="Chỉnh sửa"
                      />
                    </ModalAddCategory>
                    <Button
                      size="small"
                      shape="circle"
                      color="yellow"
                      variant="outlined"
                      icon={
                        cat.isActive ? <CloseOutlined /> : <CheckOutlined />
                      }
                      title={cat.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      onClick={() =>
                        handleToggleActive(cat.slug as string, cat.isActive)
                      }
                    />
                    <Button
                      size="small"
                      shape="circle"
                      color="red"
                      variant="outlined"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(cat.slug as string)}
                      title="Xóa"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoryTable;
