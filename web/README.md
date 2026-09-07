# Web — NEXUS CLOUD

Website tiếng Việt giới thiệu dịch vụ cloud, kèm giao diện đặt hàng, bảng điều khiển khách hàng và trang quản trị. Đây là ứng dụng React chạy trong trình duyệt, dùng dữ liệu mẫu và `localStorage` để mô phỏng nghiệp vụ.

**Trạng thái hiện tại:** chưa kết nối backend, cơ sở dữ liệu, hạ tầng cloud hoặc cổng thanh toán. Thư mục này chạy độc lập với [Kpanel](../kpanel/README.md) và [Minepanel](../minepanel/README.md); đưa các dự án vào cùng repository không tự tạo tích hợp giữa chúng.

## Công nghệ và yêu cầu

- React 18, JavaScript/JSX, React Context và CSS thuần.
- Vite 6, plugin React và thư viện biểu tượng `lucide-react`.
- Điều hướng bằng `window.history.pushState`/`popstate` trong `src/App.jsx`.
- Node.js 22 trở lên và npm. Dự án không khai báo `engines`; bản Vite trong lockfile chấp nhận Node `^18.0.0 || ^20.0.0 || >=22.0.0`.
- Trình duyệt có JavaScript và cho phép lưu `localStorage`.

Phiên bản cài đặt được cố định bởi `package-lock.json`. Không cần PHP, MySQL hoặc chạy API của panel để xem bản demo này.

## Chạy cục bộ

Từ thư mục gốc repository:

```sh
cd web
npm ci
npm run dev
```

Mở địa chỉ Vite in trong terminal. Cấu hình yêu cầu cổng `3000`, thông thường là `http://localhost:3000`; Vite có thể chọn cổng khác nếu cổng này đã được sử dụng.

Ứng dụng hiện không đọc biến môi trường và không yêu cầu file `.env`.

| Lệnh | Chức năng |
| --- | --- |
| `npm run dev` | Chạy máy chủ phát triển Vite. |
| `npm run build` | Biên dịch mã nguồn, tạo thư mục `dist/`. |
| `npm run preview` | Xem thử bản `dist/` đã build trên máy cục bộ. |

Chạy lần lượt `npm run build` và `npm run preview` để kiểm tra bản build. `preview` chỉ dùng để xem thử, không phải cấu hình vận hành website.

## Các phần giao diện

| Phần | Đường dẫn tiêu biểu | Nội dung |
| --- | --- | --- |
| Website giới thiệu | `/`, `/services`, `/cloud-server`, `/pricing`, `/product/:id` | Danh mục, giá mẫu và cấu hình sản phẩm: cloud server, VPS, game server, hosting, storage, backup, tên miền. |
| Đặt hàng | `/cart`, `/checkout` | Giỏ hàng, chu kỳ thanh toán, mã giảm giá, tạo đơn hàng mô phỏng. |
| Nội dung | `/docs`, `/blog`, `/blog/:slug`, `/status`, `/contact` | Tài liệu mẫu, bài viết, trạng thái hạ tầng và biểu mẫu liên hệ. |
| Chính sách | `/terms`, `/privacy`, `/sla`, `/refund` | Nội dung chính sách có sẵn trong mã nguồn. |
| Tài khoản | `/login`, `/register`, `/forgot-password` | Luồng tài khoản demo và chuyển vai trò khách hàng/quản trị viên. |
| Khách hàng | `/dashboard` và các trang con | Dịch vụ, đơn hàng/hóa đơn, ví, ticket, hồ sơ, API key và thông báo. |
| Quản trị | `/admin` và các trang con | Tổng quan, sản phẩm, đơn hàng, người dùng, ticket, mã giảm giá và nhật ký thao tác. |

Giao diện có chế độ sáng/tối, tìm kiếm và bố cục đáp ứng trên thiết bị nhỏ.

## Dùng thử và dữ liệu

Khi chưa có trạng thái đã lưu, `AuthContext` tự chọn tài khoản khách hàng mẫu. Có thể chuyển vai trò bằng menu tài khoản hoặc các nút **Khách hàng** / **Admin Portal** trên trang `/login`.

Hàm đăng nhập không kiểm tra mật khẩu thực tế. Quyền quản trị được suy ra từ đối tượng người dùng trong trình duyệt. Các hành động bật/tắt máy chủ, cài lại hệ điều hành, snapshot, thay đổi số dư, thanh toán, ticket và API key chỉ cập nhật dữ liệu demo. Terminal hiển thị phản hồi lập trình sẵn; không tạo kết nối SSH, VNC hoặc WebSocket. Chỉ số tài nguyên được thay đổi ngẫu nhiên theo thời gian.

Biểu mẫu liên hệ và quên mật khẩu hiển thị thông báo thành công trong giao diện, chưa gửi yêu cầu hoặc email. Bật/tắt 2FA hiện chỉ đổi trạng thái người dùng; chưa xác minh OTP. Mã QR và thông tin chuyển khoản trong giao diện là nội dung mẫu, chưa có đối soát thanh toán.

Các khóa lưu trữ đều bắt đầu bằng `nexus_cloud_`, bao gồm người dùng, giỏ hàng, giao diện và dữ liệu nghiệp vụ. Dữ liệu này không đồng bộ giữa thiết bị và không được tách thành cơ sở dữ liệu riêng cho từng tài khoản. Để đặt lại demo, xóa các khóa có tiền tố này trong mục Local Storage của Developer Tools rồi tải lại trang; không cần xóa dữ liệu của ứng dụng khác.

## Cấu trúc mã nguồn

```text
web/
├── public/                  # Favicon và tài nguyên tĩnh
├── src/
│   ├── components/
│   │   ├── common/          # Header, footer, modal, tìm kiếm...
│   │   ├── public/          # Các khối của website giới thiệu
│   │   ├── dashboard/       # Layout khách hàng và terminal demo
│   │   └── admin/           # Layout quản trị
│   ├── context/             # Auth, dữ liệu cloud, giỏ hàng, theme, toast
│   ├── data/                # Sản phẩm, người dùng/dịch vụ mẫu, blog, docs
│   ├── pages/               # public, auth, dashboard, admin, error
│   ├── styles/              # Theme, layout, components và dashboard
│   ├── utils/               # Định dạng tiền tệ, ngày và trạng thái
│   ├── App.jsx              # Chọn trang theo URL
│   ├── main.jsx             # Điểm khởi tạo React và các provider
│   └── index.css            # CSS tổng
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Tùy chỉnh nội dung

- Sản phẩm, giá, chu kỳ và mã giảm giá: `src/data/products.js`.
- Dữ liệu khởi tạo của dashboard: `src/data/initialData.js`.
- Hệ điều hành và trung tâm dữ liệu: `src/data/osList.js`, `src/data/datacenters.js`.
- Bài viết và hướng dẫn: `src/data/blogData.js`, `src/data/docsData.js`.
- Thương hiệu, metadata và font: `index.html`, các component header/footer và `src/styles/`.
- Luồng mô phỏng: `src/context/AuthContext.jsx`, `src/context/CloudDataContext.jsx`.

Dữ liệu đã lưu trong trình duyệt có thể ghi đè dữ liệu khởi tạo sau khi sửa file; đặt lại các khóa tương ứng khi kiểm tra thay đổi.

Các tài nguyên bên ngoài gồm Google Fonts, ảnh đại diện Unsplash và ảnh QR từ `api.qrserver.com`. Trình duyệt cần mạng để tải các tài nguyên này. Những URL API ghi trong trang tài liệu là ví dụ nội dung, không phải tích hợp API của ứng dụng.

## Build và phục vụ tĩnh

```sh
npm ci
npm run build
```

Phục vụ nội dung `dist/` bằng web server có cấu hình SPA fallback về `index.html`. Nếu không có fallback, truy cập trực tiếp hoặc tải lại các URL như `/dashboard/services` có thể trả về 404.

`web/` là đường dẫn mã nguồn trong repository. Ứng dụng hiện giả định được phục vụ tại gốc tên miền (`/`): các link điều hướng và tài nguyên dùng đường dẫn bắt đầu bằng `/`. Muốn phục vụ dưới `/web/`, cần sửa cả `base` của Vite lẫn logic đường dẫn/điều hướng; chỉ đổi tên thư mục hoặc chép `dist/` vào thư mục con là chưa đủ.

Chỉ commit mã nguồn, tài nguyên và lockfile. `node_modules/`, `dist/`, log và cấu hình bí mật cục bộ không thuộc mã nguồn cần đưa lên Git.

## Kiểm tra

Chưa có script lint hoặc bộ kiểm thử tự động trong `package.json`. Kiểm tra tối thiểu:

1. `npm ci` và `npm run build` hoàn tất.
2. Dùng `npm run preview`, kiểm tra trang chủ, danh mục, sản phẩm và giỏ hàng.
3. Mở `/login`, thử hai vai trò demo và điều hướng trong dashboard/admin.
4. Thực hiện một thao tác mô phỏng, tải lại trang để kiểm tra lưu dữ liệu.
5. Kiểm tra sáng/tối, menu trên màn hình nhỏ và nút Back/Forward.
6. Khi đưa lên web server, thử mở trực tiếp một URL con để kiểm tra SPA fallback.

Trước khi dùng cho dịch vụ thực tế, cần triển khai API và xác thực/phân quyền phía server, tích hợp hạ tầng và thanh toán, thay dữ liệu/tài nguyên mẫu, đồng thời kiểm tra lại nội dung giá, SLA và chính sách. Không nhập thông tin đăng nhập, khóa API hoặc thông tin thanh toán thật vào bản demo.
