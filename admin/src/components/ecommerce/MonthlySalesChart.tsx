"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import SelectTime from "../select-time";
import { useSearchParams } from "next/navigation";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  console.log(from, to);

  const options: ApexOptions = {
    colors: ["#465fff", "#ff9800"], // Sales (xanh), Revenue (cam)
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
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
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
          text: "Doanh thu (VNĐ)",
        },
      },
      {
        opposite: true,
        min: 0,
        title: {
          text: "Doanh số",
        },
      },
    ],
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `${val}` },
    },
  };

  // Mock data cho 2 series
  const series = [
    {
      name: "Doanh thu",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
    {
      name: "Doanh số",
      data: [
        1200, 2500, 1800, 2200, 1600, 2100, 2800, 900, 1700, 3200, 2300, 1000,
      ],
    },
  ];

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
