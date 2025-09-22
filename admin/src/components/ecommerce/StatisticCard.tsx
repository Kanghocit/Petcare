import { ArrowUpIcon } from "@/icons";
import React from "react";
import Badge from "../ui/badge/Badge";
import clsx from "clsx";

interface StatisticCardProps {
  title: string;
  value: number | string;
  percentage?: string;
  icon: React.ReactNode;
}

const StatisticCard = ({
  title,
  value,
  percentage,
  icon,
}: StatisticCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </span>
      </div>

      <div
        className={clsx(
          "mt-2 flex",
          percentage
            ? "items-end justify-between"
            : "items-center justify-center",
        )}
      >
        <h4 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {value}
        </h4>

        {percentage && (
          <Badge color="success">
            <ArrowUpIcon />
            {percentage}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default StatisticCard;
