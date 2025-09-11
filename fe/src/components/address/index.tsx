import React from "react";
import SectionHeader from "../section-header";

import AddressCard from "./AddressCard";
import { getAllAddressAction } from "./action";

interface AddressItem {
  _id: string;
  name: string;
  image: string | string[];
  address: string;
  addressLink: string;
}
const limit = 4;
const page = 1;

const AddressSection = async () => {
  const res = await getAllAddressAction(page, limit);

  return (
    <>
      <SectionHeader title="Hệ thống cửa hàng" hasImg={false} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-2xl mx-auto px-4 mt-5 mb-10">
        {res?.addresses?.map((item: AddressItem) => (
          <div key={item._id}>
            <AddressCard data={item} />
          </div>
        ))}
      </div>
    </>
  );
};

export default AddressSection;
