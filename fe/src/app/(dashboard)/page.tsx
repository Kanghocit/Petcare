import Carousel from "../../components/carousel";
import Banner from "../../components/banner";
import PlashSale from "../../components/plash-sale";
import Services from "../../components/services";
import Voichers from "../../components/voichers";
import Products from "../../components/products";
import ProductBrand from "../../components/product-brand";
import Foods from "../../components/foods";
import { FOOD_TABS } from "../../constants/food";

import News from "../../components/news";
import MotionDiv from "../../components/motion-div";
import Address from "@/components/address";
import { getFlashSaleAction } from "@/actions";
import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import { getAllBanners } from "@/libs/carousel";
import { getAllVoichers } from "@/libs/voicher";
import { searchProductAction } from "@/app/(dashboard)/products/action";
import { getNewsAction } from "@/app/(dashboard)/news/action";
import { getAllBrandsAction } from "@/app/(dashboard)/brands/action";
import { getAllAddressAction } from "@/components/address/action";

// Không cache home page vì layout cần user data (dynamic)
// Layout đã có dynamic = "force-dynamic" nên page cũng phải dynamic
export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Trang chủ",
  description:
    "Kangdy PetShop - Cửa hàng thú cưng uy tín với đa dạng sản phẩm cho chó mèo. Thức ăn, đồ chơi, phụ kiện chất lượng cao.",
});

export default async function Home() {
  // Fetch tất cả data song song ở page level để đảm bảo data sẵn sàng trước khi render
  const [
    flashSale,
    carouselData,
    voichersData,
    catFoodData,
    dogFoodData,
    toysData,
    newsData,
    brandsData,
    addressesData,
  ] = await Promise.all([
    getFlashSaleAction(),
    getAllBanners(),
    getAllVoichers(4),
    searchProductAction("Thức ăn cho mèo", 1, 5),
    searchProductAction("Thức ăn cho chó", 1, 5),
    searchProductAction("Đồ chơi", 1, 5),
    getNewsAction(1, 4),
    getAllBrandsAction(1, 12),
    getAllAddressAction(1, 4),
  ]);

  return (
    <div className="flex flex-col w-full ">
      <MotionDiv delay={0}>
        <Carousel carouselData={carouselData} />
      </MotionDiv>

      <MotionDiv delay={0.1}>
        <Banner />
      </MotionDiv>

      <MotionDiv delay={0.1}>
        <Services />
      </MotionDiv>

      <MotionDiv delay={0.15}>
        <Voichers voichersData={voichersData} />
      </MotionDiv>

      {flashSale?.status === "active" && (
        <MotionDiv delay={0.2}>
          <PlashSale flashSale={flashSale} />
        </MotionDiv>
      )}

      <MotionDiv delay={0.2}>
        <Products />
      </MotionDiv>

      <MotionDiv delay={0.25}>
        <Foods
          title="Thức ăn cho mèo"
          tabs={FOOD_TABS.tabs}
          catFoodData={catFoodData?.products || []}
          dogFoodData={dogFoodData?.products || []}
          toysData={toysData?.products || []}
        />
      </MotionDiv>

      <MotionDiv delay={0.25}>
        <News newsData={newsData} />
      </MotionDiv>

      <MotionDiv delay={0.3}>
        <ProductBrand brandsData={brandsData} />
      </MotionDiv>

      <MotionDiv delay={0.3}>
        <Address addressesData={addressesData} />
      </MotionDiv>
    </div>
  );
}
