import Carousel from "../../components/carousel";
import Banner from "../../components/banner";
import PlashSale from "../../components/plash-sale";
import Services from "../../components/services";
import Voichers from "../../components/voichers";
import Products from "../../components/products";
import ProductBrand from "../../components/product-brand";
import Foods from "../../components/foods";
import { FOOD_TABS } from "../../constants/food";
import { FOOD_SERVICES } from "../../constants/food-services";
import News from "../../components/news";

export default function Home() {
  return (
    <div className="flex flex-col w-full ">
      <Carousel />
      <Banner />
      <Services />
      <Voichers />
      <PlashSale />
      <Products />
      <Foods title="Thức ăn cho mèo" tabs={FOOD_TABS.tabs} />
      <Foods
        title="Dịch vụ chăm sóc Boss"
        tabs={FOOD_SERVICES.tabs}
        hasBanner={false}
      />
      <News />
      <ProductBrand />
    </div>
  );
}
