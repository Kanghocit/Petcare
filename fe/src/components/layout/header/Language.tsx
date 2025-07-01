"use client";

import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Typography } from "antd";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <div className="flex items-center gap-2">
        <img
          src="https://flagcdn.com/vn.svg"
          alt="Vietnam"
          width="20"
          height="20"
        />
        Vietnamese
      </div>
    ),
  },
  {
    key: "2",
    label: (
      <div className="flex items-center gap-2">
        <img src="https://flagcdn.com/gb.svg" alt="UK" width="20" height="20" />
        English
      </div>
    ),
  },
];

const Language: React.FC = () => (
  <Dropdown
    menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ["1"],
    }}
    placement="bottomRight"
  >
    <Typography.Link>
      <Space>
        <img src="https://flagcdn.com/w40/vn.png" alt="Vietnam" width="20" />
        <DownOutlined className="ms-1" />
      </Space>
    </Typography.Link>
  </Dropdown>
);

export default Language;
