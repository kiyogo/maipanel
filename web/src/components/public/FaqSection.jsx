import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Thời gian khởi tạo máy chủ Cloud Server mất bao lâu?',
      a: 'Quá trình khởi tạo máy chủ tại Nexus Cloud được tự động hóa 100%. Sau khi bạn hoàn tất thanh toán (qua Ví hoặc VietQR), hệ thống sẽ cấp phát IP, cài đặt hệ điều hành và gửi thông tin truy cập root/admin vào màn hình quản lý trong vòng chưa đầy 45 giây.'
    },
    {
      q: 'Tôi có thể nâng cấp CPU, RAM hoặc Ổ cứng sau khi đã mua không?',
      a: 'Hoàn toàn được! Bạn có thể nâng cấp vCPU, RAM hoặc mở rộng dung lượng ổ cứng NVMe bất kỳ lúc nào trực tiếp trong Dashboard mà không làm thay đổi địa chỉ IP hoặc mất dữ liệu hiện có.'
    },
    {
      q: 'Nexus Cloud có hỗ trợ Anti-DDoS không?',
      a: 'Có. Tất cả các gói Cloud Server, VPS và Game Server đều được bảo vệ mặc định bởi hệ thống Anti-DDoS Layer 4/7 dung lượng lọc lên tới 1.2 Tbps đặt tại các trung tâm dữ liệu Viettel IDC và FPT Telecom.'
    },
    {
      q: 'Phương thức thanh toán nào được hỗ trợ?',
      a: 'Chúng tôi hỗ trợ thanh toán trực tuyến tự động qua VietQR (tất cả các ngân hàng tại Việt Nam như MBBank, Vietcombank, Techcombank, VPBank, ACB...), Chuyển khoản Napas 24/7 và Trừ trực tiếp số dư Ví tài khoản.'
    },
    {
      q: 'Chính sách hoàn tiền của Nexus Cloud như thế nào?',
      a: 'Chúng tôi cam kết hoàn tiền 100% trong vòng 30 ngày đầu tiên nếu dịch vụ không đạt chuẩn chất lượng cam kết SLA 99.99% hoặc không đáp ứng nhu cầu kỹ thuật của quý khách.'
    },
    {
      q: 'Hệ thống có tự động sao lưu dữ liệu (Backup) không?',
      a: 'Các gói Cloud Server Pro trở lên đều được tích hợp sao lưu tự động hàng ngày hoặc hàng tuần độc lập. Ngoài ra, bạn có thể chủ động tạo các bản chụp nhanh (Snapshot) miễn phí bất kỳ lúc nào trước khi cập nhật mã nguồn.'
    }
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="section-header">
          <div className="section-tag">
            <span>Câu Hỏi Thường Gặp</span>
          </div>
          <h2 className="section-title">Giải Đáp Thắc Mắc (FAQ)</h2>
          <p className="section-subtitle">
            Những câu hỏi phổ biến nhất về hạ tầng, thanh toán và quản trị máy chủ tại Nexus Cloud.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  border: isOpen ? '1px solid var(--primary-border)' : '1px solid var(--border-color)'
                }}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  <span style={{ color: isOpen ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
