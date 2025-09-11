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

export default function Home() {
  return (
    <div className="flex flex-col w-full ">
      <MotionDiv>
        <Carousel />
      </MotionDiv>
      <MotionDiv>
        <Banner />
      </MotionDiv>
      <MotionDiv>
        <Services />
      </MotionDiv>
      <MotionDiv>
        <Voichers />
      </MotionDiv>
      <MotionDiv>
        <PlashSale />
      </MotionDiv>
      <MotionDiv>
        <Products />
      </MotionDiv>
      <MotionDiv>
        <Foods title="Thức ăn cho mèo" tabs={FOOD_TABS.tabs} />
      </MotionDiv>
      <MotionDiv>
        <News />
      </MotionDiv>
      <MotionDiv>
        <ProductBrand />
      </MotionDiv>
      <MotionDiv>
        <Address />
      </MotionDiv>
    </div>
  );
}
