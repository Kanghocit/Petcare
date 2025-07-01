import React from "react";
import { Row, Col } from "antd";
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa";
import Image from "next/image";
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 px-12 py-14 text-black !text-xl mt-4 !font-national-park  ">
      <Row gutter={[32, 24]}>
        {/* Cột 1 - Thông tin cửa hàng */}
        <Col xs={24} md={12} lg={6}>
          <Image
            src="/images/logo.webp"
            alt="logo"
            className="w-60 mb-4"
            width={100}
            height={100}
          />
          <h3 className="text-2xl font-semibold">Cửa hàng cho thú cưng</h3>
          <p className="mt-2 text-base">
            Chuyên cung cấp đồ dùng, thức ăn và phụ kiện cho thú cưng, cam kết
            chất lượng sản phẩm tốt nhất
          </p>
          <p className="mt-2 text-base">Mã số thuế: 12345678910</p>
          <p className="flex items-center mt-2 text-base">
            📍{" "}
            <span className="ml-1 font-semibold">
              70 Lu Gia, District 11, Ho Chi Minh City
            </span>
          </p>
          <p className="mt-2 text-base">
            📞 Hotline:{" "}
            <span className="text-red-500 font-semibold">19006750</span>
          </p>
          <p className="mt-2 text-base">
            📧 Email: <span className="font-semibold">support@sapo.vn</span>
          </p>

          <h4 className="mt-4 font-semibold text-2xl">Mạng xã hội</h4>
          <div className="flex space-x-3 mt-2 text-3xl">
            <FaFacebook className="text-blue-600" />
            <FaYoutube className="text-red-600" />
            <FaTiktok className="text-black" />
            <FaInstagram className="text-pink-500" />
          </div>
        </Col>

        {/* Cột 2 - Hỗ trợ khách hàng */}
        <Col xs={24} md={12} lg={6}>
          <h4 className="font-bold text-2xl">Hỗ trợ khách hàng</h4>
          <ul className="mt-2 space-y-2 list-disc list-inside text-base">
            <li>Câu hỏi thường gặp</li>
            <li>Hệ thống cửa hàng</li>
            <li>Tìm kiếm</li>
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
          </ul>
        </Col>

        {/* Cột 3 - Chính sách + Tổng đài */}
        <Col xs={24} md={12} lg={6}>
          <h4 className="font-bold text-2xl">Chính sách</h4>
          <ul className="mt-2 space-y-2 list-disc list-inside text-base">
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Điều khoản dịch vụ</li>
            <li>Chương trình cộng tác viên</li>
          </ul>

          <h4 className="font-bold text-2xl mt-6">Tổng đài hỗ trợ</h4>
          <ul className="mt-2 space-y-1 text-base">
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
          <h4 className="font-bold text-2xl">Đăng ký nhận ưu đãi</h4>
          <p className="mt-2 text-base">
            Bạn muốn nhận khuyến mãi đặc biệt? Tham gia cộng đồng hơn 68.000+
            người theo dõi để cập nhật ngay!
          </p>
          <div className="flex mt-3">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="border border-gray-300 p-2 rounded-l-md w-full focus:outline-none text-base"
            />
            <button className="bg-orange-500 text-white px-4 w-24 rounded-r-md hover:bg-orange-600 text-base">
              Đăng ký
            </button>
          </div>

          <h4 className="font-bold text-2xl mt-6">Phương thức thanh toán</h4>
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
  );
};

export default Footer;
