import { RightOutlined } from "@ant-design/icons";
import SectionHeader from "../section-header";
import Tabs from "../tabs";
import Link from "next/link";
import Image from "next/image";
import { FoodTab } from "../../constants/food";

const Foods = ({
  title,
  tabs,
  hasBanner = true,
}: {
  title: string;
  tabs: FoodTab[];
  hasBanner?: boolean;
}) => {
  return (
    <div className="flex flex-col w-full">
      <SectionHeader title={title} />
      <Tabs tabs={tabs} />
      <Link
        href="#"
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
            className="w-full h-auto object-cover"
          />
          <Image
            src="/images/banner_group_1_2.webp"
            alt="foods"
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
          <Image
            src="/images/banner_group_1_3.webp"
            alt="foods"
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Foods;
