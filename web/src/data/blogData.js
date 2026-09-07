export const BLOG_POSTS = [
  {
    id: 'nang-cap-ha-tang-amd-epyc-gen4',
    title: 'Nexus Cloud hoàn tất nâng cấp 100% cụm máy chủ AMD EPYC™ Gen4',
    slug: 'nang-cap-ha-tang-amd-epyc-gen4',
    category: 'Hạ tầng',
    date: '2026-03-15',
    readTime: '4 phút đọc',
    author: 'Nguyễn Thành Nam (Head of Infrastructure)',
    summary: 'Tăng tốc hiệu năng xử lý đa luồng lên 45% và giảm độ trễ truy xuất dữ liệu với ổ cứng NVMe Gen4 7000MB/s trên toàn bộ cụm Datacenter Viettel IDC & FPT.',
    content: `
Nhằm mang lại trải nghiệm tối ưu nhất cho khách hàng, đội ngũ kỹ thuật Nexus Cloud đã hoàn tất lộ trình nâng cấp phần cứng quy mô lớn nhất năm 2026.

### Điểm nổi bật của đợt nâng cấp:
1. **CPU AMD EPYC™ 9004 Series**: Đạt điểm benchmark Geekbench 6 cao hơn 45% so với thế hệ trước, tối ưu vượt trội cho các tác vụ xử lý đồng thời, cơ sở dữ liệu PostgreSQL/MySQL và Node.js/Go backend.
2. **RAM DDR5 ECC 4800MHz**: Băng thông bộ nhớ tăng gấp đôi, loại bỏ hoàn toàn hiện tượng nghẽn cổ chai khi chạy ứng dụng tải nặng.
3. **Mạng Anycast 40Gbps**: Nâng cấp cổng Uplink tại trung tâm dữ liệu Hà Nội và TP.HCM, đảm bảo độ trễ nội địa dưới 5ms.

Tất cả các máy chủ hiện tại đều đã được di chuyển trực tuyến (Live Migration) mà không gây gián đoạn bất kỳ giây dịch vụ nào của khách hàng.
    `
  },
  {
    id: 'so-sanh-cloud-server-va-vps-truyen-thong',
    title: 'Phân biệt Cloud Server thực thụ và VPS ảo hóa truyền thống',
    slug: 'so-sanh-cloud-server-va-vps-truyen-thong',
    category: 'Kiến thức',
    date: '2026-02-28',
    readTime: '6 phút đọc',
    author: 'Lê Hoàng Minh (Solutions Architect)',
    summary: 'Tìm hiểu sự khác biệt cốt lõi về tính sẵn sàng cao (High Availability), khả năng mở rộng tài nguyên không gián đoạn và độ an toàn dữ liệu.',
    content: `
Rất nhiều người dùng thường nhầm lẫn giữa hai khái niệm VPS và Cloud Server. Tuy nhiên về mặt kiến trúc phần cứng và độ tin cậy, hai giải pháp này có sự khác biệt rất lớn:

### 1. Kiến trúc lưu trữ phân tán (SAN / Ceph Storage)
* **VPS Truyền thống**: Dữ liệu lưu trữ trực tiếp trên ổ cứng vật lý của 1 máy chủ vật lý duy nhất. Nếu máy chủ vật lý hỏng nguồn hoặc bo mạch chủ, toàn bộ VPS trên máy đó sẽ chết.
* **Cloud Server**: Dữ liệu được lưu trên cụm lưu trữ phân tán độc lập (Storage Cluster) với 3 bản sao lưu thời gian thực. Nếu một node tính toán gặp sự cố, hệ thống sẽ tự động khởi động lại Cloud Server trên một node khác trong vài giây.

### 2. Khả năng mở rộng (Scalability)
Cloud Server cho phép bạn tăng thêm vCPU, RAM hoặc dung lượng ổ đĩa chỉ với 1 click mà không cần phải cài đặt lại hệ điều hành hay di chuyển dữ liệu thủ công.
    `
  },
  {
    id: 'toi-uu-bao-mat-server-linux',
    title: 'Top 7 bước tối ưu bảo mật máy chủ Linux cho môi trường Production',
    slug: 'toi-uu-bao-mat-server-linux',
    category: 'Bảo mật',
    date: '2026-01-20',
    readTime: '5 phút đọc',
    author: 'Trần Đức Anh (Security Engineer)',
    summary: 'Hướng dẫn thiết lập UFW firewall, cấu hình Fail2ban, vô hiệu hóa đăng nhập mật khẩu root và cài đặt tự động cập nhật bản vá bảo mật.',
    content: `
Bảo mật máy chủ là yếu tố sống còn đối với mọi ứng dụng trực tuyến. Dưới đây là 7 bước căn bản bắt buộc phải thực hiện ngay sau khi khởi tạo máy chủ Linux mới:

1. **Cập nhật gói hệ điều hành**: \`sudo apt update && sudo apt upgrade -y\`
2. **Tạo người dùng quản trị có quyền sudo** và không sử dụng trực tiếp tài khoản root.
3. **Cấu hình SSH Key Authentication** và vô hiệu hóa \`PasswordAuthentication no\`.
4. **Cài đặt và kích hoạt UFW Firewall**: Chỉ mở các cổng thực sự cần thiết (80, 443, port SSH tùy chỉnh).
5. **Cài đặt Fail2ban** để tự động chặn các địa chỉ IP cố tình dò quét mật khẩu (Brute Force).
6. **Bật Automatic Security Updates** (unattended-upgrades) để vá lỗi kernel tự động.
7. **Cấu hình sao lưu định kỳ ra Object Storage độc lập**.
    `
  }
];
