import React from "react";
import SectionHeader from "../section-header";
import NewPostCard from "./NewPostCard";

const News = () => {
  return (
    <>
      <SectionHeader title="Sổ tay chăm Boss" hasImg={false} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-2xl mx-auto px-4 mt-5 mb-10">
        <NewPostCard />
        <NewPostCard />
        <NewPostCard />
        <NewPostCard />
      </div>
    </>
  );
};

export default News;
