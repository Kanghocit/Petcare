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
import { Address } from "@/interface/Address";
import { deleteAddressAction } from "@/app/(admin)/(others-pages)/(tables)/manage-address-table/action";
import ModalAddAddress from "@/app/(admin)/(others-pages)/(tables)/manage-address-table/ModalAddAddress";
import { useUserStore } from "@/store/user-store";

const ManageAddressTable = ({
  addresses,
}: {
  addresses?: { addresses: Address[]; total: number; limit: number };
}) => {
  const { addresses: addressesData, total, limit } = addresses || {};
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const imageBase = apiBase?.replace(/\/api\/?$/, "");
  const router = useRouter();
  const { modal, message } = App.useApp();
  const { user } = useUserStore()

  const handleDeleteaddress = async (id: string) => {
    modal.confirm({
      title: "Xoá addresse",
      content: "Bạn có chắc chắn muốn xoá addresse này không?",
      onOk: async () => {
        const res = await deleteAddressAction(id);
        if (res.ok) {
          message.success("Xoá addresse thành công");
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
                  Tên cửa hàng
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Ảnh
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Địa chỉ
                </TableCell>
                {user?.role === 'admin' && (
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Hành động
                  </TableCell>)}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {addressesData?.map((address: Address) => (
                <TableRow
                  key={address._id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <p className="text-theme-sm line-clamp-1 !max-w-[1/6] font-medium text-gray-800 dark:text-white/90">
                      {address.name || address._id.slice(-8).toUpperCase()}
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
                        const raw = Array.isArray(address.image)
                          ? address.image[0]
                          : address.image;
                        const normalized = rewriteBannerPath(raw);
                        const src = normalized?.startsWith("http")
                          ? normalized
                          : `${imageBase}${normalized}`;

                        return address.image ? (
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
                  <TableCell className="text-theme-sm !max-w-[250px] px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {address.address}
                  </TableCell>

                  {user?.role === 'admin' && (
                    <TableCell className="text-theme-sm mx-1 my-3 flex gap-2 px-4 py-3 text-gray-500 dark:text-gray-400">
                      {/* View button */}
                      <ModalAddAddress action="update" initialValues={address}>
                        <Button
                          className="!color-blue-500 !border-blue-500 hover:!border-blue-400 hover:!text-blue-400"
                          size="small"
                          shape="circle"
                          variant="outlined"
                          icon={<EditOutlined className="!text-blue-400" />}
                        />
                      </ModalAddAddress>
                      <Button
                        className="!color-red-500 !border-red-500 hover:!border-red-400 hover:!text-red-400"
                        size="small"
                        shape="circle"
                        variant="outlined"
                        icon={<DeleteOutlined className="!text-red-400" />}
                        onClick={() => handleDeleteaddress(address._id)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            total={total || 0}
            link="/manage-addresse-table"
            limit={limit || 5}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageAddressTable;
