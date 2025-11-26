import { createMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import { getUserProfile } from "@/libs/user";
import EditProfileForm from "./EditProfileForm";

// No revalidate for user-specific pages (dynamic)
export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Chỉnh sửa thông tin cá nhân",
  description: "Cập nhật thông tin tài khoản của bạn tại Kangdy PetShop",
  robots: {
    index: false,
    follow: false,
  },
});

const EditProfilePage = async () => {
  const profile = await getUserProfile();
  const user = profile?.user;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="text-xl font-semibold text-gray-900">
        Chỉnh sửa thông tin cá nhân
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Cập nhật thông tin tài khoản để trải nghiệm mua sắm tốt hơn.
      </p>

      {user ? (
        <EditProfileForm user={user} />
      ) : (
        <p className="mt-4 text-sm text-red-500">
          Bạn cần đăng nhập để chỉnh sửa thông tin cá nhân.
        </p>
      )}
    </div>
  );
};

export default EditProfilePage;
