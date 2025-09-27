import { RightOutlined } from "@ant-design/icons";
import SectionHeader from "../section-header";
import Tabs from "../tabs";
import Link from "next/link";
import Image from "next/image";
import { FoodTab } from "../../constants/food";
import { searchProductAction } from "@/app/(dashboard)/products/action";

const Foods = async ({
  title,
  tabs,
  hasBanner = true,
}: {
  title: string;
  tabs: FoodTab[];
  hasBanner?: boolean;
}) => {
  const [catFoodData, dogFoodData, toysData] = await Promise.all([
    searchProductAction("Thức ăn cho mèo", 1, 5),
    searchProductAction("Thức ăn cho chó", 1, 5),
    searchProductAction("Đồ chơi", 1, 5),
  ]);

  return (
    <div className="flex flex-col w-full">
      <SectionHeader title={title} />

      <Tabs
        tabs={tabs}
        catFoodData={catFoodData?.products}
        dogFoodData={dogFoodData?.products}
        toysData={toysData?.products}
      />

      <Link
        href="/products?q=thức%20ăn%20cho%20mèo"
        className="text-center justify-between text-[20px] my-10 font-bold cursor-pointer text-[#ff8662] hover:text-[#ff8662]/80 transition-all duration-300"
      >
        Xem tất cả <RightOutlined className="text-[16px]" />
      </Link>

      {hasBanner && (
        <div className="flex mx-auto gap-10">
          <Image
            src="/images/banner_group_1_1.webp"
            alt="foods"
            width={400}
            height={300}
            className="w-full h-auto object-cover md:w-1/3"
          />

          <Image
            src="/images/banner_group_1_2.webp"
            alt="foods"
            width={400}
            height={300}
            className="w-full h-auto object-cover md:w-1/3"
          />

          <Image
            src="/images/banner_group_1_3.webp"
            alt="foods"
            width={400}
            height={300}
            className="w-full h-auto object-cover md:w-1/3"
          />
        </div>
      )}
    </div>
  );
};

export default Foods;
