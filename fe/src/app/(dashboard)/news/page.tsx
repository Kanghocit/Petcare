import Breadcrumb from "@/components/breadCrumb";
import NewsTable from "./components/NewsTable";
import { getNews } from "@/libs/new";

const NewsPage = async ({
  searchParams,
}: {
  searchParams: { page: number; limit: number };
}) => {
  const { page, limit } = await searchParams;
  const news = await getNews(page, limit);

  return (
    <div className="container mx-auto">
      <div className="mx-8 py-8">
        <Breadcrumb />
        <div className="flex flex-col gap-8 bg-white rounded-xl p-8 mt-6 shadow-lg mx-4">
          <NewsTable data={news.news} totalPages={news.totalPages} />
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
