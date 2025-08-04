import BreadCrumb from "@/components/breadCrumb";
import { getNewsBySlug } from "@/libs/new";
import React from "react";
import NewDescription from "./NewDescription";

const NewsDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  return (
    <div className="container mx-auto ">
      <div className="mx-8 py-8">
        <BreadCrumb title={slug} />
        <div className="flex flex-col gap-8 bg-white rounded-xl p-8 mt-6 shadow-lg mx-4">
          <NewDescription news={news.news} />
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
