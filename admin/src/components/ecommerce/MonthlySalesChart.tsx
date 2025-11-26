"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import SelectTime from "../select-time";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ChartType = {
  _id: string;
  revenue: number;
  profit: number;
};

export default function MonthlySalesChart({ chart }: { chart: ChartType[] }) {
  // build categories từ _id (theo tháng, năm...)
  const categories = chart?.map((item) => item._id);

  // series cho chart: Doanh thu & Lợi nhuận
  const series = [
    {
      name: "Doanh thu",
      data: chart?.map((item) => item.revenue),
    },
    {
      name: "Lợi nhuận",
      data: chart?.map((item) => item.profit),
    },
  ];

  const options: ApexOptions = {
    colors: ["#465fff", "#22c55e"], // Doanh thu (xanh), Lợi nhuận (xanh lá)
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: [
      {
        min: 0,
        title: {
          text: "Giá trị (VNĐ)",
        },
      },
      {
        opposite: true,
        min: 0,
        title: {
          text: "Giá trị (VNĐ)",
        },
      },
    ],
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `${val.toLocaleString()} VNĐ` },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Doanh số bán hàng
        </h3>
        <div className="flex items-end justify-end">
          <SelectTime />
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={250}
          />
        </div>
      </div>
    </div>
  );
}
