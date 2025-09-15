import BreadCumb from "@/components/breadCrumb";
import ProductDetailPicture from "./components/ProductDetailPicture";
import ProductDetailInfo from "./components/ProductDetailInfo";
import ProductDetailDocument from "./components/ProductDetailDocument";
import ProductsWatched from "./components/ProductsWatched";
import Feedback from "@/components/feedback";
import { getProductBySlugAction } from "../../products/action";
import { getUser } from "@/actions";
import { getComments } from "@/libs/comment";
import { CommentApiResponse } from "@/interface/comment";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const [product, user, commentData] = await Promise.all([
    getProductBySlugAction(slug),
    getUser(),
    getComments(slug),
  ]);

  // Transform comment data to match CommentDisplay interface
  const comment =
    commentData?.comments?.map((comment: CommentApiResponse) => ({
      id: comment._id,
      name: comment.userId?.name || "Anonymous",
      rating: comment.rating || 0,
      verified: true,
      comment: comment.content,
      status: comment.status,
      timestamp: comment.createdAt,
      userId: comment.userId?._id,
      replies:
        comment.replies?.map((reply) => ({
          id: reply._id,
          name: reply.userId?.name || "Shop Pet",
          comment: reply.content,
          timestamp: reply.createdAt,
        })) || [],
    })) || [];

  return (
    <>
      <div className="p-4 flex flex-col gap-4 container mx-auto">
        <BreadCumb />
        <div className="grid grid-cols-2 bg-[#f4f4f4] p-4 rounded-md mx-4 shadow-sm">
          <ProductDetailPicture images={product.product.images} />
          <ProductDetailInfo product={product.product} />
        </div>
        <ProductDetailDocument description={product.product.description} />
        <Feedback user={user} productSlug={slug} comment={comment} />
        <ProductsWatched />
      </div>
    </>
  );
};

export default ProductDetailPage;
