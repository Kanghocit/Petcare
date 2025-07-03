import { getUser } from "@/action";

const ProfilePage = async () => {
  const userData = await getUser();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">
        Thông tin tài khoản
      </h3>
      <p>
        <strong>Họ tên:</strong> {userData?.user?.name}
      </p>
      <p>
        <strong>Email:</strong> {userData?.user?.email}
      </p>
    </div>
  );
};

export default ProfilePage;
