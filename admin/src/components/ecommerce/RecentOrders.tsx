import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { Button } from "antd";
import { Product } from "@/interface/Products";
import Link from "next/link";

// Extend Product type for best selling products
type ProductWithSold = Product & {
  soldQuantity?: number;
  totalRevenue?: number;
};

// Define the table data using the interface

export default function RecentOrders({
  title,
  products,
}: {
  title: string;
  products: ProductWithSold[];
}) {
  const resolveImageUrl = (path?: string) => {
    if (!path) return "/images/placeholder.png";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/")) return path;
    return `/${path}`;
  };

  // Only show up to 3 products; compute remaining count
  const visibleProducts = Array.isArray(products) ? products.slice(0, 3) : [];
  const remainingProductsCount = Math.max(
    (products?.length || 0) - visibleProducts.length,
    0,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  // Xác định filter type dựa trên title
  const getFilterType = () => {
    if (title.includes("sắp hết hàng")) return "lowStock";
    if (title.includes("hết hàng")) return "outOfStock";
    if (title.includes("bán chạy")) return "bestSelling";
    if (title.includes("bán chậm")) return "slowSelling";
    return null;
  };

  const isBestSelling = title.includes("bán chạy");
  const isSlowSelling = title.includes("bán chậm");
  const isSoldQuantity = isBestSelling || isSlowSelling;

  const filterType = getFilterType();
  const linkHref = filterType
    ? `/manage-product-table?filter=${filterType}`
    : "/manage-product-table";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <Link href={linkHref}>
          <Button>Xem thêm</Button>
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Tên sản phẩm
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs px-1 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                {isSoldQuantity ? "Đã bán" : "Còn lại"}
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs px-1 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Đơn giá
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {visibleProducts?.map((product) => (
              <TableRow key={product.slug} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        width={50}
                        height={50}
                        src={resolveImageUrl(product.images?.[0])}
                        className="h-[50px] w-[50px]"
                        alt={product.title}
                      />
                    </div>
                    <div>
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {product.title}
                      </p>
                      <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {product.brand}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-center text-gray-500 dark:text-gray-400">
                  {isSoldQuantity
                    ? product.soldQuantity || 0
                    : product.quantity}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {formatCurrency(product.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {remainingProductsCount > 0 && (
        <div className="text-theme-xs mt-2 text-right text-gray-500 italic dark:text-gray-400">
          và {remainingProductsCount} sản phẩm khác
        </div>
      )}
    </div>
  );
}
