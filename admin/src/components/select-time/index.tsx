"use client";

import React, { useState } from "react";
import { DatePicker, Select, Space } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const { RangePicker } = DatePicker;
const { Option } = Select;

type PickerType = "date" | "week" | "month" | "quarter" | "year";
type RangeOnChange = React.ComponentProps<typeof RangePicker>["onChange"];

const formatByType = (type: PickerType) => {
  switch (type) {
    case "date":
      return "YYYY-MM-DD";
    case "week":
      return "YYYY-wo"; // tuần
    case "month":
      return "YYYY-MM";
    case "quarter":
      return "YYYY-[Q]Q";
    case "year":
      return "YYYY";
    default:
      return "YYYY-MM-DD";
  }
};

const PickerWithType = ({
  type,
  onChange,
}: {
  type: PickerType;
  onChange: RangeOnChange;
}) => {
  return <RangePicker picker={type} onChange={onChange} />;
};

const SelectTime: React.FC = () => {
  const [type, setType] = useState<PickerType>("date");

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChangeDate: RangeOnChange = (value) => {
    // copy query hiện tại
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      // clear filter
      params.delete("from");
      params.delete("to");
      params.delete("type");
    } else {
      const [start, end] = value;
      const format = formatByType(type);

      const dateStart = start?.format(format);
      const dateEnd = end?.format(format);

      if (!dateStart || !dateEnd) return;

      params.set("from", dateStart);
      params.set("to", dateEnd);
      params.set("type", type);
    }

    // giữ nguyên pathname
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <Space>
      <Select aria-label="Picker Type" value={type} onChange={setType}>
        <Option value="date">Date</Option>
        <Option value="week">Week</Option>
        <Option value="month">Month</Option>
        <Option value="quarter">Quarter</Option>
        <Option value="year">Year</Option>
      </Select>
      <PickerWithType type={type} onChange={handleChangeDate} />
    </Space>
  );
};

export default SelectTime;
