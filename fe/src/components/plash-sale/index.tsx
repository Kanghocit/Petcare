import React from "react";
import CountdownTimer from "./countdown-timer";
import ProductCard from "../product-card";

const PlashSale = () => {
  // Sử dụng một thời gian cố định thay vì tính toán mỗi lần render
  const endTime = "2025-06-01T23:59:59";

  return (
    <div className="mt-4 flex flex-col w-full">
      <div className="flex flex-col bg-[#f96264] gap-8 mx-40 px-2 rounded-lg text-white">
        <div className="flex gap-4 justify-between items-center px-2 rounded-lg text-white">
          <p className="text-[43px] font-bold font-sans">
            Chớp thời cơ. Giá như mơ!
          </p>
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-2 items-center text-[18px]">
              <p>Nhanh lên nào!</p>
              <p className="font-bold">Sự kiện kết thúc sau</p>
            </div>
            <div className="flex justify-between items-center">
              <CountdownTimer endTime={endTime} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 items-center justify-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductCard
              key={`flash-sale-${index}`}
              img={[
                "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
                "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
              ]}
              title="Bàn Cào Móng Giấy Cho Mèo + Tặng Cỏ Mèo"
              star={3}
              price={100000}
              isSale={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlashSale;
