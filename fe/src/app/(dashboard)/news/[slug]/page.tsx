import BreadCrumb from "@/components/breadCrumb";
import { getNewsBySlug } from "@/libs/new";
import React from "react";
import NewDescription from "./NewDescription";
import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

// Revalidate news detail page every 1 hour
export const revalidate = 3600;

// Generate dynamic metadata for news pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const news = await getNewsBySlug(slug);
    const newsData = news?.news;
    
    if (newsData) {
      return createMetadata({
        title: newsData.title,
        description: newsData.summary || newsData.content?.substring(0, 160) || `Đọc tin tức: ${newsData.title}`,
        openGraph: {
          title: newsData.title,
          description: newsData.summary || newsData.content?.substring(0, 160),
          images: newsData.image ? [newsData.image] : [],
        },
      });
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  return createMetadata({
    title: "Chi tiết tin tức",
  });
}

const NewsDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
