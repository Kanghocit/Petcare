import React from "react";
import SectionHeader from "../section-header";
import NewPostCard from "./NewPostCard";
import { getNewsAction } from "@/app/(dashboard)/news/action";

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  publishTime: string;
  slug: string;
}
const limit = 4;
const page = 1;

const News = async () => {
  const res = await getNewsAction(page, limit);

  return (
    <>
      <SectionHeader title="Sổ tay chăm Boss" hasImg={false} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-2xl mx-auto px-4 mt-5 mb-10">
        {res?.news.map((item: News, index: number) => (
          <div key={index}>
            <NewPostCard isCard={true} data={item} />
          </div>
        ))}
      </div>
    </>
  );
};

export default News;
