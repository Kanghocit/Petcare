import BreadCumb from "@/components/breadCrumb";
import ProductDetailPicture from "./components/ProductDetailPicture";
import ProductDetailInfo from "./components/ProductDetailInfo";
import ProductDetailDocument from "./components/ProductDetailDocument";
import ProductsWatched from "./components/ProductsWatched";
import Feedback from "@/components/feedback";
import { getProductBySlugAction } from "../../products/action";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const product = await getProductBySlugAction(slug);

  return (
    <>
      <div className="p-4 flex flex-col gap-4 container mx-auto">
        <BreadCumb />
        <div className="grid grid-cols-2 bg-[#f4f4f4] p-4 rounded-md mx-4 shadow-sm">
          <ProductDetailPicture images={product.product.images} />
          <ProductDetailInfo product={product.product} />
        </div>
        <ProductDetailDocument description={product.product.description} />
        <Feedback />
        <ProductsWatched />
      </div>
    </>
  );
};

export default ProductDetailPage;
