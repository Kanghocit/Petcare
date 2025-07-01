"use client";

import { useState } from "react";

const Banner = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText("Kang185");
  };
  return (
    <div className="flex w-full h-[80px] items-center justify-center bg-[#ff8662]">
      <h1 className="text-white text-center py-2 font-bold text-2xl">
        MUA NHIỀU GIẢM SÂU - giảm đến 50%!{" "}
        <span className="text-xl font-normal">Chỉ 1 tuần duy nhất!!!</span>
      </h1>
      <button className="bg-[#ff8662] ms-3 border-[white] border-2 text-white px-4 py-3 rounded-3xl cursor-pointer hover:bg-white hover:text-[#ff8662]">
        Mua ngay
      </button>
      <div className="flex items-center">
        <p className="bg-[#ff8662] ms-3 border-[white] border-r-none border-2 text-white px-8 py-3 rounded-l-xl cursor-pointer">
          Kang185
        </p>
        <button
          className="bg-[#ff8662] border-[white] border-2 text-white px-4 py-3 rounded-r-xl cursor-pointer hover:bg-white hover:text-[#ff8662]"
          onClick={handleCopy}
        >
          {isCopied ? "Đã sao chép" : "Sao chép"}
        </button>
      </div>
    </div>
  );
};

export default Banner;
