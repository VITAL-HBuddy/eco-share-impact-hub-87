
import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import GetInvolved from '@/components/GetInvolved';
import ImpactTracker from '@/components/ImpactTracker';
import Trust from '@/components/Trust';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <ImpactTracker />
      <Trust />
      <GetInvolved />
    </div>
  );
};

export default Index;
