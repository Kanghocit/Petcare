import Breadcrumb from "@/components/breadCrumb";
import React from "react";

const NewsPage = () => {
  return (
    <div className="container mx-auto ">
      <div className="mx-8 py-8">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl p-8 mt-6 shadow-lg mx-4">
          <div className="w-full md:w-1/3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Tạp chí chăm Boss
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
