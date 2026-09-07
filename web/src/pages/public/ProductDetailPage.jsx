import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Server,
  HardDrive,
  Globe,
  ShieldCheck,
  Check,
  ShoppingCart,
  Zap,
  ArrowRight,
  Plus,
  Minus,
  MapPin
} from 'lucide-react';
import { PRODUCTS, BILLING_CYCLES } from '../../data/products';
import { DATACENTERS } from '../../data/datacenters';
import { OS_OPTIONS } from '../../data/osList';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatVND, formatGB } from '../../utils/formatters';

export function ProductDetailPage({ productId, queryParams = {}, onNavigate }) {
  const { addToCart } = useCart();
  const { success } = useToast();

  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const isCustomizable = !!product.configOptions;

  // Initial states from product specs or queryParams
  const defaultDatacenter = queryParams.datacenter || 'vn-hn';
  const [selectedDatacenter, setSelectedDatacenter] = useState(defaultDatacenter);
  const [selectedOs, setSelectedOs] = useState('ubuntu-24');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('1m');
  const [hostname, setHostname] = useState(`srv-${product.slug}-${Math.floor(100 + Math.random() * 900)}`);

  // Customizable hardware sliders/steps
  const cpuSteps = product.configOptions?.cpuSteps || [2, 4, 8, 16];
  const ramSteps = product.configOptions?.ramSteps || [2, 4, 8, 16, 32];
  const [selectedCpu, setSelectedCpu] = useState(cpuSteps[0]);
  const [selectedRam, setSelectedRam] = useState(ramSteps[0]);
  const [selectedStorage, setSelectedStorage] = useState(product.configOptions?.storageMin || 40);

  // Addons
  const [extraIps, setExtraIps] = useState(0); // 50,000 VND / IP / month
  const [enableBackup, setEnableBackup] = useState(false); // 50,000 VND / month

  const currentOs = OS_OPTIONS.find(o => o.id === selectedOs) || OS_OPTIONS[0];
  const currentDc = DATACENTERS.find(d => d.id === selectedDatacenter) || DATACENTERS[0];
  const currentCycle = BILLING_CYCLES.find(c => c.id === selectedBillingCycle) || BILLING_CYCLES[0];

  // Price Calculation
  const priceBreakdown = useMemo(() => {
    let monthlyBase = product.basePriceMonthly;

    // CPU extra
    if (product.configOptions?.cpuPricePerUnit) {
      const extraCpuUnits = Math.max(0, selectedCpu - cpuSteps[0]);
      monthlyBase += extraCpuUnits * product.configOptions.cpuPricePerUnit;
    }

    // RAM extra
    if (product.configOptions?.ramPricePerUnit) {
      const extraRamUnits = Math.max(0, selectedRam - ramSteps[0]);
      monthlyBase += extraRamUnits * product.configOptions.ramPricePerUnit;
    }

    // Storage extra
    if (product.configOptions?.storagePricePerUnit) {
      const extraStorageUnits = Math.max(0, selectedStorage - (product.configOptions.storageMin || 40));
      monthlyBase += extraStorageUnits * product.configOptions.storagePricePerUnit;
    }

    // OS extra (Windows license)
    if (!currentOs.free && currentOs.pricePerMonth) {
      monthlyBase += currentOs.pricePerMonth;
    }

    // Addons
    monthlyBase += extraIps * 50000;
    if (enableBackup) monthlyBase += 50000;

    const subtotalRaw = monthlyBase * currentCycle.months;
    const cycleDiscountAmount = Math.round(subtotalRaw * currentCycle.discount);
    const totalAmount = subtotalRaw - cycleDiscountAmount;

    return {
      monthlyBase,
      subtotalRaw,
      cycleDiscountAmount,
      totalAmount
    };
  }, [
    product,
    selectedCpu,
    selectedRam,
    selectedStorage,
    currentOs,
    extraIps,
    enableBackup,
    currentCycle,
    cpuSteps,
    ramSteps
  ]);

  const handleAddToCart = () => {
    addToCart(product, {
      cpu: isCustomizable ? selectedCpu : product.specs.cpu,
      ram: isCustomizable ? selectedRam : product.specs.ram,
      storage: isCustomizable ? selectedStorage : product.specs.storage,
      datacenter: currentDc.name,
      datacenterId: currentDc.id,
      os: currentOs.name,
      osId: currentOs.id,
      osPrice: currentOs.free ? 0 : currentOs.pricePerMonth,
      billingCycleLabel: currentCycle.label,
      billingCycleMonths: currentCycle.months,
      billingCycleDiscount: currentCycle.discount,
      hostname: hostname.trim() || `srv-${product.slug}`
    });

    success('Đã thêm vào giỏ hàng!', `${product.name} đã được thêm vào giỏ hàng.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onNavigate('/checkout');
  };

  return (
    <div className="section-sm">
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Dịch vụ', path: '/services' },
            { label: product.name, path: `/product/${product.id}` }
          ]}
          onNavigate={onNavigate}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }} className="product-config-grid">
          {/* Left Column: Configurator Steps */}
          <div>
            {/* Header info */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">{product.category.toUpperCase()}</span>
                {product.badge && <span className="badge badge-neutral">{product.badge}</span>}
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {product.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                {product.tagline}
              </p>
            </div>

            {/* Step 1: Datacenter Location */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                1. Chọn Vị trí Trung tâm Dữ liệu (Datacenter)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {DATACENTERS.map(dc => {
                  const isSelected = selectedDatacenter === dc.id;
                  return (
                    <div
                      key={dc.id}
                      onClick={() => setSelectedDatacenter(dc.id)}
                      style={{
                        padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{dc.flag}</span>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {dc.name}
                          </span>
                        </div>
                        {isSelected && <Check size={16} color="var(--primary)" strokeWidth={3} />}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {dc.facility} • Độ trễ: <b style={{ color: 'var(--success-text)' }}>{dc.latency}</b>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Hardware Configuration (if customizable) */}
            {isCustomizable && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  2. Tùy Chỉnh Cấu Hình Phần Cứng (Realtime Configurator)
                </div>

                {/* CPU Selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Cpu size={16} color="var(--primary)" />
                      <span>Số lượng vCPU Cores:</span>
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCpu} vCPU</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {cpuSteps.map(step => (
                      <button
                        key={step}
                        type="button"
                        className={`btn btn-sm ${selectedCpu === step ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setSelectedCpu(step)}
                      >
                        {step} Cores
                      </button>
                    ))}
                  </div>
                </div>

                {/* RAM Selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Server size={16} color="var(--primary)" />
                      <span>Dung lượng RAM ECC:</span>
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedRam} GB RAM</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {ramSteps.map(step => (
                      <button
                        key={step}
                        type="button"
                        className={`btn btn-sm ${selectedRam === step ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setSelectedRam(step)}
                      >
                        {step} GB
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <HardDrive size={16} color="var(--primary)" />
                      <span>Dung lượng NVMe Gen4:</span>
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedStorage} GB NVMe</span>
                  </div>
                  <input
                    type="range"
                    min={product.configOptions?.storageMin || 40}
                    max={product.configOptions?.storageMax || 500}
                    step={product.configOptions?.storageStep || 10}
                    value={selectedStorage}
                    onChange={e => setSelectedStorage(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>Min: {product.configOptions?.storageMin || 40} GB</span>
                    <span>Max: {product.configOptions?.storageMax || 500} GB</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Operating System Selection */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                3. Lựa Chọn Hệ Điều Hành (OS Template)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {OS_OPTIONS.map(os => {
                  const isSelected = selectedOs === os.id;
                  return (
                    <div
                      key={os.id}
                      onClick={() => setSelectedOs(os.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{os.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {os.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: os.free ? 'var(--success-text)' : 'var(--text-muted)' }}>
                            {os.free ? 'Miễn phí bản quyền' : `+${formatVND(os.pricePerMonth)}/tháng`}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check size={16} color="var(--primary)" strokeWidth={3} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Hostname & Addons */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                4. Cấu Hình Tên Máy Chủ & Dịch Vụ Mở Rộng
              </div>

              <div className="form-group">
                <label className="form-label">Tên máy chủ (Hostname):</label>
                <input
                  type="text"
                  className="form-input"
                  value={hostname}
                  onChange={e => setHostname(e.target.value)}
                  placeholder="prod-api-server-01.local"
                />
                <span className="form-hint">Dùng để định danh máy chủ trong bảng điều khiển.</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={enableBackup}
                    onChange={e => setEnableBackup(e.target.checked)}
                  />
                  <span>Tự động sao lưu hàng tuần (Weekly Automated Snapshot) (+50.000đ/tháng)</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Bổ sung thêm IPv4 tĩnh riêng (+50.000đ/IP/tháng):
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setExtraIps(Math.max(0, extraIps - 1))}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{extraIps}</span>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setExtraIps(Math.min(8, extraIps + 1))}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Billing Cycle Selector */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                5. Chọn Chu Kỳ Thanh Toán
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {BILLING_CYCLES.map(cycle => {
                  const isSelected = selectedBillingCycle === cycle.id;
                  return (
                    <div
                      key={cycle.id}
                      onClick={() => setSelectedBillingCycle(cycle.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {cycle.label}
                        </span>
                        {cycle.badge && (
                          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                            {cycle.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {cycle.discount > 0 ? `Tiết kiệm ${(cycle.discount * 100).toFixed(0)}% chi phí` : 'Thanh toán tiêu chuẩn'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing Summary Box */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-modal)' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                Tóm Tắt Đơn Hàng
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sản phẩm:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Trung tâm dữ liệu:</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{currentDc.name.split(',')[0]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Hệ điều hành:</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{currentOs.name.split(' ')[0]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Cấu hình vCPU / RAM:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {isCustomizable ? `${selectedCpu} vCPU / ${selectedRam} GB` : `${product.specs.cpu}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dung lượng NVMe:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {isCustomizable ? `${selectedStorage} GB Gen4` : `${product.specs.storage}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Chu kỳ thanh toán:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-text)' }}>{currentCycle.label}</span>
                </div>
              </div>

              {/* Price Calculation Details */}
              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Giá gốc ({currentCycle.months} tháng):</span>
                  <span>{formatVND(priceBreakdown.subtotalRaw)}</span>
                </div>

                {priceBreakdown.cycleDiscountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-text)', fontWeight: 600 }}>
                    <span>Khuyến mãi chu kỳ ({currentCycle.discount * 100}%):</span>
                    <span>-{formatVND(priceBreakdown.cycleDiscountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Thuế VAT:</span>
                  <span>0đ (Miễn phí)</span>
                </div>
              </div>

              {/* Total Payment Amount */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tổng cộng:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatVND(priceBreakdown.totalAmount)}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.25rem' }}>
                  Tương đương {formatVND(Math.round(priceBreakdown.totalAmount / currentCycle.months))}/tháng
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleBuyNow}
                >
                  <Zap size={16} />
                  <span>Mua ngay & Thanh toán</span>
                </button>
                <button
                  className="btn btn-outline btn-block"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={16} />
                  <span>Thêm vào giỏ hàng</span>
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                🔒 Kích hoạt tự động sau 45s • Hoàn tiền 30 ngày
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
