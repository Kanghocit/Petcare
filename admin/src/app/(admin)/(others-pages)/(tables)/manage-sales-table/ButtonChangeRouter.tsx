"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const ButtonChangeRouter = ({ action }: { action: string }) => {
  const router = useRouter();
  return (
    <Button
      variant="outlined"
      color="primary"
      icon={<PlusOutlined />}
      onClick={() => router.push(`manage-sales-table/${action}`)}
    >
      {action === "add" && "Thêm"}
    </Button>
  );
};

export default ButtonChangeRouter;
