export const DOCS_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Bắt đầu nhanh',
    icon: 'Rocket',
    articles: [
      {
        id: 'intro',
        title: 'Giới thiệu về Nexus Cloud Platform',
        summary: 'Tổng quan về kiến trúc đám mây, các loại dịch vụ và phương thức vận hành.',
        content: `
### Chào mừng bạn đến với Nexus Cloud

Nexus Cloud là nền tảng điện toán đám mây thế hệ mới được tối ưu hóa cho tốc độ xử lý cao, độ trễ thấp và tính sẵn sàng 99.99%. 

#### Các tính năng cốt lõi:
1. **Khởi tạo tức thì**: Máy chủ Cloud Server và VPS được tự động cấp phát trong vòng dưới 45 giây sau khi hoàn tất thanh toán.
2. **Hạ tầng 100% NVMe Enterprise**: Sử dụng ổ cứng Samsung PM9A3 / Kioxia CM6 Gen4 PCIe với IOPS lên đến 800,000 IOPS.
3. **Mạng BGP Đa hướng**: Kết nối trực tiếp 4 nhà mạng lớn tại Việt Nam (Viettel, VNPT, FPT, CMC) cùng tuyến cáp quốc tế riêng biệt.
4. **Anti-DDoS Shield**: Bộ lọc phần cứng tự động bảo vệ trước các cuộc tấn công SYN Flood, UDP Flood, NTP Amplification và HTTP/S Layer 7.

#### Hướng dẫn các bước tạo dịch vụ đầu tiên:
* **Bước 1**: Đăng ký tài khoản hoặc đăng nhập vào hệ thống.
* **Bước 2**: Lựa chọn gói dịch vụ phù hợp tại trang Dịch vụ hoặc Cloud Server.
* **Bước 3**: Tùy chỉnh cấu hình (CPU, RAM, Ổ cứng, Vị trí Datacenter, Hệ điều hành).
* **Bước 4**: Tiến hành thanh toán qua Ví tài khoản hoặc VietQR tự động.
* **Bước 5**: Quản lý máy chủ trực tiếp tại mục **Dịch vụ của tôi** trên Dashboard.
        `
      },
      {
        id: 'ssh-rdp-connection',
        title: 'Hướng dẫn kết nối SSH và Remote Desktop',
        summary: 'Cách truy cập quản trị máy chủ Linux qua SSH và máy chủ Windows qua Remote Desktop Protocol (RDP).',
        content: `
### Kết nối máy chủ Linux qua SSH

Sau khi máy chủ được khởi tạo, bạn sẽ nhận được thông tin địa chỉ **IPv4 Public** và **mật khẩu root** ban đầu.

#### Kết nối trên Terminal (macOS / Linux / Windows PowerShell):
\`\`\`bash
ssh root@103.145.62.110 -p 22
\`\`\`
* Nhập \`yes\` khi hệ thống hỏi xác nhận vân tay khóa máy chủ (fingerprint).
* Nhập mật khẩu root được cấp.

#### Bảo mật SSH khuyến nghị:
1. Đổi cổng mặc định SSH (Ví dụ: chuyển từ cổng 22 sang 2222):
\`\`\`bash
sudo nano /etc/ssh/sshd_config
# Tìm dòng #Port 22 và sửa thành:
Port 2222
sudo systemctl restart sshd
\`\`\`
2. Cấu hình xác thực bằng SSH Key Pair thay cho mật khẩu thông thường.

---

### Kết nối máy chủ Windows qua Remote Desktop (RDP)

1. Mở ứng dụng **Remote Desktop Connection** trên Windows (\`mstsc.exe\`) hoặc **Microsoft Remote Desktop** trên macOS.
2. Nhập địa chỉ IP của máy chủ vào ô **Computer** (Ví dụ: \`103.145.62.110:3389\`).
3. Nhập tên đăng nhập: \`Administrator\`.
4. Nhập mật khẩu quản trị viên được gửi trong chi tiết dịch vụ.
        `
      }
    ]
  },
  {
    id: 'cloud-servers',
    title: 'Quản lý Cloud Server',
    icon: 'Cloud',
    articles: [
      {
        id: 'power-management',
        title: 'Điều khiển nguồn: Start, Stop, Restart & VNC Console',
        summary: 'Quản lý chu trình hoạt động của máy chủ ảo và sử dụng VNC Console khẩn cấp khi mất kết nối mạng.',
        content: `
### Quản lý trạng thái máy chủ (Power Actions)

Trên giao diện chi tiết máy chủ tại Dashboard, bạn có các nút điều khiển trực tiếp:

* **Start (Khởi động)**: Bật máy chủ khi đang ở trạng thái Stopped.
* **Stop (Tắt máy)**: Gửi tín hiệu ACPI Shutdown an toàn hoặc buộc tắt máy.
* **Restart (Khởi động lại)**: Reboot máy chủ nhanh chóng.
* **Reinstall OS (Cài lại hệ điều hành)**: Format ổ đĩa và cài đặt lại hệ điều hành mới trong 2 phút.

### Web Console (VNC Out-of-band)
Khi bạn vô tình cấu hình sai Firewall (UFW / iptables) hoặc dịch vụ SSH bị treo, tính năng **Web Console** cho phép bạn truy cập trực tiếp màn hình máy chủ qua giao thức VNC ảo mà không phụ thuộc vào mạng IP của máy chủ.
        `
      },
      {
        id: 'snapshot-backup',
        title: 'Sao lưu Snapshot và Khôi phục dữ liệu',
        summary: 'Tạo bản chụp trạng thái máy chủ tức thì (Point-in-time Snapshot) trước khi nâng cấp ứng dụng.',
        content: `
### Snapshot là gì?
Snapshot là bản chụp nguyên vẹn toàn bộ dữ liệu ổ cứng của máy chủ tại một thời điểm nhất định. Thời gian tạo snapshot chỉ mất 5 - 10 giây và không làm gián đoạn dịch vụ đang chạy.

#### Quy trình tạo Snapshot:
1. Truy cập vào trang Quản lý máy chủ > Tab **Snapshot & Sao lưu**.
2. Nhấn nút **Tạo Snapshot mới**.
3. Đặt tên gợi nhớ cho bản snapshot (Ví dụ: \`pre-update-nodejs-v20\`).
4. Nhấn **Xác nhận**.

#### Khôi phục (Rollback):
Khi cần quay trở lại trạng thái cũ, bạn chỉ cần chọn bản snapshot mong muốn và nhấn **Khôi phục**. Máy chủ sẽ khởi động lại với dữ liệu chính xác tại thời điểm chụp snapshot.
        `
      }
    ]
  },
  {
    id: 'api-developer',
    title: 'API & Tích hợp Lập trình',
    icon: 'Code2',
    articles: [
      {
        id: 'api-authentication',
        title: 'Xác thực API & Quản lý API Keys',
        summary: 'Sử dụng RESTful API của Nexus Cloud để tự động hóa hạ tầng và tích hợp vào hệ thống CI/CD.',
        content: `
### RESTful API Nexus Cloud v1

Hệ thống cung cấp đầy đủ API quản lý máy chủ, thanh toán và giám sát tài nguyên.

#### Định dạng Header xác thực:
Tất cả các API request đều yêu cầu Bearer Token trong Header:
\`\`\`http
Authorization: Bearer nxc_live_9a8f7b6c5d4e3f2a1b0c
Content-Type: application/json
\`\`\`

#### Ví dụ gọi API lấy danh sách máy chủ bằng cURL:
\`\`\`bash
curl -X GET "https://api.nexuscloud.vn/v1/servers" \\
  -H "Authorization: Bearer nxc_live_9a8f7b6c5d4e3f2a1b0c" \\
  -H "Content-Type: application/json"
\`\`\`

#### Ví dụ tạo máy chủ mới (Python SDK):
\`\`\`python
import requests

url = "https://api.nexuscloud.vn/v1/servers/create"
headers = {
    "Authorization": "Bearer nxc_live_9a8f7b6c5d4e3f2a1b0c",
    "Content-Type": "application/json"
}
payload = {
    "plan": "cloud-pro",
    "datacenter": "vn-hn",
    "os": "ubuntu-24",
    "hostname": "prod-api-server-01"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
\`\`\`
        `
      }
    ]
  }
];
