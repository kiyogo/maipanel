import React from 'react';
import { Cpu, HardDrive, Network, Building2, Shield, RefreshCw } from 'lucide-react';

export function InfrastructureSection() {
  const infraItems = [
    {
      icon: Cpu,
      title: 'Vi Xử Lý AMD EPYC™ Gen4',
      desc: 'Sử dụng kiến trúc Zen 4 mới nhất với xung nhịp cao và IPC vượt trội, đảm bảo hiệu suất tính toán xử lý đồng thời không bị suy giảm.'
    },
    {
      icon: HardDrive,
      title: '100% NVMe Enterprise RAID 10',
      desc: 'Ổ cứng thể rắn NVMe U.2 Enterprise với tốc độ đọc ghi tuần tự lên đến 7,000 MB/s và IOPS đạt 800,000, chống mất dữ liệu khi hỏng ổ vật lý.'
    },
    {
      icon: Network,
      title: 'Hạ Tầng Mạng BGP Anycast 40Gbps',
      desc: 'Định tuyến thông minh qua 4 nhà mạng lớn (Viettel, VNPT, FPT, CMC) và tuyến cáp quang quốc tế trực tiếp, độ trễ cực thấp dưới 5ms nội địa.'
    },
    {
      icon: Building2,
      title: 'Trung Tâm Dữ Liệu Chuẩn Tier 3',
      desc: 'Vận hành tại Viettel IDC Pháp Vân và FPT Q9 High-Tech Park với nguồn điện dự phòng kép 2N, máy phát điện và hệ thống làm mát N+1.'
    },
    {
      icon: Shield,
      title: 'Anti-DDoS Hardware Filter 1.2 Tbps',
      desc: 'Bảo vệ tự động 24/7 trước mọi đợt tấn công từ chối dịch vụ phân tán Layer 3/4/7, tự động loại bỏ traffic xấu mà không làm nghẽn dịch vụ.'
    },
    {
      icon: RefreshCw,
      title: 'Kiến Trúc Tự Động Phục Hồi (Auto-Failover)',
      desc: 'Nếu một máy chủ vật lý gặp sự cố phần cứng, hệ thống SAN Cluster sẽ tự động chuyển và khởi động lại Cloud Server trên node khác trong vài giây.'
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>Phần Cứng & Hạ Tầng</span>
          </div>
          <h2 className="section-title">Hạ Tầng Tiêu Chuẩn Doanh Nghiệp Quốc Tế</h2>
          <p className="section-subtitle">
            Mọi dịch vụ của Nexus Cloud đều được xây dựng trên nền tảng phần cứng cao cấp nhất hiện nay.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {infraItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card"
                style={{ padding: '1.75rem', backgroundColor: 'var(--bg-card)' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--primary-border)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.625rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  const reasons = [
    {
      step: '01',
      title: 'Hiệu Năng Ổn Định & Cam Kết 99.99% SLA',
      desc: 'Tài nguyên CPU/RAM được cô lập hoàn toàn, không chia sẻ quá mức (no overcommit), đảm bảo hiệu năng luôn đạt đỉnh 24/7.'
    },
    {
      step: '02',
      title: 'Bảng Giá Minh Bạch - Không Chi Phí Ẩn',
      desc: 'Miễn phí lưu lượng truyền tải (Unmetered Bandwidth), miễn phí IPv6, miễn phí Anti-DDoS và không phát sinh phí phụ bất ngờ.'
    },
    {
      step: '03',
      title: 'Kích Hoạt Tức Thì Dưới 45 Giây',
      desc: 'Quy trình khởi tạo máy chủ hoàn toàn tự động ngay sau khi thanh toán thành công qua VietQR hoặc Ví tài khoản.'
    },
    {
      step: '04',
      title: 'Bảng Điều Khiển Trực Quan & Đầy Đủ Tính Năng',
      desc: 'Dễ dàng quản lý nguồn, cài lại hệ điều hành, tạo snapshot, giám sát CPU/RAM realtime và truy cập Web Console trực tiếp.'
    },
    {
      step: '05',
      title: 'Đội Ngũ Kỹ Sư Trực 24/7/365',
      desc: 'Hỗ trợ kỹ thuật thực sự bởi các kỹ sư có chứng chỉ Red Hat và Linux Foundation, phản hồi ticket trung bình dưới 15 phút.'
    },
    {
      step: '06',
      title: 'Sao Lưu Tự Động & An Toàn Dữ Liệu Tuyệt Đối',
      desc: 'Hệ thống snapshot định kỳ độc lập lưu trữ tại cụm Backup riêng biệt, giúp khôi phục hệ thống chỉ với 1 cú nhấp chuột.'
    }
  ];

  return (
    <section className="section section-bg-secondary">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>Tại sao chọn Nexus Cloud</span>
          </div>
          <h2 className="section-title">Lý Do Hơn 10.000+ Khách Hàng Tin Tưởng</h2>
          <p className="section-subtitle">
            Chúng tôi tập trung vào sự đơn giản, độ ổn định và trải nghiệm người dùng thực chất.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="card"
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '1.75rem',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--primary-text)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '0.75rem'
                }}
              >
                {r.step}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.625rem' }}>
                {r.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
