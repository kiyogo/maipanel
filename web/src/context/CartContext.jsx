import React, { createContext, useContext, useState, useEffect } from 'react';
import { COUPONS } from '../data/products';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing cart from storage', e);
      }
    }
    return [];
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, config = {}) => {
    // Calculate custom item price based on config if provided
    let itemPrice = product.basePriceMonthly;
    
    // Additional CPU / RAM / Disk pricing if customizable
    if (config.cpu && product.configOptions?.cpuPricePerUnit) {
      const extraCpu = Math.max(0, config.cpu - (product.configOptions.cpuSteps[0] || 2));
      itemPrice += extraCpu * product.configOptions.cpuPricePerUnit;
    }
    if (config.ram && product.configOptions?.ramPricePerUnit) {
      const extraRam = Math.max(0, config.ram - (product.configOptions.ramSteps[0] || 2));
      itemPrice += extraRam * product.configOptions.ramPricePerUnit;
    }
    if (config.storage && product.configOptions?.storagePricePerUnit) {
      const extraStorage = Math.max(0, config.storage - (product.configOptions.storageMin || 40));
      itemPrice += extraStorage * product.configOptions.storagePricePerUnit;
    }
    if (config.osPrice) {
      itemPrice += config.osPrice;
    }

    // Billing cycle multiplier & discount
    const months = config.billingCycleMonths || 1;
    const cycleDiscount = config.billingCycleDiscount || 0;
    const subtotalRaw = itemPrice * months;
    const finalItemPrice = Math.round(subtotalRaw * (1 - cycleDiscount));

    const cartItem = {
      cartItemId: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      productId: product.id,
      productName: product.name,
      category: product.category,
      config: {
        cpu: config.cpu || product.specs.cpu,
        ram: config.ram || product.specs.ram,
        storage: config.storage || product.specs.storage,
        datacenter: config.datacenter || 'Hà Nội, VN (Viettel IDC)',
        datacenterId: config.datacenterId || 'vn-hn',
        os: config.os || 'Ubuntu 24.04 LTS',
        osId: config.osId || 'ubuntu-24',
        billingCycleLabel: config.billingCycleLabel || '1 Tháng',
        billingCycleMonths: months,
        billingCycleDiscount: cycleDiscount,
        hostname: config.hostname || `srv-${Math.random().toString(36).substring(2, 7)}`
      },
      unitPriceMonthly: itemPrice,
      totalPrice: finalItemPrice,
      quantity: 1
    };

    setItems(prev => [...prev, cartItem]);
    return cartItem;
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const applyCoupon = (code) => {
    const trimmed = code.trim().toUpperCase();
    const found = COUPONS.find(c => c.code === trimmed);

    if (!found) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }

    const currentSubtotal = items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    if (found.minOrder && currentSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Mã này chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(found.minOrder)}đ trở lên.`
      };
    }

    setAppliedCoupon(found);
    setCouponCode(trimmed);
    return { success: true, message: `Áp dụng thành công mã ${found.code}: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Compute Totals
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountFixed) {
      discount = appliedCoupon.discountFixed;
    }
  }

  // VAT (0% standard for digital export / included in base or 0 for demo)
  const tax = 0;
  const total = Math.max(0, subtotal - discount + tax);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        tax,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
