"use client";

import Image from "next/image";
import React from "react";
import Button from "../button";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
// import { useRouter } from "next/navigation";

interface Address {
  _id: string;
  name: string;
  image: string | string[];
  address: string;
  addressLink: string;
}

const AddressCard = ({ data }: { data: Address }) => {
  const { name, image, address, addressLink } = data || ({} as Address);
  const rawImage = Array.isArray(image) ? image[0] : image;

  // Normalize image URL sử dụng utility function
  const imageSrc = normalizeImageUrl(rawImage);

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="w-full h-[220px] overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name || "address"}
            width={900}
            height={600}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="px-6 py-5 text-center">
        <h2 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
          {name}
        </h2>
        <p className="text-gray-600 text-sm mb-2 leading-relaxed line-clamp-3 px-2 ">
          {address}
        </p>
        <div className="flex items-center justify-center">
          <Button
            className="bg-primary text-white px-6"
            onClick={() => {
              if (addressLink) {
                window.open(addressLink, "_blank");
              }
            }}
          >
            Chỉ đường
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
