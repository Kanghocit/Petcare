import BreadCumb from "@/components/breadCrumb";
import ProductDetailPicture from "./components/ProductDetailPicture";
import ProductDetailInfo from "./components/ProductDetailInfo";
import ProductDetailDocument from "./components/ProductDetailDocument";
import ProductsWatched from "./components/ProductsWatched";
import Feedback from "@/components/feedback";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  console.log(id);

  return (
    <>
      <div className="p-4 flex flex-col gap-4 container mx-auto">
        <BreadCumb />
        <div className="grid grid-cols-2 bg-[#f4f4f4] p-4 rounded-md mx-4 shadow-sm">
          <ProductDetailPicture
            images={[
              "/images/banner_group_1_1.webp",
              "/images/banner_group_1_2.webp",
              "/images/banner_group_1_3.webp",
            ]}
          />
          <ProductDetailInfo />
        </div>
        <ProductDetailDocument />
        <Feedback />
        <ProductsWatched />
      </div>
    </>
  );
};

export default ProductDetailPage;
