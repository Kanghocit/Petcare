import React from "react";
import { Row, Col } from "antd";
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <div className="relative flex flex-col pt-9">
      <div className="absolute top-0 right-10">
        <Image
          src="/images/logo-bottom.png"
          alt="footer-bg"
          width={100}
          height={100}
        />
      </div>
      <footer className=" bg-gray-100 px-12 py-14 text-black !text-[14px] mt-4 !font-national-park pt-4 flex items-center justify-center">
        <Row gutter={[32, 24]} className="container">
          {/* Cột 1 - Thông tin cửa hàng */}
          <Col xs={24} md={12} lg={6}>
            <Image
              src="/images/logo.webp"
              alt="logo"
              width={150}
              height={100}
              priority
            />
            <h3 className="text-xl font-semibold">Cửa hàng cho thú cưng</h3>
            <p className="mt-2 text-[14px]">
              Chuyên cung cấp đồ dùng, thức ăn và phụ kiện cho thú cưng, cam kết
              chất lượng sản phẩm tốt nhất
            </p>
            <p className="mt-2 text-[14px]">Mã số thuế: 12345678910</p>
            <p className="flex items-center mt-2 text-[14px]">
              📍 <span className="ml-1 font-semibold">Ha Noi, Viet Nam</span>
            </p>
            <p className="mt-2 text-[14px]">
              📞 Hotline:{" "}
              <span className="text-red-500 font-semibold">19006750</span>
            </p>
            <p className="mt-2 text-[14px]">
              📧 Email: <span className="font-semibold">shop@gmail.com</span>
            </p>

            <h4 className="mt-4 font-semibold text-xl">Mạng xã hội</h4>
            <div className="flex space-x-3 mt-2 text-2xl">
              <FaFacebook className="text-blue-600" />
              <FaYoutube className="text-red-600" />
              <FaTiktok className="text-black" />
              <FaInstagram className="text-pink-500" />
            </div>
          </Col>

          {/* Cột 2 - Hỗ trợ khách hàng */}
          <Col xs={24} md={12} lg={6}>
            <h4 className="font-bold text-xl">Hỗ trợ khách hàng</h4>
            <ul className="mt-2 space-y-2 list-disc list-inside text-[14px]">
              <li>Câu hỏi thường gặp</li>
              <li>Hệ thống cửa hàng</li>
              <li>Tìm kiếm</li>
              <li>Giới thiệu</li>
              <li>Liên hệ</li>
            </ul>
          </Col>

          {/* Cột 3 - Chính sách + Tổng đài */}
          <Col xs={24} md={12} lg={6}>
            <h4 className="font-bold text-xl">Chính sách</h4>
            <ul className="mt-2 space-y-2 list-disc list-inside text-[14px]">
              <li>Chính sách đổi trả</li>
              <li>Chính sách bảo mật</li>
              <li>Điều khoản dịch vụ</li>
              <li>Chương trình cộng tác viên</li>
            </ul>

            <h4 className="font-bold text-xl mt-6">Tổng đài hỗ trợ</h4>
            <ul className="mt-2 space-y-1 text-[14px]">
              <li>
                Gọi mua hàng: <strong>0999999999</strong> (8h-20h)
              </li>
              <li>
                Gọi bảo hành: <strong>19009999</strong> (8h-20h)
              </li>
            </ul>
          </Col>

          {/* Cột 4 - Newsletter + Thanh toán */}
          <Col xs={24} md={12} lg={6}>
            <h4 className="font-bold text-xl">Đăng ký nhận ưu đãi</h4>
            <p className="mt-2 text-[14px]">
              Bạn muốn nhận khuyến mãi đặc biệt? Tham gia cộng đồng hơn 68.000+
              người theo dõi để cập nhật ngay!
            </p>
            <div className="flex w-full max-w-md mt-4">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 border border-gray-300 px-4 py-2 rounded-l-3xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button className="bg-orange-500 text-white px-4 rounded-r-3xl hover:bg-orange-600 text-[14px] cursor-pointer">
                Đăng ký
              </button>
            </div>

            <h4 className="font-bold text-xl mt-4">Phương thức thanh toán</h4>
            <div className="flex space-x-3 mt-3 cursor-pointer">
              <Image
                src="https://bizweb.dktcdn.net/thumb/grande/100/527/383/themes/964940/assets/footer-trustbadge.png?1742811067202"
                alt=""
                width={100}
                height={100}
              />
            </div>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default Footer;
