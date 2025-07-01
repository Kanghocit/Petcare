"use client";

import Breadcrumb from "@/components/breadCrumb";
import { Select } from "antd";
import React, { useState } from "react";

const branches = [
  {
    id: 1,
    city: "Nghệ An",
    name: "PetCare - 82 Nguyễn Sỹ Sách",
    address:
      "82 Nguyễn Sỹ Sách, Phường Hưng Dũng, Thành phố Vinh, Tỉnh Nghệ An",
    phone: "0329 818 268",
    hotline: "0975 135 036",
    mapUrl:
      "https://www.google.com/maps?q=82+Nguyễn+Sỹ+Sách,+Hưng+Dũng,+Vinh,+Nghệ+An",
    iframe:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.847282974559!2d105.693!3d18.679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139cfae2b2b2b2b%3A0x1234567890abcdef!2zODIgTmd1eeG7hW4gU-G7kSBTw6lT4bqjY2gsIEh1bmcgRMawxqFuZywgVmluaCwgTmdoxrDhu51uIEFu!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s",
  },
  {
    id: 2,
    city: "Nghệ An",
    name: "PetCare - 10 Hà Huy Tập",
    address: "10 Hà Huy Tập, Phường Hưng Bình, Thành phố Vinh, Tỉnh Nghệ An",
    phone: "0386 355 246",
    hotline: "0975 135 036",
    mapUrl:
      "https://www.google.com/maps?q=10+Hà+Huy+Tập,+Hưng+Bình,+Vinh,+Nghệ+An",
    iframe:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.847282974559!2d105.700!3d18.680!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139cfae2b2b2b2b%3A0xabcdef1234567890!2zMTAgSMOgIEh1eSBU4bqtcCwgSMOybmcgQsOsbmgsIFZpbmgsIE5naOG6pXkgQW4!5e0!3m2!1svi!2s!4v1710000000001!5m2!1svi!2s",
  },
];
const ContactPage = () => {
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);

  return (
    <div className="container mx-auto ">
      <div className="mx-8 py-8">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl p-8 mt-6 shadow-lg mx-4">
          <div className="w-full md:w-1/3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Liên hệ</h1>

              <label className="block font-semibold mb-3 text-gray-700">
                CHỌN CHI NHÁNH
              </label>
              <Select
                value={selectedBranch.id}
                onChange={(value) =>
                  setSelectedBranch(branches.find((b) => b.id === value)!)
                }
                style={{
                  width: "100%",
                  height: "40px",
                }}
                options={branches.map((branch) => ({
                  label: branch.city,
                  value: branch.id,
                }))}
              />
            </div>
            <div className="space-y-4">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-all duration-300 hover:shadow-md ${
                    selectedBranch.id === branch.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedBranch(branch)}
                >
                  <div className="font-bold text-lg mb-2">{branch.name}</div>
                  <div className="mb-2">{branch.address}</div>
                  <div className="text-sm">
                    <span className="font-medium">Điện thoại:</span>{" "}
                    {branch.phone}
                    <br />
                    <span className="font-medium">Hotline:</span>{" "}
                    {branch.hotline}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-2/3 flex flex-col items-center">
            <a
              href={selectedBranch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Chỉ đường tới {selectedBranch.name}
            </a>
            <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={selectedBranch.iframe}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
