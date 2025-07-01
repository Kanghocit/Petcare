import Breadcrumb from "@/components/breadCrumb";
import React from "react";

const ProfilePage = () => {
  return (
    <div className="container mx-auto ">
      <div className="mx-8 py-8">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl p-8 mt-6 shadow-lg mx-4">
          <div className="w-full md:w-1/3">ProfilePage</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
