"use client";

import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface PageLoaderProps {
  size?: "small" | "default" | "large";
  tip?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  size = "large",
  tip = "Đang tải...",
  fullScreen = false,
}) => {
  const iconSize = size === "large" ? 48 : size === "default" ? 32 : 24;
  const antIcon = <LoadingOutlined style={{ fontSize: iconSize }} spin />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <Spin indicator={antIcon} size={size} tip={tip} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spin indicator={antIcon} size={size} tip={tip} />
    </div>
  );
};

export default PageLoader;

