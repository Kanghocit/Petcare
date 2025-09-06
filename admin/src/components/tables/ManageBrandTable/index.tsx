"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { App, Button, Image } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TablePagination from "@/components/tables/TablePagination";
import { useRouter } from "next/navigation";
import { Brand } from "@/interface/Brand";
import ModalAddBrand from "@/app/(admin)/(others-pages)/(tables)/manage-brand-table/ModalAddBrand";
import { deleteBrandAction } from "@/app/(admin)/(others-pages)/(tables)/manage-brand-table/action";

const ManageBrandTable = ({
  brands,
}: {
  brands?: { brands: Brand[]; total: number; limit: number };
}) => {
  const { brands: brandsData, total, limit } = brands || {};
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const imageBase = apiBase?.replace(/\/api\/?$/, "");
  const router = useRouter();
  const { modal, message } = App.useApp();

  const handleDeleteBrand = async (id: string) => {
    modal.confirm({
      title: "Xoá brand",
      content: "Bạn có chắc chắn muốn xoá brand này không?",
      onOk: async () => {
        const res = await deleteBrandAction(id);
        if (res.ok) {
          message.success("Xoá brand thành công");
          router.refresh();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Tên brand
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Ảnh brand
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Số lượng sản phẩm
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {brandsData?.map((brand: Brand) => (
                <TableRow
                  key={brand._id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {brand.name || brand._id.slice(-8).toUpperCase()}
                    </p>
                  </TableCell>

                  <TableCell className="text-theme-sm w-1/4 px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1">
                      {(() => {
                        const rewriteBannerPath = (u?: string) => {
                          if (!u) return u;
                          // Replace /images/banner/... with /images/hero/... to bypass ad-blockers
                          return u.replace(
                            /(^|\/)images\/banner\//,
                            "$1images/hero/",
                          );
                        };
                        const raw = brand.image;
                        const normalized = rewriteBannerPath(raw);
                        const src = normalized?.startsWith("http")
                          ? normalized
                          : `${imageBase}${normalized}`;

                        return brand.image ? (
                          <Image
                            height={40}
                            width={110}
                            src={src as string}
                            alt=""
                            className="rounded-sm"
                          />
                        ) : (
                          <span>--</span>
                        );
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {brand.numberProducts || 0}
                    </p>
                  </TableCell>
                  <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                    {/* View button */}
                    <ModalAddBrand action="update" initialValues={brand}>
                      <Button
                        className="!color-blue-500 !border-blue-500 hover:!border-blue-400 hover:!text-blue-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<EditOutlined className="!text-blue-400" />}
                      />
                    </ModalAddBrand>
                    <Button
                      className="!color-red-500 !border-red-500 hover:!border-red-400 hover:!text-red-400"
                      size="small"
                      shape="circle"
                      variant="outlined"
                      icon={<DeleteOutlined className="!text-red-400" />}
                      onClick={() => handleDeleteBrand(brand._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            total={total || 0}
            link="/manage-brand-table"
            limit={limit || 5}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageBrandTable;
