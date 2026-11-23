# BÁO CÁO ĐỒ ÁN: VLXD HUB - ỨNG DỤNG PHÂN PHỐI VẬT LIỆU XÂY DỰNG & TƯ VẤN AI

> **Môn học:** Lập trình thiết bị di động  
> **Nền tảng:** Android (React Native Expo SDK 54 + Node.js Express + MongoDB)  
> **Ngôn ngữ:** Tiếng Việt | **Tiền tệ:** Việt Nam Đồng (VNĐ - ₫)

---

## 1. GIỚI THIỆU ĐỀ TÀI & TÍNH CẤP THIẾT
**VLXD Hub** là giải pháp ứng dụng di động hoàn chỉnh phục vụ nhu cầu khảo sát đơn giá, tra cứu quy cách kỹ thuật và đặt mua vật liệu xây dựng (xi măng, sắt thép, gạch xây, cát đá, sơn, ống nước, hóa chất chống thấm...) cho các chủ nhà, kỹ sư công trình, nhà thầu và đội thợ xây dựng.

Ứng dụng tích hợp **Trợ lý AI tư vấn kỹ thuật thi công & dự toán vật liệu** (sử dụng Google Gemini API kèm bộ quy chuẩn kỹ thuật xây dựng dự phòng) giúp giải đáp chính xác các thắc mắc về mác bê tông PCB40, định mức gạch xây trên m², tính năng chống thấm và phương án thi công.

---

## 2. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ

```text
React Native Mobile App (Expo SDK 54 + TypeScript + Tamagui + TanStack Query)
                           ↓ (Axios REST API)
                    Node.js Express Server
                 ↙                          ↘
   MongoDB (Local / Atlas)          Google Gemini AI API
```

### Mobile Frontend
- **Framework:** React Native, Expo SDK 54, Expo Router (File-based Routing), TypeScript.
- **Giao diện & UI:** Tamagui UI + Lucide React Native Icons (Thiết kế thực tế, chuyên nghiệp, tông màu Cam Đất `#C45123` đặc trưng ngành xây dựng).
- **State & Data Fetching:** TanStack React Query v5 (Quản lý cache, tự động revalidate khi chuyển màn hình).
- **Lưu trữ bảo mật:** Expo SecureStore (Lưu mã xác thực JWT token an toàn).
- **Tương tác thiết bị:** `expo-image-picker` cho phép Admin tải trực tiếp hình ảnh vật liệu từ thư viện máy hoặc chụp từ camera.
- **Tương thích:** Chạy mượt mà trên ứng dụng **Expo Go SDK 54** của điện thoại Android & iOS.

### Backend API
- **Nền tảng:** Node.js (LTS), Express.js (Kiến trúc MVC chuẩn hóa).
- **Xác thực:** JSON Web Token (JWT) + Mã hóa mật khẩu an toàn bằng `bcryptjs`.
- **Cơ sở dữ liệu:** MongoDB Mongoose (Hỗ trợ nạp tự động dữ liệu mẫu 8 danh mục và 26 sản phẩm).
- **AI Engine:** Tích hợp Google Gemini API qua endpoint `POST /api/ai/chat` kết hợp bộ tri thức dự phòng kỹ thuật xây dựng.

---

## 3. DANH SÁCH 14 MÀN HÌNH CHỨC NĂNG

### Phân hệ Khách hàng & Mua sắm (11 màn hình):
1. **Trang chủ (`app/(tabs)/index.tsx`)**: Banner công trình, tìm kiếm nhanh, nút gọi trợ lý AI, danh mục nhanh, sản phẩm bán chạy, sản phẩm mới, kéo làm mới (Pull-to-refresh).
2. **Danh mục vật liệu (`app/(tabs)/categories.tsx`)**: 8 nhóm vật liệu chính (Xi măng, Thép, Gạch xây, Gạch ốp lát, Cát đá, Sơn, Ống nước, Chống thấm), lọc sản phẩm theo nhóm.
3. **Giỏ hàng (`app/(tabs)/cart.tsx`)**: Quản lý danh sách vật tư cần nhập, tăng/giảm số lượng theo đơn vị (bao, cây, viên, m³), tính tổng tiền.
4. **Lịch sử đơn hàng (`app/(tabs)/orders.tsx`)**: Theo dõi tiến độ đơn hàng (Chờ duyệt, Đang giao đến công trình, Hoàn thành, Đã hủy).
5. **Tài khoản cá nhân (`app/(tabs)/profile.tsx`)**: Thông tin người dùng, đổi mật khẩu, đăng xuất, nút chuyển nhanh vào giao diện Admin nếu là tài khoản quản trị.
6. **Chi tiết sản phẩm (`app/product/[id].tsx`)**: Thông tin quy cách kỹ thuật (mác xi măng, tiêu chuẩn thép, kích thước gạch), thương hiệu, đơn vị tính, chọn số lượng & thêm vào giỏ.
7. **Tìm kiếm & Bộ lọc nâng cao (`app/search.tsx`)**: Tìm kiếm theo tên vật liệu, thương hiệu, lọc theo khoảng giá, sắp xếp tăng/giảm.
8. **Đặt hàng & Giao hàng (`app/checkout.tsx`)**: Nhập địa chỉ công trình, số điện thoại người nhận, chọn phương thức thanh toán COD hoặc Chuyển khoản ngân hàng.
9. **Trợ lý Tư vấn vật liệu AI (`app/ai.tsx`)**: Chat tư vấn định mức thi công, thông số kỹ thuật với Google Gemini AI, có sẵn các câu hỏi gợi ý nhanh.
10. **Đăng nhập (`app/(auth)/login.tsx`)**: Đăng nhập bằng Email/Mật khẩu kèm nút điền nhanh tài khoản kiểm thử.
11. **Đăng ký tài khoản (`app/(auth)/register.tsx`)**: Tạo tài khoản khách hàng mới với đầy đủ xác thực dữ liệu.

### Phân hệ Quản trị viên - Admin (3 màn hình):
12. **Admin - Quản lý tất cả đơn hàng (`app/admin/orders.tsx`)**: Xem toàn bộ đơn đặt hàng từ mọi khách hàng, cập nhật trạng thái đơn (Xác nhận, Đang vận chuyển, Hoàn thành, Hủy).
13. **Admin - Quản lý kho sản phẩm (`app/admin/products.tsx`)**: Xem danh mục hàng trong kho, sửa giá bán, cập nhật số lượng tồn kho, thay đổi ảnh sản phẩm trực tiếp từ máy, xóa sản phẩm.
14. **Admin - Thêm sản phẩm mới (`app/admin/add-product.tsx`)**: Form đăng vật liệu mới: **chọn ảnh từ thư viện thiết bị/camera**, chọn danh mục, đơn vị tính, thông số kỹ thuật và giá bán.

---

## 4. TÀI KHOẢN TRẢI NGHIỆM & KIỂM THỬ

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Khách hàng** | `demo@vlxdhub.vn` | `123456` | Khảo sát giá, chat AI, thêm giỏ hàng, đặt hàng giao công trình, xem lịch sử đơn. |
| **Quản trị viên (Admin)** | `admin@vlxdhub.vn` | `123456` | Toàn quyền Khách hàng + Quản lý đơn hàng toàn hệ thống, Quản lý kho hàng, Thêm sản phẩm kèm ảnh từ điện thoại. |

---

## 5. HƯỚNG DẪN CÀI ĐẶT DỰ ÁN CHO BẠN BÈ / NGƯỜI DÙNG MỚI (CHI TIẾT TỪ A - Z)

### Bước 1: Tải dependencies cho cả Backend và Mobile (Chỉ 1 lệnh duy nhất)
Tại thư mục gốc của đồ án (`vlxd-hub`), mở Terminal (PowerShell hoặc Command Prompt) và chạy:

```bash
npm run install:all
```
> Lệnh này sẽ tự động tải toàn bộ thư viện cho cả thư mục `backend` và thư mục `mobile` mà không lo bị xung đột peer-dependencies!

---

### Bước 2: Cấu hình Cơ sở dữ liệu MongoDB
1. **Khởi động MongoDB:** 
   - Nếu dùng **MongoDB Community Server**: Đảm bảo dịch vụ MongoDB đang chạy tại cổng mặc định `27017`.
   - Nếu mở **MongoDB Compass**, kết nối vào đường dẫn:
     ```text
     mongodb://127.0.0.1:27017
     ```
2. **Tên Database:** Hệ thống sử dụng tên cơ sở dữ liệu là: **`vlxd-hub`**  
   Chuỗi kết nối hoàn chỉnh:
   ```text
   mongodb://127.0.0.1:27017/vlxd-hub
   ```
3. **Nạp dữ liệu mẫu ban đầu (Seed Data):**
   Tại thư mục gốc của đồ án, chạy lệnh:
   ```bash
   npm run seed
   ```
   Lệnh này sẽ tự động tạo sẵn Database `vlxd-hub`, nạp 8 danh mục vật liệu, 26 sản phẩm thực tế và 2 tài khoản mẫu (`demo@vlxdhub.vn` & `admin@vlxdhub.vn`).

---

### Bước 3: Cấu hình File Môi Trường (.env)

#### 1. Cấu hình Backend (`backend/.env`):
Tạo file `backend/.env` (nếu chưa có, sao chép từ `backend/.env.example`):
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/vlxd-hub
JWT_SECRET=vlxd_hub_secret_key_2026_super_secure
GEMINI_API_KEY=your_gemini_api_key_here
```

**Cách lấy và thay Google Gemini API Key:**
1. Truy cập: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Đăng nhập tài khoản Google và bấm nút **"Create API key"**.
3. Sao chép chuỗi khóa (bắt đầu bằng `AIzaSy...`) và dán vào dòng `GEMINI_API_KEY=` trong file `backend/.env`.
4. Khởi động lại Backend để nhận key mới.

#### 2. Cấu hình Mobile App (`mobile/.env`):
Khi test trên điện thoại thật bằng Expo Go, điện thoại và máy tính phải **kết nối chung một mạng Wi-Fi**.

1. Mở Terminal trên máy tính, gõ lệnh `ipconfig` để lấy địa chỉ **IPv4** của máy tính (Ví dụ: `192.168.1.31`).
2. Mở file `mobile/.env` và cập nhật địa chỉ IP:
```env
EXPO_PUBLIC_API_URL=http://<IP_MÁY_TÍNH_CỦA_BẠN>:3000/api
```
*(Ví dụ thực tế: `EXPO_PUBLIC_API_URL=http://192.168.1.31:3000/api`)*

---

### Bước 4: Khởi động và Trải nghiệm ứng dụng

#### Cửa sổ Terminal 1 - Chạy Backend API:
```bash
cd backend
npm start
```
*Server chạy tại cổng `http://localhost:3000` (hoặc `http://<IP_CỦA_BẠN>:3000`). Kiểm tra sức khỏe hệ thống: `http://localhost:3000/api/health`.*

#### Cửa sổ Terminal 2 - Chạy Mobile App (Expo SDK 54):
```bash
cd mobile
npx expo start -c
```
1. Mở app **Expo Go** trên điện thoại Android (phiên bản SDK 54).
2. Quét mã QR hiển thị trên màn hình Terminal máy tính.
3. Ứng dụng sẽ nạp vào điện thoại và bạn có thể trải nghiệm toàn bộ tính năng!

---

## 6. HƯỚNG DẪN ĐẨY DỰ ÁN LÊN GITHUB CỦA BẠN

Nếu bạn muốn lưu trữ đồ án lên tài khoản GitHub cá nhân:

1. Đăng nhập [https://github.com](https://github.com) và tạo một Repository mới (ví dụ đặt tên là: `vlxd-hub`).
2. Mở Terminal tại thư mục gốc `vlxd-hub` và chạy 3 lệnh sau:
```bash
# 1. Gắn đường dẫn GitHub của bạn (thay username và reponame của bạn vào)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/vlxd-hub.git

# 2. Đổi tên nhánh chính thành main
git branch -M main

# 3. Đẩy toàn bộ mã nguồn lên GitHub
git push -u origin main
```
*(File `.env` đã được cấu hình trong `.gitignore` nên thông tin bảo mật và API key sẽ không bị lộ lên GitHub).*
