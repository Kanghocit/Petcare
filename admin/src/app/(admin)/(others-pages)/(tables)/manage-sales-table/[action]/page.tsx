import React from "react";
import SelectedProductsContainer from "../components/SelectedProductsContainer";
import { getAllProductsAction } from "../../manage-product-table/action";

import { getFlashSaleByIdAction } from "../action";
import { FlashSale, FlashSaleResponse } from "@/interface/FlashSales";

const AddFlashSalePage = async ({
  params,
  searchParams,
}: {
  searchParams: Promise<{ page?: number; search?: string; id?: string }>;
  params: Promise<{ action: string }>;
}) => {
  const { page = 1, search = "", id } = await searchParams;

  const { action } = await params;
  const productData = await getAllProductsAction(page, search);
  const { products, total } = productData;

  let flashSaleItem: FlashSale;
  if (action === "edit" && id) {
    const flashSalesData = await getFlashSaleByIdAction(id);

    const { flashSale } = flashSalesData as FlashSaleResponse;
    flashSaleItem = flashSale;
  } else {
    flashSaleItem = {
      name: "",
      products: [],
      discountType: "percent",
      startDate: "",
      endDate: "",
    } as FlashSale;
  }

  return (
    <SelectedProductsContainer
      flashSales={flashSaleItem}
      products={products}
      total={total}
      action={action}
    />
  );
};

export default AddFlashSalePage;
