"use client";

import React, { useState } from "react";
import { DatePicker, Select, Space } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const { RangePicker } = DatePicker;
const { Option } = Select;

type PickerType = "date" | "week" | "month" | "quarter" | "year";

type RangeOnChange = React.ComponentProps<typeof RangePicker>["onChange"];

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

  const handleChangeDate: RangeOnChange = (value, dateString) => {
    if (!value) return;
    console.log("typehehe", type, dateString);

    const [start, end] = value;
    const dateStart = start?.format("YYYY-MM-DD");
    const dateEnd = end?.format("YYYY-MM-DD");
    if (!dateStart || !dateEnd) return;

    // copy query hiện tại
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", dateStart);
    params.set("to", dateEnd);

    router.push(`?${params.toString()}`);
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
