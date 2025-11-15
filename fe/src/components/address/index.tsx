import React from "react";
import SectionHeader from "../section-header";

import AddressCard from "./AddressCard";

interface AddressItem {
  _id: string;
  name: string;
  image: string | string[];
  address: string;
  addressLink: string;
}

interface AddressSectionProps {
  addressesData?: { addresses?: AddressItem[] };
}

const AddressSection: React.FC<AddressSectionProps> = ({ addressesData }) => {
  const res = addressesData;

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
