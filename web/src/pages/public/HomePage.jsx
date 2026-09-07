import React from 'react';
import { HeroSection } from '../../components/public/HeroSection';
import { TrustSection } from '../../components/public/TrustSection';
import { ServicesGrid } from '../../components/public/ServicesGrid';
import { FeaturedPlans } from '../../components/public/FeaturedPlans';
import { InfrastructureSection, WhyChooseUsSection } from '../../components/public/InfrastructureSection';
import { PricingPreviewSection } from '../../components/public/PricingPreviewSection';
import { DashboardPreviewSection } from '../../components/public/DashboardPreviewSection';
import { FaqSection } from '../../components/public/FaqSection';
import { BottomCtaSection } from '../../components/public/BottomCtaSection';

export function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <HeroSection onNavigate={onNavigate} />
      <TrustSection />
      <ServicesGrid onNavigate={onNavigate} />
      <FeaturedPlans onNavigate={onNavigate} />
      <InfrastructureSection />
      <WhyChooseUsSection />
      <PricingPreviewSection onNavigate={onNavigate} />
      <DashboardPreviewSection onNavigate={onNavigate} />
      <FaqSection />
      <BottomCtaSection onNavigate={onNavigate} />
    </div>
  );
}
