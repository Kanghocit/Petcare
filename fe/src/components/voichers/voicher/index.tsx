"use client";

import { Card, message } from "antd";
import React, { useState } from "react";
import Button from "@/components/button";

type VoicherProps = {
  code?: string;
  date?: string;
  description?: string;
  status?: string;
};

const Voicher = ({ code, date, description, status }: VoicherProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      messageApi.success("Đã sao chép mã giảm giá");
      setTimeout(() => setIsCopied(false), 3000); // reset sau 3s
    }
  };

  return (
    <Card className="!p-0 shadow-md w-fit bg-white !rounded-3xl">
      <div className="flex flex-col gap-3 border border-dashed border-gray-300 rounded-xl p-4 min-w-[280px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[18px] text-gray-800">
            Mã: <span className="text-black">{code}</span>
          </p>
          <p className="text-[14px] text-gray-400">HSD: {date}</p>
        </div>

        {/* Description */}
        <p className="text-[16px] text-gray-700 leading-relaxed">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2 ">
          <Button variant="outline">Điều kiện</Button>
          {contextHolder}
          <Button
            variant={status === "expired" ? "disabled" : "default"}
            onClick={handleCopy}
          >
            {status === "expired"
              ? "Hết hạn"
              : isCopied
              ? "Đã sao chép"
              : "Sao chép"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Voicher;
