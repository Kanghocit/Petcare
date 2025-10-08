import ComponentCard from '@/components/common/ComponentCard'
import { getNewsBySlugAction } from '@/action'
import { Metadata } from 'next'
import NewsDetailWrapper from '@/components/news/NewsDetailWrapper'

export const metadata: Metadata = {
  title: "Kangdy Admin ",
  description: "Kangdy",
  // other metadata
};

const ManageNewsTableDetail = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const news = await getNewsBySlugAction(slug);

  return (
    <div className="space-y-6">
      <ComponentCard title="Thông tin chi tiết">
        <NewsDetailWrapper
          news={news.news}
          slug={slug}
        />
      </ComponentCard>
    </div>
  )
}

export default ManageNewsTableDetail
