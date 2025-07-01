import { FaRegThumbsUp, FaShippingFast } from "react-icons/fa";
import { LiaUndoAltSolid } from "react-icons/lia";
import { LuTicketPercent } from "react-icons/lu";
import { IconType } from "react-icons/lib";

export const SERVICES: {
  id: number;
  icon: IconType;
  name: string;
  description: string;
}[] = [
  {
    id: 1,
    icon: FaShippingFast,
    name: "Giao hỏa tốc",
    description: "Nội thành trong 1h",
  },
  {
    id: 2,
    icon: LiaUndoAltSolid,
    name: "Đổi trả miễn phí",
    description: "Trong vòng 30 ngày",
  },
  {
    id: 3,
    icon: FaRegThumbsUp,
    name: "Hỗ trợ 24/7",
    description: "Hỗ trợ khách hàng 24/7",
  },
  {
    id: 4,
    icon: LuTicketPercent,
    name: "Deal hot bùng nổ",
    description: "Flash sale giảm giá cực sốc",
  },
];
