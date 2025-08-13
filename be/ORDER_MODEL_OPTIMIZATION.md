# Tối ưu hóa Model Order

## Tổng quan

Model Order đã được tối ưu hóa để cải thiện tính năng, hiệu suất và khả năng mở rộng của hệ thống quản lý đơn hàng.

## Các cải tiến chính

### 1. **Cấu trúc địa chỉ giao hàng chi tiết**

```javascript
const shippingAddressSchema = {
  fullName: String, // Tên đầy đủ người nhận
  phone: String, // Số điện thoại
  email: String, // Email
  address: String, // Địa chỉ chi tiết
  city: String, // Tỉnh/Thành phố
  district: String, // Quận/Huyện
  ward: String, // Phường/Xã
  zipCode: String, // Mã bưu điện
  isDefault: Boolean, // Địa chỉ mặc định
};
```

### 2. **Snapshot thông tin sản phẩm**

- Lưu trữ thông tin sản phẩm tại thời điểm mua
- Tránh phụ thuộc vào việc thay đổi thông tin sản phẩm sau này
- Bao gồm: title, slug, image, brand, sku

### 3. **Thông tin vận chuyển chi tiết**

```javascript
const shipping = {
  method: "standard" | "express" | "same_day",
  fee: Number, // Phí vận chuyển
  estimatedDays: Number, // Số ngày ước tính
  trackingNumber: String, // Mã tracking
  carrier: String, // Đơn vị vận chuyển
  notes: String, // Ghi chú vận chuyển
};
```

### 4. **Hệ thống giảm giá**

```javascript
const discount = {
  amount: Number, // Số tiền giảm
  code: String, // Mã giảm giá
  type: "percentage" | "fixed",
  description: String, // Mô tả giảm giá
};
```

### 5. **Validation và Business Logic**

- Validation chi tiết cho tất cả các trường
- Kiểm tra logic nghiệp vụ (số lượng trả không vượt quá số lượng mua)
- Middleware tự động tính toán tổng tiền
- Cập nhật trạng thái giao nhận tự động

### 6. **Virtual Fields**

- `totalItems`: Tổng số sản phẩm
- `deliveredItems`: Số sản phẩm đã giao
- `returnedItems`: Số sản phẩm đã trả
- `paymentStatusText`: Trạng thái thanh toán dễ đọc
- `fulfillmentStatusText`: Trạng thái giao nhận dễ đọc

### 7. **Instance Methods**

- `recalculateTotals()`: Tính toán lại tổng tiền
- `updateFulfillmentStatus()`: Cập nhật trạng thái giao nhận
- `canCancel()`: Kiểm tra có thể hủy không
- `canReturn()`: Kiểm tra có thể trả hàng không

### 8. **Static Methods**

- `findByOrderCode(orderCode)`: Tìm đơn hàng theo mã
- `getStatusStats(userId)`: Thống kê theo trạng thái

### 9. **Indexes tối ưu**

- Index cho các truy vấn phổ biến
- Index cho tìm kiếm theo mã đơn hàng
- Index cho tìm kiếm theo số điện thoại

## API Endpoints mới

### 1. **Tạo đơn hàng** - `POST /api/orders/create`

```javascript
{
  "items": [
    {
      "product": "productId",
      "quantity": 2,
      "priceAtPurchase": 150000
    }
  ],
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "email": "example@email.com",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "district": "Cầu Giấy",
    "ward": "Dịch Vọng"
  },
  "shipping": {
    "method": "standard",
    "estimatedDays": 3
  },
  "discount": {
    "amount": 10000,
    "code": "SALE10"
  },
  "payment": {
    "method": "cod"
  },
  "note": "Ghi chú đơn hàng"
}
```

### 2. **Lấy đơn hàng theo mã** - `GET /api/orders/code/:orderCode`

### 3. **Cập nhật trạng thái đơn hàng** - `PUT /api/orders/:id/status`

```javascript
{
  "fulfillmentStatus": "shipped",
  "paymentStatus": "paid",
  "itemUpdates": [
    {
      "itemId": "itemId",
      "fulfillmentStatus": "shipped",
      "trackingNumber": "VN123456789",
      "carrier": "GHTK"
    }
  ],
  "note": "Đã giao hàng"
}
```

### 4. **Hủy đơn hàng** - `PUT /api/orders/:id/cancel`

```javascript
{
  "reason": "Khách hàng yêu cầu hủy"
}
```

### 5. **Thống kê đơn hàng** - `GET /api/orders/stats`

## Lợi ích của việc tối ưu hóa

### 1. **Tính năng phong phú hơn**

- Hỗ trợ nhiều phương thức thanh toán
- Quản lý vận chuyển chi tiết
- Hệ thống giảm giá linh hoạt
- Theo dõi trạng thái từng sản phẩm

### 2. **Hiệu suất tốt hơn**

- Indexes tối ưu cho truy vấn
- Virtual fields tính toán động
- Validation sớm để tránh lỗi

### 3. **Khả năng mở rộng**

- Cấu trúc modular
- Dễ dàng thêm tính năng mới
- Hỗ trợ nhiều loại đơn hàng

### 4. **Bảo mật và độ tin cậy**

- Validation nghiêm ngặt
- Kiểm tra quyền truy cập
- Logging lỗi chi tiết

## Migration từ model cũ

Để migrate từ model cũ sang model mới:

1. **Backup dữ liệu hiện tại**
2. **Cập nhật code frontend** để gửi dữ liệu theo format mới
3. **Chạy script migration** để chuyển đổi dữ liệu cũ
4. **Test kỹ lưỡng** trước khi deploy production

## Lưu ý quan trọng

1. **Validation**: Tất cả input phải được validate kỹ lưỡng
2. **Permissions**: Kiểm tra quyền truy cập cho mọi operation
3. **Error Handling**: Xử lý lỗi chi tiết và trả về message rõ ràng
4. **Performance**: Monitor performance của các query phức tạp
5. **Backup**: Backup dữ liệu thường xuyên

## Kết luận

Model Order đã được tối ưu hóa để đáp ứng nhu cầu của một hệ thống e-commerce hiện đại với đầy đủ tính năng quản lý đơn hàng, thanh toán, vận chuyển và theo dõi trạng thái chi tiết.
